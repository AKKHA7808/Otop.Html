def about(request):
    return render(request, 'otop_search_thailand/about.html')

import csv
from django.contrib.auth.decorators import login_required, user_passes_test
from django.shortcuts import render, get_object_or_404, redirect
from django.contrib import messages
from .forms import ProductCSVUploadForm
from .models import Product, Province
from django.db.models import Count

def staff_required(user):
    return user.is_staff
# Create your views here.

# --- CSV Upload for Staff ---
@login_required
@user_passes_test(staff_required)
def upload_products_csv(request):
    result = None
    if request.method == 'POST':
        form = ProductCSVUploadForm(request.POST, request.FILES)
        if form.is_valid():
            file = form.cleaned_data['csv_file']
            decoded = file.read().decode('utf-8').splitlines()
            reader = csv.reader(decoded)
            added, skipped = 0, 0
            for i, row in enumerate(reader):
                if i == 0 and any('ชื่อ' in col for col in row):  # skip header
                    continue
                try:
                    name, province_name, category, rating = row
                    province, _ = Province.objects.get_or_create(name=province_name)
                    obj, created = Product.objects.get_or_create(
                        name=name, province=province,
                        defaults={'category': category, 'rating': float(rating)}
                    )
                    if created:
                        added += 1
                    else:
                        skipped += 1
                except Exception:
                    skipped += 1
            result = {'added': added, 'skipped': skipped}
    else:
        form = ProductCSVUploadForm()
    return render(request, 'otop_search_thailand/upload_products_csv.html', {'form': form, 'result': result})

def products_list(request):
    products = Product.objects.select_related('province').order_by('name')
    provinces = Province.objects.order_by('name')
    categories = Product.objects.values_list('category', flat=True).distinct().order_by('category')
    return render(request, 'otop_search_thailand/products_list.html', {
        'products': products,
        'provinces': provinces,
        'categories': categories,
    })

def province_list(request):
    provinces = Province.objects.annotate(product_total=Count('products')).order_by('name')
    return render(request, 'otop_search_thailand/province_list.html', {'provinces': provinces})

def province_detail(request, slug):
    province = get_object_or_404(Province, slug=slug)
    products = Product.objects.filter(province=province).order_by('-rating', 'name')
    return render(request, 'otop_search_thailand/province_detail.html', {
        'province': province,
        'products': products,
    })

def otop_home(request):
    return render(request, 'otop_search_thailand/otop_home.html')

def province_list(request):
    provinces = Province.objects.annotate(product_total=Count('products')).order_by('name')
    return render(request, 'otop_search_thailand/province_list.html', {'provinces': provinces})

def province_detail(request, slug):
    province = Province.objects.get(slug=slug)
    products = Product.objects.filter(province=province)
    return render(request, 'otop_search_thailand/province_detail.html', {'province': province, 'products': products})

# Create your views here.
