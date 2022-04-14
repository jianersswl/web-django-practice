import re
from django.shortcuts import render
from django.http import HttpResponse


def index(request):
    return HttpResponse("Hello, world. You're at the display index.")

def map(request):
    return render(request, "covid19_map/index.html")