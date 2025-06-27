from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import Hotel, Room, Guest, Booking

admin.site.register(Hotel)
admin.site.register(Room)
admin.site.register(Guest)
admin.site.register(Booking)
