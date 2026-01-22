# flight_booking/admin_views.py
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import user_passes_test
from django.db.models import Sum, Count
from django.contrib import messages
from django.utils import timezone


from .models import Flight, Booking, Airport, Airline, Seat
from .forms import FlightForm, BookingForm, AirportForm, AirlineForm, SeatForm

# Security: Only allow superusers
def is_superuser(user):
    return user.is_superuser


@user_passes_test(is_superuser)
def admin_dashboard_home(request):
    total_bookings = Booking.objects.filter(status='confirmed').count()
    total_revenue = Booking.objects.filter(status='confirmed').aggregate(Sum('flight__price'))['flight__price__sum'] or 0
    upcoming_flights = Flight.objects.filter(departure__gte=timezone.now()).count()
    recent_bookings = Booking.objects.select_related('user', 'flight').order_by('-created_at')[:5]
    
    context = {
        'total_bookings': total_bookings,
        'total_revenue': total_revenue,
        'upcoming_flights': upcoming_flights,
        'recent_bookings': recent_bookings,
    }
    return render(request, 'admin_dashboard/dashboard.html', context)


# --- FLIGHT MANAGEMENT ---

@user_passes_test(is_superuser)
def flight_list(request):
    flights = Flight.objects.select_related('airline', 'origin', 'destination').all().order_by('-departure')
    return render(request, 'admin_dashboard/flights.html', {'flights': flights})

@user_passes_test(is_superuser)
def flight_create(request):
    if request.method == 'POST':
        form = FlightForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, "Flight created successfully!")
            return redirect('admin_flight_list')
    else:
        form = FlightForm()
    return render(request, 'admin_dashboard/flight_form.html', {'form': form, 'title': 'Add Flight'})

@user_passes_test(is_superuser)
def flight_edit(request, pk):
    flight = get_object_or_404(Flight, pk=pk)
    if request.method == 'POST':
        form = FlightForm(request.POST, instance=flight)
        if form.is_valid():
            form.save()
            messages.success(request, "Flight updated!")
            return redirect('admin_flight_list')
    else:
        form = FlightForm(instance=flight)
    return render(request, 'admin_dashboard/flight_form.html', {'form': form, 'title': 'Edit Flight'})

@user_passes_test(is_superuser)
def flight_delete(request, pk):
    flight = get_object_or_404(Flight, pk=pk)
    if request.method == 'POST':
        flight.delete()
        messages.warning(request, "Flight deleted!")
        return redirect('admin_flight_list')
    return render(request, 'admin_dashboard/flight_confirm_delete.html', {'flight': flight})

# --- BOOKING MANAGEMENT ---

@user_passes_test(is_superuser)
def booking_list(request):
    bookings = Booking.objects.select_related('user', 'flight', 'seat').all().order_by('-created_at')
    return render(request, 'admin_dashboard/bookings.html', {'bookings': bookings})

@user_passes_test(is_superuser)
def booking_confirm(request, pk):
    booking = get_object_or_404(Booking, pk=pk)
    booking.status = 'confirmed'
    booking.save()
    messages.success(request, f"Booking #{pk} confirmed!")
    return redirect('admin_booking_list')

#airport ke liye
# List Airports
@user_passes_test(is_superuser)
def airport_list(request):
    airports = Airport.objects.all().order_by('code')
    return render(request, 'admin_dashboard/airports.html', {'airports': airports})

# Add Airport
@user_passes_test(is_superuser)
def airport_create(request):
    if request.method == 'POST':
        form = AirportForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, "Airport added successfully!")
            return redirect('admin_airport_list')
    else:
        form = AirportForm()
    return render(request, 'admin_dashboard/airport_form.html', {'form': form, 'title': 'Add Airport'})

# Edit Airport
@user_passes_test(is_superuser)
def airport_edit(request, pk):
    airport = get_object_or_404(Airport, pk=pk)
    if request.method == 'POST':
        form = AirportForm(request.POST, instance=airport)
        if form.is_valid():
            form.save()
            messages.success(request, "Airport updated successfully!")
            return redirect('admin_airport_list')
    else:
        form = AirportForm(instance=airport)
    return render(request, 'admin_dashboard/airport_form.html', {'form': form, 'title': 'Edit Airport'})

# Delete Airport
@user_passes_test(is_superuser)
def airport_delete(request, pk):
    airport = get_object_or_404(Airport, pk=pk)
    if request.method == 'POST':
        airport.delete()
        messages.warning(request, "Airport deleted!")
        return redirect('admin_airport_list')
    return render(request, 'admin_dashboard/airport_confirm_delete.html', {'airport': airport})
# airlien wala
# List Airlines
@user_passes_test(is_superuser)
def airline_list(request):
    airlines = Airline.objects.all().order_by('code')
    return render(request, 'admin_dashboard/airlines.html', {'airlines': airlines})

# Add Airline
@user_passes_test(is_superuser)
def airline_create(request):
    if request.method == 'POST':
        form = AirlineForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, "Airline added successfully!")
            return redirect('admin_airline_list')
    else:
        form = AirlineForm()
    return render(request, 'admin_dashboard/airline_form.html', {'form': form, 'title': 'Add Airline'})

# Edit Airline
@user_passes_test(is_superuser)
def airline_edit(request, pk):
    airline = get_object_or_404(Airline, pk=pk)
    if request.method == 'POST':
        form = AirlineForm(request.POST, instance=airline)
        if form.is_valid():
            form.save()
            messages.success(request, "Airline updated successfully!")
            return redirect('admin_airline_list')
    else:
        form = AirlineForm(instance=airline)
    return render(request, 'admin_dashboard/airline_form.html', {'form': form, 'title': 'Edit Airline'})

# Delete Airline
@user_passes_test(is_superuser)
def airline_delete(request, pk):
    airline = get_object_or_404(Airline, pk=pk)
    if request.method == 'POST':
        airline.delete()
        messages.warning(request, "Airline deleted!")
        return redirect('admin_airline_list')
    return render(request, 'admin_dashboard/airline_confirm_delete.html', {'airline': airline})
#seat wala
# List Seats
@user_passes_test(is_superuser)
def seat_list(request):
    seats = Seat.objects.select_related('flight').all().order_by('flight__departure', 'seat_number')
    return render(request, 'admin_dashboard/seats.html', {'seats': seats})

# Add Seat
@user_passes_test(is_superuser)
def seat_create(request):
    if request.method == 'POST':
        form = SeatForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, "Seat added successfully!")
            return redirect('admin_seat_list')
    else:
        form = SeatForm()
    return render(request, 'admin_dashboard/seat_form.html', {'form': form, 'title': 'Add Seat'})

# Edit Seat
@user_passes_test(is_superuser)
def seat_edit(request, pk):
    seat = get_object_or_404(Seat, pk=pk)
    if request.method == 'POST':
        form = SeatForm(request.POST, instance=seat)
        if form.is_valid():
            form.save()
            messages.success(request, "Seat updated successfully!")
            return redirect('admin_seat_list')
    else:
        form = SeatForm(instance=seat)
    return render(request, 'admin_dashboard/seat_form.html', {'form': form, 'title': 'Edit Seat'})

# Delete Seat
@user_passes_test(is_superuser)
def seat_delete(request, pk):
    seat = get_object_or_404(Seat, pk=pk)
    if request.method == 'POST':
        seat.delete()
        messages.warning(request, "Seat deleted!")
        return redirect('admin_seat_list')
    return render(request, 'admin_dashboard/seat_confirm_delete.html', {'seat': seat})
