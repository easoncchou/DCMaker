from django.db import models
from django.contrib.auth.models import User

# User profile wrapper for each user
class UserProfile(models.Model):
    # User object profile is associated with
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    # Can add whatever fields below we want for users
    

    def __str__(self):
        return f'{self.user.username}\'s Profile'
    
    class Meta:
        verbose_name = 'User Profile'
        verbose_name_plural = 'User Profiles'
