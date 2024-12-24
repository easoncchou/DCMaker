from django.contrib import admin
from .models import (
    Schematic,
    OutputLUT,
    CircuitElement,
    Gate,
    Module
)

admin.site.register(Schematic)
admin.site.register(OutputLUT)
admin.site.register(CircuitElement)
admin.site.register(Gate)
admin.site.register(Module)
