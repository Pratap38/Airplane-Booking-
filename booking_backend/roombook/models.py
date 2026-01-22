from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class Airport(models.Model):
    code = models.CharField(max_length=5, unique=True)
    name = models.CharField(max_length=100)
    city = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.code} - {self.city}"


class Airline(models.Model):
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=5, unique=True)

    def __str__(self):
        return self.name


class Flight(models.Model):
    airline = models.ForeignKey(Airline, on_delete=models.CASCADE)
    flight_number = models.CharField(max_length=10)

    origin = models.ForeignKey(
        Airport, related_name='departures', on_delete=models.CASCADE
    )
    destination = models.ForeignKey(
        Airport, related_name='arrivals', on_delete=models.CASCADE
    )

    departure = models.DateTimeField()
    arrival = models.DateTimeField()

    duration = models.DurationField(null=True, blank=True)

    price = models.DecimalField(max_digits=8, decimal_places=2)
    available_seats = models.PositiveIntegerField(default=0)

    status = models.CharField(
        max_length=20,
        choices=[
            ('scheduled', 'Scheduled'),
            ('delayed', 'Delayed'),
            ('cancelled', 'Cancelled'),
        ],
        default='scheduled'
    )

    class Meta:
        unique_together = ('airline', 'flight_number', 'departure')

    def __str__(self):
        return f"{self.airline.code}{self.flight_number}"


class Seat(models.Model):
    flight = models.ForeignKey(
        Flight, related_name='seats', on_delete=models.CASCADE
    )
    seat_number = models.CharField(max_length=5)

    seat_class = models.CharField(
        max_length=20,
        choices=[
            ('economy', 'Economy'),
            ('business', 'Business'),
            ('first', 'First Class'),
        ],
        default='economy'
    )

    is_reserved = models.BooleanField(default=False)

    class Meta:
        unique_together = ('flight', 'seat_number')

    def __str__(self):
        return f"{self.flight} - Seat {self.seat_number}"


class Booking(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="bookings"
    )

    flight = models.ForeignKey(
        Flight, on_delete=models.CASCADE
    )

    seat = models.OneToOneField(
        Seat, on_delete=models.PROTECT
    )

    passenger_name = models.CharField(max_length=200)
    passenger_email = models.EmailField()

    status = models.CharField(
        max_length=20,
        choices=[
            ('pending', 'Pending'),
            ('confirmed', 'Confirmed'),
            ('cancelled', 'Cancelled'),
        ],
        default='pending'
    )

    created_at = models.DateTimeField(auto_now_add=True
    )

    def __str__(self):
        return f"Booking #{self.id} - {self.passenger_name}"
