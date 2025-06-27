from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse

def home_view(request):
    return JsonResponse({"message": "Welcome to Hotel Booking API!"})

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', home_view),  # root message
    path('api/', include('bookingapp.urls')),  # mount all API routes under /api/
]
