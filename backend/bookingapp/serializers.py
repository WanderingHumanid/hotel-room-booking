from rest_framework import serializers
from .models import Hotel, Room, Guest, Booking

class HotelSerializer(serializers.ModelSerializer):
    available_rooms_count = serializers.ReadOnlyField()
    lowest_price = serializers.ReadOnlyField()
    image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Hotel
        fields = '__all__'
        
    def get_image_url(self, obj):
        # Return static image filename - frontend will handle the full path
        return f"hotel-{obj.id}.jpg"


class RoomSerializer(serializers.ModelSerializer):
    hotel = HotelSerializer(read_only=True)
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = Room
        fields = '__all__'
        
    def get_image_url(self, obj):
        # Return static image filename - frontend will handle the full path
        return f"room-{obj.id}.jpg"


class GuestSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    
    class Meta:
        model = Guest
        fields = ['id', 'first_name', 'last_name', 'email', 'phone', 'password']
        extra_kwargs = {
            'password': {'write_only': True}
        }
    
    def create(self, validated_data):
        password = validated_data.pop('password')
        guest = Guest(**validated_data)
        guest.set_password(password)
        guest.save()
        return guest


class BookingSerializer(serializers.ModelSerializer):
    guest = GuestSerializer(read_only=True)
    room = RoomSerializer(read_only=True)
    guest_id = serializers.PrimaryKeyRelatedField(
        queryset=Guest.objects.all(), source='guest', write_only=True
    )
    room_id = serializers.PrimaryKeyRelatedField(
        queryset=Room.objects.all(), source='room', write_only=True
    )

    class Meta:
        model = Booking
        fields = [
            'id', 'guest', 'guest_id', 'room', 'room_id',
            'check_in', 'check_out', 'guest_count', 'total_price', 'status'
        ]
