from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import User
from django.utils.translation import gettext_lazy as _
from import_export.admin import ImportExportModelAdmin
from import_export import resources

from main.models import EmailConfig
from org.models import Slide, Category, Subcategory, Definition, ProductGallery, Product, AsociationProductGroup, \
    ProductGroupGallery, ProductGroup, Batch, Component, Order, Contact, About, Termino


class ComponentInLine(admin.StackedInline):
    model = Component
    extra = 0


class SlideAdmin(admin.ModelAdmin):
    list_display = ('thumbnail', 'name', 'position', 'visible')
    list_display_links = ('thumbnail', 'name', 'position', 'visible')
    list_per_page = 10
    fieldsets = (
        ('Información básica', {
            'fields': ('name', 'visible', 'position')
        }),
        ('Multimedia', {
            'fields': (('image', 'thumbnail'),)
        }),
    )
    readonly_fields = ['thumbnail', ]
    actions = ['Poner_visible', 'Quitar_visible']

    def Poner_visible(self, request, queryset):
        for p in queryset:
            p.visible = True
            p.save()

    def Quitar_visible(self, request, queryset):
        for p in queryset:
            p.visible = False
            p.save()


class CategoryAdmin(admin.ModelAdmin):
    list_display = ('thumbnail', 'id', 'name', 'promoted')
    list_display_links = ('thumbnail', 'id', 'name', 'promoted')
    fieldsets = (
        ('Información básica', {
            'fields': ('uuid', ('name', 'name_trans'), 'promoted')
        }),
        ('Multimedia', {
            'fields': (('image', 'thumbnail'),)
        }),
    )
    readonly_fields = ['thumbnail', ]


class SubcategoryAdmin(admin.ModelAdmin):
    list_display = ('category', 'id', 'name')
    list_display_links = ('category', 'id', 'name')
    fieldsets = (
        ('Información básica', {
            'fields': ('category', 'uuid', ('name', 'name_trans'))
        }),
    )


class DefinitionAdmin(admin.ModelAdmin):
    list_display = ('id', 'subcategory', 'name')
    list_display_links = ('id', 'subcategory', 'name')
    fieldsets = (
        ('Información básica', {
            'fields': ('subcategory', 'uuid', ('name', 'name_trans'))
        }),
    )


class ProductGalleryInLine(admin.TabularInline):
    model = ProductGallery
    extra = 0
    fieldsets = (
        ('', {
            'fields': ('image', 'thumbnail')
        }),
    )
    readonly_fields = ['thumbnail']


class ProductAdmin(admin.ModelAdmin, ):
    massadmin_exclude = ['image', 'name', 'name_trans', 'description', 'description_trans', 'sales',
                         'sku']
    list_display = (
        'thumbnail', 'sku', 'id', 'name', 'stock', 'price', 'sales', 'unit_of_measurement', 'definition',
        'is_recommended', 'visible')
    list_display_links = (
        'thumbnail', 'sku', 'name', 'stock', 'price', 'sales', 'unit_of_measurement', 'definition')
    list_filter = ('definition', 'unit_of_measurement', 'visible')
    search_fields = ['name', 'name_trans', 'description', 'description_trans', 'sku']
    fieldsets = (
        ('Nombre y Precio', {
            'fields': (('sku', 'price'), ('name', 'name_trans'))
        }),
        ('Multimedia', {
            'fields': (('image', 'thumbnail'),)}),
        ('Organización', {
            'fields': ('brand', 'definition', 'batch')
        }),
        ('Info', {
            'fields': (('description', 'description_trans'), ('unit_of_measurement', 'unit_of_measurement_trans'))
        }),
        ('Gestión de almacén', {
            'fields': ('stock', 'visible', 'is_recommended')
        }),
    )
    change_list_template = 'admin/product_change_list.html'
    inlines = [ProductGalleryInLine, ]
    readonly_fields = ['thumbnail', ]
    actions = ['Poner_visible', 'Quitar_visible', 'Recomendar', 'No_recomendar']

    def Poner_visible(self, request, queryset):
        for p in queryset:
            p.visible = True
            p.save()

    def Quitar_visible(self, request, queryset):
        for p in queryset:
            p.visible = False
            p.save()

    def Recomendar(self, request, queryset):
        for p in queryset:
            p.is_recommended = True
            p.save()

    def No_recomendar(self, request, queryset):
        for p in queryset:
            p.is_recommended = False
            p.save()

    # def has_import_permission(self, request):


class AsociacionInline(admin.StackedInline):
    model = AsociationProductGroup
    extra = 0
    fk_name = 'group'
    min_num = 1


class ProductGroupGalleryInLine(admin.TabularInline):
    model = ProductGroupGallery
    extra = 0
    fieldsets = (
        ('', {
            'fields': ('image', 'thumbnail')
        }),
    )
    readonly_fields = ['thumbnail']


class ProductGroupAdmin(admin.ModelAdmin):
    massadmin_exclude = ['image', 'name', 'name_trans', 'description', 'description_trans', 'sales',
                         'sku']
    list_display = (
        'thumbnail', 'sku', 'name', 'stock', 'price', 'sales', 'unit_of_measurement', 'definition', 'is_recommended',
        'visible')
    list_display_links = (
        'thumbnail', 'sku', 'name', 'stock', 'price', 'sales', 'unit_of_measurement', 'definition')
    list_filter = ('definition', 'unit_of_measurement', 'visible')
    search_fields = ['name', 'name_trans', 'description', 'description_trans', 'sku']
    fieldsets = (
        ('Nombre y Precio', {
            'fields': (('sku', 'price'), ('name', 'name_trans'))
        }),
        ('Multimedia', {
            'fields': (('image', 'thumbnail'),)}),
        ('Organización', {
            'fields': ('brand', 'definition', 'batch')
        }),
        ('Info', {
            'fields': (('description', 'description_trans'), ('unit_of_measurement', 'unit_of_measurement_trans'))
        }),
        ('Gestión de almacén', {
            'fields': ('stock', 'visible', 'is_recommended')
        }),
    )
    inlines = [ProductGroupGalleryInLine, AsociacionInline]
    readonly_fields = ['thumbnail', 'stock']
    actions = ['Poner_visible', 'Quitar_visible', 'Recomendar', 'No_recomendar']

    def Poner_visible(self, request, queryset):
        for p in queryset:
            p.visible = True
            p.save()

    def Quitar_visible(self, request, queryset):
        for p in queryset:
            p.visible = False
            p.save()

    def Recomendar(self, request, queryset):
        for p in queryset:
            p.is_recommended = True
            p.save()

    def No_recomendar(self, request, queryset):
        for p in queryset:
            p.is_recommended = False
            p.save()


class OrderAdmin(admin.ModelAdmin):
    list_display = (
        'uuid', 'date_of_creation', 'status', 'total', 'user')
    list_display_links = (
        'uuid', 'date_of_creation', 'status', 'total', 'user')
    list_filter = ('date_of_creation',)
    search_fields = ['uuid', ]
    fieldsets = (
        ('General', {
            'fields': (('uuid', 'user'), ('date_of_creation', 'status'), 'total')
        }),
    )
    inlines = [ComponentInLine, ]


class ContactAdmin(admin.ModelAdmin):
    list_display = ('get_full_name', 'email', 'phone_number',)
    list_display_links = ('get_full_name',)
    search_fields = ('name', 'last_name', 'email', 'phone_number')


class AboutAdmin(admin.ModelAdmin):
    list_display = ('info', 'info_trans')


class TerminoAdmin(admin.ModelAdmin):
    list_display = ('info', 'info_trans')


class MyUserAdmin(UserAdmin):
    model = User
    list_display = ('username', 'email', 'first_name', 'is_active', 'is_staff', 'is_superuser')
    list_filter = ('is_active',)
    fieldsets = (
        (None, {"fields": ("username", "password")}),
        (_("Personal info"), {"fields": ("first_name", "last_name", "email")}),
        (
            _("Permissions"),
            {
                "fields": (
                    "is_superuser",
                ),
            },
        ),
    )
    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": ("username", "password1", "password2",),
            },
        ),
    )
    actions = ['Desactivar_usuarios', 'Activar_usuarios', 'Activar_staff', 'Desactivar_staff']

    def Desactivar_usuarios(self, request, queryset):
        qs = queryset
        for user in qs:
            user.is_active = False
            user.save()

    def Activar_usuarios(self, request, queryset):
        qs = queryset
        if EmailConfig.objects.exists():
            import smtplib
            from email.message import EmailMessage
            cfg: EmailConfig = EmailConfig.objects.first()
            email_subject = "Activación de cuenta de CubaSuper"
            sender_email_address = cfg.email_host_user
            email_smtp = cfg.email_host
            email_password = cfg.email_host_pass
            email_port = cfg.email_host_port
            try:
                for user in qs:
                    receiver_email_address = user.email
                    message = EmailMessage()
                    message['Subject'] = email_subject
                    message['From'] = sender_email_address
                    message['To'] = receiver_email_address
                    message.set_content(
                        "Su cuenta ha sido activada satisfactoriamente, ahora puede comprar en nuestra tienda.")
                    server = smtplib.SMTP(email_smtp, email_port)
                    server.ehlo()
                    server.send_message(message)
                    server.quit()
                    user.is_active = True
                    user.save()
            except Exception as e:
                print(str(e))

    def Activar_staff(self, request, queryset):
        qs = queryset
        for user in qs:
            user.is_staff = True
            user.save()

    def Desactivar_staff(self, request, queryset):
        qs = queryset
        for user in qs:
            user.is_staff = False
            user.save()


class BatchAdmin(admin.ModelAdmin):
    list_display = ('id', 'uuid')


admin.site.register(Slide, SlideAdmin)
admin.site.register(Batch, BatchAdmin)
admin.site.register(Category, CategoryAdmin)
admin.site.register(Subcategory, SubcategoryAdmin)
admin.site.register(Definition, DefinitionAdmin)
admin.site.register(Product, ProductAdmin)
admin.site.register(Order, OrderAdmin)
admin.site.register(ProductGroup, ProductGroupAdmin)
admin.site.register(Contact, ContactAdmin)
admin.site.register(About, AboutAdmin)
admin.site.register(Termino, AboutAdmin)
admin.site.unregister(User)
admin.site.register(User, MyUserAdmin)
