from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Hotel, Room, Booking
from .serializers import HotelSerializer
from django.db.models import Q
from datetime import datetime

@api_view(['GET'])
def search_hotels(request):
    location = request.GET.get('location', '')
    hotel_name = request.GET.get('name', '')
    check_in = request.GET.get('check_in')
    check_out = request.GET.get('check_out')

    # Start with all hotels
    hotels = Hotel.objects.all()
    
    # Apply search filters
    if location:
        hotels = hotels.filter(address__icontains=location)
    
    if hotel_name:
        hotels = hotels.filter(name__icontains=hotel_name)
    
    # If both location and name are provided, search in both fields
    if location and hotel_name:
        hotels = Hotel.objects.filter(
            Q(name__icontains=hotel_name) | Q(address__icontains=location) |
            Q(name__icontains=location) | Q(address__icontains=hotel_name)
        )

    # If dates are provided, filter hotels with at least one available room in that range
    if check_in and check_out:
        try:
            check_in_date = datetime.strptime(check_in, '%Y-%m-%d').date()
            check_out_date = datetime.strptime(check_out, '%Y-%m-%d').date()
        except ValueError:
            return Response({'error': 'Invalid date format.'}, status=400)

        available_hotel_ids = set()
        for hotel in hotels:
            rooms = Room.objects.filter(hotel=hotel)
            for room in rooms:
                # Check for overlapping bookings
                conflicts = Booking.objects.filter(
                    room=room,
                    status='confirmed',
                    check_in__lt=check_out_date,
                    check_out__gt=check_in_date
                )
                if not conflicts.exists():
                    available_hotel_ids.add(hotel.id)
                    break  # At least one room available in this hotel
        hotels = hotels.filter(id__in=available_hotel_ids)

    serializer = HotelSerializer(hotels, many=True, context={'request': request})
    return Response(serializer.data)
