from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView

from django.db.models import Q
from datetime import datetime

from .models import Flight, Booking, Airport
from .serializers import (
    FlightListSerializer, FlightDetailSerializer,
    BookingCreateSerializer, BookingDetailSerializer,
    RegisterSerializer, EmailTokenObtainPairSerializer
)


class FlightViewSet(viewsets.ModelViewSet):
    """
    ViewSet to handle listing and searching flights.
    """
    queryset = Flight.objects.select_related('airline', 'origin', 'destination').all()
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return FlightDetailSerializer
        return FlightListSerializer

    def get_queryset(self):
        queryset = self.queryset
        
        # Capture search parameters from React Axios request
        origin_query = self.request.query_params.get('origin')
        destination_query = self.request.query_params.get('destination')
        date_query = self.request.query_params.get('date')

        # 1. Filter by Origin (Name or Code)
        if origin_query:
            queryset = queryset.filter(
                Q(origin__name__icontains=origin_query) | 
                Q(origin__code__icontains=origin_query) |
                Q(origin__city__icontains=origin_query)
            )

        # 2. Filter by Destination (Name or Code)
        if destination_query:
            queryset = queryset.filter(
                Q(destination__name__icontains=destination_query) | 
                Q(destination__code__icontains=destination_query) |
                Q(destination__city__icontains=destination_query)
            )

        # 3. Filter by Date (YYYY-MM-DD)
        if date_query:
            try:
                parsed_date = datetime.strptime(date_query, '%Y-%m-%d').date()
                queryset = queryset.filter(departure__date=parsed_date)
            except ValueError:
                pass

        return queryset.distinct()

class BookingViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Booking.objects.select_related(
            'flight',
            'flight__airline',
            'flight__origin',
            'flight__destination',
            'seat'
        ).filter(user=self.request.user)


    def get_serializer_class(self):
        if self.action == 'create':
            return BookingCreateSerializer
        return BookingDetailSerializer


class RegisterView(APIView):
    """User registration endpoint"""
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if not serializer.is_valid():
            print("Registration errors:", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        user = serializer.save()
        return Response({
            "message": "User registered successfully",
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email
            }
        }, status=status.HTTP_201_CREATED)


class EmailTokenObtainPairView(TokenObtainPairView):
    """Custom login view that uses email instead of username"""
    serializer_class = EmailTokenObtainPairSerializer
    permission_classes = [AllowAny]



class ProfileView(APIView):
    """Get current user profile"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            "id": user.id,
            "username": user.username,
            "email": user.email
        })