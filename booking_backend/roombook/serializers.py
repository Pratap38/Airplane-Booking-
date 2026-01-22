from rest_framework import serializers
from django.db import transaction
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken

from .models import Airport, Airline, Flight, Seat, Booking


# =========================
# Airport / Airline / Flight
# =========================

class AirportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Airport
        fields = ('id', 'code', 'name', 'city')


class AirlineSerializer(serializers.ModelSerializer):
    class Meta:
        model = Airline
        fields = ('id', 'code', 'name')


class SeatSerializer(serializers.ModelSerializer):
    class Meta:
        model = Seat
        fields = ('id', 'seat_number', 'seat_class', 'is_reserved')


class FlightListSerializer(serializers.ModelSerializer):
    airline = AirlineSerializer(read_only=True)
    origin = AirportSerializer(read_only=True)
    destination = AirportSerializer(read_only=True)

    class Meta:
        model = Flight
        fields = (
            'id', 'airline', 'flight_number',
            'origin', 'destination',
            'departure', 'arrival', 'price'
        )


class FlightDetailSerializer(serializers.ModelSerializer):
    airline = AirlineSerializer(read_only=True)
    origin = AirportSerializer(read_only=True)
    destination = AirportSerializer(read_only=True)
    seats = SeatSerializer(many=True, read_only=True)

    class Meta:
        model = Flight
        fields = (
            'id', 'airline', 'flight_number',
            'origin', 'destination',
            'departure', 'arrival',
            'price', 'seats'
        )


# =========================
# Booking
# =========================

class BookingCreateSerializer(serializers.ModelSerializer):
    flight = serializers.PrimaryKeyRelatedField(queryset=Flight.objects.all())
    seat = serializers.PrimaryKeyRelatedField(queryset=Seat.objects.all())

    class Meta:
        model = Booking
        fields = ('flight', 'seat', 'passenger_name', 'passenger_email')

    def validate(self, data):
        seat = data['seat']
        flight = data['flight']

        if seat.flight_id != flight.id:
            raise serializers.ValidationError("Seat does not belong to this flight.")

        if seat.is_reserved:
            raise serializers.ValidationError("Seat already reserved.")

        return data

    def create(self, validated_data):
        request = self.context.get('request')
        user = request.user if request and request.user.is_authenticated else None

        with transaction.atomic():
            seat = Seat.objects.select_for_update().get(pk=validated_data['seat'].pk)

            if seat.is_reserved:
                raise serializers.ValidationError("Seat already booked.")

            seat.is_reserved = True
            seat.save()

            booking = Booking.objects.create(
                user=user,
                flight=validated_data['flight'],
                seat=seat,
                passenger_name=validated_data['passenger_name'],
                passenger_email=validated_data['passenger_email'],
                status='confirmed'
            )

            return booking


class BookingDetailSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()
    flight = FlightListSerializer(read_only=True)
    seat = SeatSerializer(read_only=True)

    class Meta:
        model = Booking
        fields = (
            'id', 'user', 'flight', 'seat',
            'passenger_name', 'passenger_email',
            'status', 'created_at'
        )


# =========================
# AUTH SERIALIZERS
# =========================

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = User
        fields = ("username", "email", "password")

    def create(self, validated_data):
        # Use email as username internally
        return User.objects.create_user(
            username=validated_data["email"],  # Use email as username
            email=validated_data["email"],
            password=validated_data["password"]
        )

class EmailTokenObtainPairSerializer(serializers.Serializer):
    """Custom serializer to use email instead of username for login"""
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    
    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')
        
        # Authenticate using email as username
        user = authenticate(username=email, password=password)
        
        if user is None:
            raise serializers.ValidationError('Invalid email or password')
        
        if not user.is_active:
            raise serializers.ValidationError('User account is disabled')
        
        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)
        
        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email
            }
        }