from django.contrib import admin
from .models import Hotel, Room, Guest, Booking

@admin.register(Hotel)
class HotelAdmin(admin.ModelAdmin):
    list_display = ['name', 'address', 'available_rooms_count', 'get_image_info']
    exclude = ['image']  # Hide image field since we use static images
    
    def get_image_info(self, obj):
        return f"Uses static image: hotel-{obj.id}.jpg"
    get_image_info.short_description = "Image Info"
    
    def get_readonly_fields(self, request, obj=None):
        if obj:  # Editing existing hotel
            return ['get_image_info']
        return []

@admin.register(Room)  
class RoomAdmin(admin.ModelAdmin):
    list_display = ['hotel', 'room_number', 'room_type', 'price', 'is_available', 'get_image_info']
    list_filter = ['hotel', 'room_type', 'is_available']
    exclude = ['image']  # Hide image field since we use static images
    
    def get_image_info(self, obj):
        return f"Uses static image: room-{obj.id}.jpg"
    get_image_info.short_description = "Image Info"
    
    def get_readonly_fields(self, request, obj=None):
        if obj:  # Editing existing room
            return ['get_image_info']
        return []

@admin.register(Guest)
class GuestAdmin(admin.ModelAdmin):
    list_display = ['first_name', 'last_name', 'email', 'phone']
    exclude = ['password']  # Hide password field for security

@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ['guest', 'room', 'check_in', 'check_out', 'guest_count', 'total_price', 'status']
    list_filter = ['status', 'check_in', 'check_out']
