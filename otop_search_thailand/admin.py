from django.contrib import admin
from .models import Province, Product

@admin.register(Province)
class ProvinceAdmin(admin.ModelAdmin):
	list_display = ("name", "slug")
	search_fields = ("name",)
	prepopulated_fields = {"slug": ("name",)}

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
	list_display = ("name", "province", "category", "rating")
	list_filter = ("province", "category")
	search_fields = ("name", "category")
