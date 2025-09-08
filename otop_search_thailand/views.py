from django.shortcuts import render
import json
import os

def otop_table(request):
	json_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'otop.json')
	with open(json_path, encoding='utf-8') as f:
		data = json.load(f)
	otop_list = data.get('Sheet1', [])
	return render(request, 'otop_search_thailand/otop_table.html', {'otop_list': otop_list})

# Create your views here.
