from django.db import models
from django.contrib.auth.hashers import make_password, check_password

# Create your models here.
from django.db import models

class Hotel(models.Model):
    name = models.CharField(max_length=100)
    address = models.TextField()
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to='hotels/', blank=True, null=True)

    def __str__(self):
        return self.name

    @property
    def available_rooms_count(self):
        """Return count of available rooms in this hotel"""
        return self.room_set.filter(is_available=True).count()

    @property
    def lowest_price(self):
        """Return the lowest price among available rooms"""
        available_rooms = self.room_set.filter(is_available=True)
        if available_rooms.exists():
            return available_rooms.order_by('price').first().price
        return None


class Room(models.Model):
    hotel = models.ForeignKey(Hotel, on_delete=models.CASCADE)
    room_number = models.CharField(max_length=10)
    room_type = models.CharField(max_length=50)
    price = models.DecimalField(max_digits=8, decimal_places=2)
    is_available = models.BooleanField(default=True)
    image = models.ImageField(upload_to='rooms/', blank=True, null=True)

    def __str__(self):
        return f"{self.hotel.name} - Room {self.room_number}"


class Guest(models.Model):
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=15)
    password = models.CharField(max_length=128, default='defaultpassword')  # Store hashed password

    def set_password(self, raw_password):
        """Set password with proper hashing"""
        self.password = make_password(raw_password)

    def check_password(self, raw_password):
        """Check password against stored hash"""
        return check_password(raw_password, self.password)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"


class Booking(models.Model):
    guest = models.ForeignKey(Guest, on_delete=models.CASCADE)
    room = models.ForeignKey(Room, on_delete=models.CASCADE)
    check_in = models.DateField()
    check_out = models.DateField()
    guest_count = models.PositiveIntegerField(default=1)
    total_price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    status = models.CharField(max_length=20, choices=[
        ('confirmed', 'Confirmed'),
        ('cancelled', 'Cancelled'),
        ('checked_in', 'Checked In'),
        ('checked_out', 'Checked Out'),
    ], default='confirmed')

    def save(self, *args, **kwargs):
        # Calculate total price if not provided
        if self.total_price is None and self.room:
            # Calculate number of nights
            nights = (self.check_out - self.check_in).days
            self.total_price = self.room.price * nights * self.guest_count
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Booking: {self.guest} - {self.room}"
