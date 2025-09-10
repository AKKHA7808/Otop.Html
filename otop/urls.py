from django.contrib import admin
from django.urls import path
from otop_search_thailand import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('otop/', views.otop_table, name='otop_table'),
    path('', views.otop_table, name='home'),
]
