from django.db import models
from users.models import UserProfile
from django.core.validators import MaxValueValidator
from django.utils.translation import gettext_lazy as _

NUM_ROWS = 30
NUM_COLS = 32

# Model for schematics
class Schematic(models.Model):
    # Points to the owner of schematic - if user deleted schematic will be deleted too
    owner = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='schematics')
    name = models.CharField(max_length=100)
    # Currently set max in/out ports to 6
    number_of_input_ports = models.PositiveIntegerField(default=0, validators=[MaxValueValidator(6)])
    number_of_output_ports = models.PositiveIntegerField(default=0, validators=[MaxValueValidator(6)])

    def __str__(self) -> str:
        return f'Schematic'
    
    class Meta:
        verbose_name = 'Schematic'
        verbose_name_plural = 'Schematics'


# Output LUT for schematic
class OutputLUT(models.Model):
    # schematic LUT is for
    schematic = models.ForeignKey(Schematic, on_delete=models.CASCADE, related_name="output_LUT")
    # In the case of more than one output for a schematic we need to have an ID
    output_id = models.PositiveIntegerField(default=0)
    # Use json for mappings (hopefully not too big or else need to cache with Redis or other fast database)
    lut = models.JSONField(help_text='Mapping of input to schematic to outputs')

    def __str__(self) -> str:
        return f"{self.schematic.name} output {self.output_id} LUT"
    
    class Meta:
        verbose_name = "LUT"
        verbose_name_plural = "LUTs"


# Stores information about circuit elements used in a schematic
class CircuitElement(models.Model):
    # schematic gate is a part of
    schematic = models.ForeignKey(Schematic, on_delete=models.CASCADE)
    # Each element has unique ID local to schematic it is a part of
    element_id = models.IntegerField(default=-1)

    # position of gate relative to top corner
    row = models.PositiveSmallIntegerField()
    col = models.PositiveSmallIntegerField()

    # inputs to element
    number_of_input_ports = models.PositiveIntegerField()
    # Stores the elements whose output is connected to this element
    # To get the gate the output is connected to use the related name field
    # If the output is blank/null or input is blank/null it means it is disconnected
    input_connections = models.ManyToManyField("self", 
                                               symmetrical=False, 
                                               blank=True, 
                                               related_name='output_connections'
    )

    # Outputs
    number_of_output_ports = models.PositiveIntegerField()

    # Does not account of width and height of gate just top left position
    def check_valid_pos(self) -> bool:
        return (self.row <= NUM_ROWS) and (self.col <= NUM_COLS)
    
    def get_num_inputs(self) -> int:
        return self.input_connections.all().count()

    def has_available_input(self) -> bool:
        return self.input_connections.all().count() < self.number_of_input_ports
    
    def get_num_unused_inputs(self) -> int:
        return self.number_of_input_ports - self.input_connections.all().count()

    def get_num_outputs(self) -> int:
        return self.output_connections.all().count()

    def has_output_connection(self) -> bool:
        return self.output_connections.all().count() > 0
    
    def get_num_unused_outputs(self) -> int:
        return self.number_of_output_ports - self.output_connections.all().count()

    def __str__(self) -> str:
        return f"{self.schematic.name} circuit element {self.element_id}"
    
    class Meta:
        verbose_name = "Circuit Element"
        verbose_name_plural = "Circuit Elements"


# model of input switches
class InputSwitch(models.Model):
    # associated circuit element
    circuit_element = models.OneToOneField(CircuitElement, on_delete=models.CASCADE)
    state = models.BooleanField(default=False)

    def __str__(self) -> str:
        return f"Switch {self.circuit_element.element_id} in {self.circuit_element.schematic.name}"
    
    class Meta:
        verbose_name = "Input Switch"
        verbose_name_plural = "Input Switches"


# model of LED output
class LED(models.Model):
    # Colours of LEDs - can add more later
    class LEDColour(models.TextChoices):
        RED = "R", _("RED")
        BLUE = "B", _("BLUE")
        GREEN = "G", _("GREEN")

    # associated circuit element
    circuit_element = models.OneToOneField(CircuitElement, on_delete=models.CASCADE)
    state = models.BooleanField(default=False)
    colour = models.CharField(max_length=1, choices=LEDColour)

    def __str__(self) -> str:
        return f"LED {self.circuit_element.element_id} in {self.circuit_element.schematic.name}"
    
    class Meta:
        verbose_name = "LED"
        verbose_name_plural = "LEDs"


# Model for logic gates (and, or, not, etc.)
class Gate(models.Model):
    # Type of gates -- can add more later
    class GateType(models.TextChoices):
        AND = "AND", _("AND_Gate")
        NOT = "NOT", _("NOT_Gate")
        OR = "OR", _("OR_Gate")

    # Gate type
    gate_type = models.CharField(max_length=3, choices=GateType)

    # Associated circuit element
    circuit_element = models.OneToOneField(CircuitElement, on_delete=models.CASCADE)

    def __str__(self) -> str:
        return f'Gate {self.circuit_element.element_id} in {self.circuit_element.schematic.name}'
    
    class Meta:
        verbose_name = "Gate"
        verbose_name_plural = "Gates"


# Model for modules (instances of schematics used in other schematics)
class Module(models.Model):
    # Associated circuit element 
    circuit_element = models.OneToOneField(CircuitElement, on_delete=models.CASCADE)
    # Schematic this is an instance of
    # NOTE currently set up so when original schematic deleted this is also deleted
    schematic = models.OneToOneField(Schematic, on_delete=models.CASCADE)

    def __str__(self) -> str:
        return f"Module {self.circuit_element.element_id} in {self.circuit_element.schematic.name}"
    
    class Meta:
        verbose_name = "Module"
        verbose_name_plural = "Modules"
