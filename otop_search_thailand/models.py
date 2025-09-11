
from django.db import models
from django.utils.text import slugify

class Province(models.Model):
	name = models.CharField(max_length=100, unique=True)
	slug = models.SlugField(max_length=120, unique=True, blank=True)

	def save(self, *args, **kwargs):
		if not self.slug:
			# ใช้ allow_unicode=True เพื่อให้ slug รองรับภาษาไทย เช่น "เชียงใหม่" จะได้ slug เป็น "เชียงใหม่"
			self.slug = slugify(self.name, allow_unicode=True)
		super().save(*args, **kwargs)

	def __str__(self):
		return self.name

class Product(models.Model):
	name = models.CharField(max_length=255)
	province = models.ForeignKey(Province, on_delete=models.PROTECT, related_name="products")
	category = models.CharField(max_length=120)
	rating = models.DecimalField(max_digits=3, decimal_places=1, default=0)

	class Meta:
		indexes = [
			models.Index(fields=["province", "category"]),
			models.Index(fields=["name"]),
		]

	def __str__(self):
		return self.name
