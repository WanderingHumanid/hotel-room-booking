from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import status


# Create your views here.
from rest_framework import viewsets
from .models import Hotel, Room, Guest, Booking
from .serializers import HotelSerializer, RoomSerializer, GuestSerializer, BookingSerializer

class HotelViewSet(viewsets.ModelViewSet):
    queryset = Hotel.objects.all()
    serializer_class = HotelSerializer

class RoomViewSet(viewsets.ModelViewSet):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer

class GuestViewSet(viewsets.ModelViewSet):
    queryset = Guest.objects.all()
    serializer_class = GuestSerializer

class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer

    def create(self, request, *args, **kwargs):
        room_id = request.data.get('room_id')
        check_in = request.data.get('check_in')
        check_out = request.data.get('check_out')

        # Check for overlapping confirmed bookings
        conflicts = Booking.objects.filter(
            room_id=room_id,
            status='confirmed',
            check_in__lt=check_out,
            check_out__gt=check_in
        )

        if conflicts.exists():
            return Response(
                {'error': 'Room is already booked for those dates.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # No conflict — proceed with normal creation
        return super().create(request, *args, **kwargs)