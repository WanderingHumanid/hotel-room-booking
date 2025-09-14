# Generated manually to remove image fields

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('bookingapp', '0003_booking_guest_count_booking_total_price_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='hotel',
            name='image',
        ),
        migrations.RemoveField(
            model_name='room',
            name='image',
        ),
    ]