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

    def get_queryset(self):
        queryset = Room.objects.all()
        hotel_id = self.request.query_params.get('hotel')
        if hotel_id:
            queryset = queryset.filter(hotel_id=hotel_id)
        return queryset

class GuestViewSet(viewsets.ModelViewSet):
    queryset = Guest.objects.all()
    serializer_class = GuestSerializer

class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer

    def get_queryset(self):
        queryset = Booking.objects.all()
        # User lookup by phone or first+last name
        phone = self.request.query_params.get('phone')
        first_name = self.request.query_params.get('first_name')
        last_name = self.request.query_params.get('last_name')
        if phone:
            queryset = queryset.filter(guest__phone=phone)
        elif first_name and last_name:
            queryset = queryset.filter(guest__first_name__iexact=first_name, guest__last_name__iexact=last_name)
        return queryset

    def create(self, request, *args, **kwargs):
        print('BOOKING POST DATA:', request.data)  # Debug log
        room_id = request.data.get('room_id')
        check_in = request.data.get('check_in')
        check_out = request.data.get('check_out')

        # Check for missing fields
        missing = []
        for field in ['guest_id', 'room_id', 'check_in', 'check_out', 'status']:
            if not request.data.get(field):
                missing.append(field)
        if missing:
            return Response({'error': f'Missing fields: {", ".join(missing)}'}, status=status.HTTP_400_BAD_REQUEST)

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