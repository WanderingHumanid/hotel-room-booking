from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view
from django.contrib.auth.models import User
from django.http import JsonResponse
import os


# Create your views here.
from rest_framework import viewsets
from .models import Hotel, Room, Guest, Booking
from .serializers import HotelSerializer, RoomSerializer, GuestSerializer, BookingSerializer

@api_view(['GET', 'POST'])
def create_admin(request):
    """Create admin user for demo purposes"""
    username = 'admin'
    email = 'admin@demo.com'
    password = 'admin123'
    
    if User.objects.filter(username=username).exists():
        return JsonResponse({'message': f'Admin user already exists! Username: {username}, Password: {password}'})
    
    User.objects.create_superuser(username=username, email=email, password=password)
    return JsonResponse({'message': f'Admin user created successfully! Username: {username}, Password: {password}'})

class HotelViewSet(viewsets.ModelViewSet):
    queryset = Hotel.objects.all()
    serializer_class = HotelSerializer
    
    def get_queryset(self):
        queryset = Hotel.objects.all()
        name = self.request.query_params.get('name')
        location = self.request.query_params.get('location')
        
        if name:
            queryset = queryset.filter(name__icontains=name)
        if location:
            queryset = queryset.filter(address__icontains=location)
            
        return queryset

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
        email = self.request.query_params.get('email')
        
        if phone:
            queryset = queryset.filter(guest__phone=phone)
        elif email:
            queryset = queryset.filter(guest__email=email)
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

@api_view(['POST'])
def verify_booking_password(request):
    """Verify password before showing bookings"""
    email = request.data.get('email')
    phone = request.data.get('phone')
    password = request.data.get('password')
    
    if not password:
        return Response({'error': 'Password is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    guest = None
    if email:
        try:
            guest = Guest.objects.get(email=email)
        except Guest.DoesNotExist:
            return Response({'error': 'No user found with this email'}, status=status.HTTP_404_NOT_FOUND)
    elif phone:
        try:
            guest = Guest.objects.get(phone=phone)
        except Guest.DoesNotExist:
            return Response({'error': 'No user found with this phone number'}, status=status.HTTP_404_NOT_FOUND)
    else:
        return Response({'error': 'Email or phone is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    if not guest.check_password(password):
        return Response({'error': 'Invalid password'}, status=status.HTTP_401_UNAUTHORIZED)
    
    # Return guest info and their bookings
    bookings = Booking.objects.filter(guest=guest)
    booking_serializer = BookingSerializer(bookings, many=True)
    
    return Response({
        'guest': GuestSerializer(guest).data,
        'bookings': booking_serializer.data
    }, status=status.HTTP_200_OK)