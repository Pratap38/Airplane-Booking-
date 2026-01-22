# flights/admin.py
from django.contrib import admin
from .models import Airport, Airline, Flight, Seat, Booking


class SeatInline(admin.TabularInline):
    model = Seat
    extra = 0
    readonly_fields = ('is_reserved',)
    fields = ('seat_number', 'seat_class', 'is_reserved')

@admin.register(Flight)
class FlightAdmin(admin.ModelAdmin):
    list_display = ('id','airline','flight_number','origin','destination','departure','arrival','price')
    list_filter = ('airline','origin','destination')
    search_fields = ('flight_number','origin__code','destination__code')
    inlines = [SeatInline]
    ordering = ('departure',)

@admin.register(Airport)
class AirportAdmin(admin.ModelAdmin):
    list_display = ('code','name','city')
    search_fields = ('code','name','city')

@admin.register(Airline)
class AirlineAdmin(admin.ModelAdmin):
    list_display = ('name','code')
    search_fields = ('name','code')

@admin.register(Seat)
class SeatAdmin(admin.ModelAdmin):
    list_display = ('flight','seat_number','seat_class','is_reserved')
    list_filter = ('seat_class','is_reserved')
    search_fields = ('seat_number','flight__flight_number')

@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ('id','flight','seat','passenger_name','passenger_email','status','created_at')
    search_fields = ('passenger_name','passenger_email','flight__flight_number')
    list_filter = ('status','created_at')
    from django.contrib.auth.models import User


