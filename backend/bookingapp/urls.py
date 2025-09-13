from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import HotelViewSet, RoomViewSet, GuestViewSet, BookingViewSet, verify_booking_password, create_admin
from .search import search_hotels

router = DefaultRouter()
router.register(r'hotels', HotelViewSet)
router.register(r'rooms', RoomViewSet)
router.register(r'guests', GuestViewSet)
router.register(r'bookings', BookingViewSet)

urlpatterns = [
    path('auth/verify/', verify_booking_password, name='verify-booking-password'),
    path('create-admin/', create_admin, name='create-admin'),
    path('hotels/search/', search_hotels, name='hotel-search'),
    path('', include(router.urls)),
]
