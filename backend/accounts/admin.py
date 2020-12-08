from django.contrib import admin
from .models import CustomUser
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin


class UserAdmin(BaseUserAdmin):
    ordering = ['id']
    list_display = ('user_id', 'first_name', 'last_name', 'is_staff', 'is_teacher',
                    'is_active',)
    list_filter = ('user_id', 'first_name', 'last_name', 'is_staff', 'is_teacher',
                   'is_active',)
    fieldsets = (
        (None, {'fields': ('first_name', 'last_name', 'password')}),
        ('Permissions', {'fields': ('is_teacher',
                                    'is_staff',
                                    'is_active')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('first_name', 'last_name', 'password1', 'password2', 'is_staff', 'is_active')}
         ),
    )
    search_fields = ('user_id', 'first_name', 'last_name',)
    ordering = ('user_id','first_name', 'last_name',)


admin.site.register(CustomUser, UserAdmin)
