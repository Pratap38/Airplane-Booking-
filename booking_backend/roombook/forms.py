# flight_booking/forms.py
from django import forms
from .models import Airline, Airport, Flight, Booking, Seat

class FlightForm(forms.ModelForm):
    class Meta:
        model = Flight
        fields = ['airline', 'flight_number', 'origin', 'destination', 'departure', 'arrival', 'price', 'available_seats', 'status']
        widgets = {
            'departure': forms.DateTimeInput(attrs={'type': 'datetime-local'}, format='%Y-%m-%dT%H:%M'),
            'arrival': forms.DateTimeInput(attrs={'type': 'datetime-local'}, format='%Y-%m-%dT%H:%M'),
        }

class BookingForm(forms.ModelForm):
    class Meta:
        model = Booking
        fields = ['user', 'flight', 'passenger_name', 'passenger_email', 'status']


class AirportForm(forms.ModelForm):
    class Meta:
        model = Airport
        fields = ['code', 'name', 'city']

class AirlineForm(forms.ModelForm):
    class Meta:
        model = Airline
        fields = ['code', 'name']

class SeatForm(forms.ModelForm):
    class Meta:
        model = Seat
        fields = ['flight', 'seat_number', 'seat_class', 'is_reserved'] 