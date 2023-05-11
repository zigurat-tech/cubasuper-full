from django.db import models


# Create your models here.
class EmailConfig(models.Model):
    email_host = models.CharField('Host del correo', max_length=255,
                                  help_text='Ejemplo: 123.6.56.189, mail.cubasuper.com')
    email_host_user = models.CharField('Correo ', max_length=255, help_text='Ejemplo: no-reply@cubasuper.com')
    email_host_pass = models.CharField('Contraseña ', max_length=255, null=True, blank=True)
    email_host_port = models.PositiveSmallIntegerField('Puerto')
    email_use_tsl = models.BooleanField('TSL', default=False)
    email_use_ssl = models.BooleanField('SSL', default=True)
    email_timeout = models.PositiveSmallIntegerField('Tiempo de espera', default=5)

    def __str__(self):
        return self.email_host_user
    class Meta:
        verbose_name = 'Configuración de correo'
        verbose_name_plural = 'Configuración de correo'
