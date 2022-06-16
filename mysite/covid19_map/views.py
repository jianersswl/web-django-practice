from django.shortcuts import render
from django.http import HttpResponse


def index(request):
    return HttpResponse("Hello, world. You're at the Covid-19 Map.")

def display(request):
    return render(request, "covid19_map/index.html")