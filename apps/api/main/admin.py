from django.contrib import admin

from main.models import EmailConfig


class EmailConfigAdmin(admin.ModelAdmin):
    list_display = (
        'email_host', 'email_host_user', 'email_host_pass', 'email_host_port', 'email_use_tsl', 'email_use_ssl',
        'email_timeout')

    def has_add_permission(self, request):
        return False if EmailConfig.objects.exists() else True


admin.site.register(EmailConfig, EmailConfigAdmin)
