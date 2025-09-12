from django.core.management.base import BaseCommand
from bookingapp.models import Hotel, Room, Guest, Booking

class Command(BaseCommand):
    help = 'Clear all data from the database'

    def handle(self, *args, **options):
        self.stdout.write('Clearing all data from the database...')
        
        # Delete in the correct order to respect foreign key constraints
        Booking.objects.all().delete()
        self.stdout.write('Deleted all bookings')
        
        Room.objects.all().delete()
        self.stdout.write('Deleted all rooms')
        
        Hotel.objects.all().delete()
        self.stdout.write('Deleted all hotels')
        
        Guest.objects.all().delete()
        self.stdout.write('Deleted all guests')
        
        self.stdout.write(
            self.style.SUCCESS('Successfully cleared all data from the database')
        )