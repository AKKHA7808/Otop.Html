import csv
from django.core.management.base import BaseCommand
from otop_search_thailand.models import Province, Product
from django.utils.text import slugify

class Command(BaseCommand):
    help = "Seed 77 provinces and OTOP products from CSV"

    def handle(self, *args, **kwargs):
        with open('provinces.csv', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                name = row['name'].strip()
                Province.objects.get_or_create(
                    name=name,
                    defaults={'slug': slugify(name, allow_unicode=True)}
                )
        with open('products.csv', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                province = Province.objects.get(name=row['province'].strip())
                Product.objects.get_or_create(
                    name=row['name'].strip(),
                    province=province,
                    category=row['category'].strip(),
                    rating=float(row['rating'])
                )
        self.stdout.write(self.style.SUCCESS('Seeded provinces and products successfully!'))
