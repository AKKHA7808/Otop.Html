
from django.contrib import admin
from django.urls import path, re_path
from otop_search_thailand import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.products_list, name='products'),  # หน้าแรก
    path('provinces/', views.province_list, name='province_list'),
    re_path(r'^province/(?P<slug>[\w\u0E00-\u0E7F\-]+)/$', views.province_detail, name='province_detail'),
    path('home/', views.otop_home, name='home'),
    path('about/', views.about, name='about'),
    path('upload-csv/', views.upload_products_csv, name='upload_products_csv'),
]
