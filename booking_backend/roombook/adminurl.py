from django.urls import path
from django.shortcuts import redirect
from . import admin_views

urlpatterns = [
    # Redirect /admin-panel/ directly to dashboard
    path('', lambda request: redirect('admin_dashboard_home'), name='admin_panel_home'),

    # Dashboard
    path('admin-dashboard/', admin_views.admin_dashboard_home, name='admin_dashboard_home'),

    # Flights
    path('admin-dashboard/flights/', admin_views.flight_list, name='admin_flight_list'),
    path('admin-dashboard/flights/add/', admin_views.flight_create, name='admin_flight_add'),
    path('admin-dashboard/flights/<int:pk>/edit/', admin_views.flight_edit, name='admin_flight_edit'),
    path('admin-dashboard/flights/<int:pk>/delete/', admin_views.flight_delete, name='admin_flight_delete'),

    # Bookings
    path('admin-dashboard/bookings/', admin_views.booking_list, name='admin_booking_list'),
    path('admin-dashboard/bookings/<int:pk>/confirm/', admin_views.booking_confirm, name='admin_booking_confirm'),

    # Airports
    path('admin-dashboard/airports/', admin_views.airport_list, name='admin_airport_list'),
    path('admin-dashboard/airports/add/', admin_views.airport_create, name='admin_airport_add'),
    path('admin-dashboard/airports/<int:pk>/edit/', admin_views.airport_edit, name='admin_airport_edit'),
    path('admin-dashboard/airports/<int:pk>/delete/', admin_views.airport_delete, name='admin_airport_delete'),

    # Airlines
    path('admin-dashboard/airlines/', admin_views.airline_list, name='admin_airline_list'),
    path('admin-dashboard/airlines/add/', admin_views.airline_create, name='admin_airline_add'),
    path('admin-dashboard/airlines/<int:pk>/edit/', admin_views.airline_edit, name='admin_airline_edit'),
    path('admin-dashboard/airlines/<int:pk>/delete/', admin_views.airline_delete, name='admin_airline_delete'),

    # Seats
    path('admin-dashboard/seats/', admin_views.seat_list, name='admin_seat_list'),
    path('admin-dashboard/seats/add/', admin_views.seat_create, name='admin_seat_add'),
    path('admin-dashboard/seats/<int:pk>/edit/', admin_views.seat_edit, name='admin_seat_edit'),
    path('admin-dashboard/seats/<int:pk>/delete/', admin_views.seat_delete, name='admin_seat_delete'),
]
