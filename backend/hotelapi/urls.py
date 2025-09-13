from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse
from django.conf import settings
from django.conf.urls.static import static

def home_view(request):
    return JsonResponse({"message": "Welcome to Hotel Booking API!"})

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', home_view),  # root message
    path('api/', include('bookingapp.urls')),  # mount all API routes under /api/
]

# Serve media files - needed for both development and production on Render
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
