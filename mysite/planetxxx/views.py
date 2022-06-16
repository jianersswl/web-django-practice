from django.shortcuts import render
from django.http import HttpResponse


def index(request):
    return HttpResponse("Hello, world. You're at the Planet XXX.")

def display(request):
    return render(request, "planetxxx/index.html")