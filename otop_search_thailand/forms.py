from django import forms

class ProductCSVUploadForm(forms.Form):
    csv_file = forms.FileField(label="CSV สินค้า", help_text="ไฟล์ .csv (ชื่อสินค้า, จังหวัด, หมวดหมู่, เรตติ้ง)")
