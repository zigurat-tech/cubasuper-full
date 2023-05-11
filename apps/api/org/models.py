from datetime import datetime, timedelta
from itertools import chain

import django
import uuid as uuid

from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, RegexValidator
from django.db import models
from django.forms import model_to_dict

# Create your models here.
from django.utils.safestring import mark_safe

from cubasuper.settings import STATIC_URL, MEDIA_URL
from cubasuper.utiles import traducir_por_defecto, getTimezone


class ProductsAndGroupsManager(models.Manager):

    def get_queryset(self):
        products = Product.objects.all()
        groups = ProductGroup.objects.all()
        return chain(products, groups)


class Slide(models.Model):
    name = models.CharField(max_length=255, verbose_name='Nombre', default='Nombre del slider')
    image = models.ImageField(upload_to='silderitems/', verbose_name='Imagen')
    visible = models.BooleanField(default=True)
    position = models.PositiveIntegerField('Posición', choices=(
        (1, 'Arriba'),
        (2, 'Medio'),
        (3, 'Abajo'),
    ))

    def __str__(self):
        return '{}'.format(self.name)

    def toJSON(self):
        item = model_to_dict(self)
        item['image'] = self.image.url
        # item['thumbnail'] = self.thumbnail()
        return item

    def thumbnail(self):
        return mark_safe('<img src="' + self.image.url + '" width="120">')

    def image_slide(self):
        return self.image.url

    thumbnail.short_description = 'Vista previa'
    thumbnail.allow_tags = True

    def save(self, *args, **kwargs):
        super(Slide, self).save(*args, **kwargs)

    class Meta:
        verbose_name = 'Slide'
        verbose_name_plural = 'Slides'
        ordering = ['position', ]


class Category(models.Model):
    uuid = models.UUIDField(default=uuid.uuid4)
    image = models.ImageField(upload_to='categories/', verbose_name='Imagen')
    promoted = models.BooleanField(verbose_name='Especial', default=False)
    name = models.CharField(max_length=255, verbose_name='Nombre')
    name_trans = models.CharField(max_length=255, verbose_name='Traducción del nombre',
                                  help_text='Dejar este campo vacío hará que el sistema proponga una traducción '
                                            'automática. La traducción automática puede ser modificada.',
                                  null=True, blank=True)

    def __str__(self):
        return '{}'.format(self.name)

    def thumbnail(self):
        return mark_safe('<img src="' + self.image.url + '" width="120">')

    def image_category(self):
        return self.image.url

    thumbnail.short_description = 'Vista previa'
    thumbnail.allow_tags = True

    def get_subcategories(self):
        subcategories = []
        for subcategory in self.subcategory_category.all():
            subcategories.append({'id': subcategory.pk, 'name': subcategory.name, 'name_trans': subcategory.name_trans,
                                  'definitions': subcategory.get_definitions()})
        return subcategories

    def save(self, *args, **kwargs):
        if not self.name_trans:
            self.name_trans = traducir_por_defecto(self.name, 'en')
        super(Category, self).save(*args, **kwargs)

    class Meta:
        verbose_name = 'Categoría'
        verbose_name_plural = 'Categorías'


class Subcategory(models.Model):
    uuid = models.UUIDField(default=uuid.uuid4)
    category = models.ForeignKey('org.Category', on_delete=models.CASCADE, related_name='subcategory_category')
    name = models.CharField(max_length=255, verbose_name='Nombre')
    name_trans = models.CharField(max_length=255, verbose_name='Traducción del nombre',
                                  help_text='Dejar este campo vacío hará que el sistema proponga una traducción '
                                            'automática. La traducción automática puede ser modificada.',
                                  null=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.name_trans:
            self.name_trans = traducir_por_defecto(self.name, 'en')
        super(Subcategory, self).save(*args, **kwargs)

    def get_definitions(self):
        definitions = []
        for definition in self.definition_subcategory.all():
            definitions.append({'id': definition.pk, 'name': definition.name, 'name_trans': definition.name_trans})
        return definitions

    def __str__(self):
        return '{}'.format(self.name)

    class Meta:
        verbose_name = 'Subcategoría'
        verbose_name_plural = 'Subcategorías'


class Batch(models.Model):
    uuid = models.CharField(max_length=500, verbose_name='No. Serie')

    def __str__(self):
        return '{}'.format(self.uuid)

    class Meta:
        verbose_name = 'Lote'
        verbose_name_plural = 'Lotes'


class Definition(models.Model):
    uuid = models.UUIDField(default=uuid.uuid4)
    subcategory = models.ForeignKey('org.Subcategory', on_delete=models.CASCADE, related_name='definition_subcategory')
    name = models.CharField(max_length=255, verbose_name='Nombre')
    name_trans = models.CharField(max_length=255, verbose_name='Traducción del nombre',
                                  help_text='Dejar este campo vacío hará que el sistema proponga una traducción '
                                            'automática. La traducción automática puede ser modificada.',
                                  null=True, blank=True)

    def __str__(self):
        return '{}'.format(self.name)

    def save(self, *args, **kwargs):
        if not self.name_trans:
            self.name_trans = traducir_por_defecto(self.name, 'en')
        super(Definition, self).save(*args, **kwargs)

    class Meta:
        verbose_name = 'Definición'
        verbose_name_plural = 'Definiciones'


class Product(models.Model):
    objects = models.Manager()
    combined = ProductsAndGroupsManager()
    batch = models.ForeignKey(Batch, on_delete=models.SET_NULL, null=True, blank=True, related_name='product_batch')
    definition = models.ForeignKey('org.Definition', on_delete=models.CASCADE, related_name='product_definition',
                                   verbose_name='Definición')
    brand = models.CharField(max_length=255, verbose_name='Marca')
    image = models.ImageField(upload_to='categories/', verbose_name='Imagen', null=True, blank=True, )
    name = models.CharField(max_length=255, verbose_name='Nombre')
    name_trans = models.CharField(max_length=255, verbose_name='Traducción del nombre',
                                  help_text='Dejar este campo vacío hará que el sistema proponga una traducción '
                                            'automática. La traducción automática puede ser modificada.',
                                  null=True, blank=True)
    description = models.CharField(max_length=255, verbose_name='Descripción')
    description_trans = models.CharField(max_length=255, verbose_name='Traducción de la descripción',
                                         help_text='Dejar este campo vacío hará que el sistema proponga una traducción '
                                                   'automática. La traducción automática puede ser modificada.',
                                         null=True, blank=True)

    unit_of_measurement = models.CharField(max_length=255, verbose_name='unidad de medida')
    unit_of_measurement_trans = models.CharField(max_length=255, verbose_name='Traducción de la unidad de medida',
                                                 help_text='Dejar este campo vacío hará que el sistema proponga una'
                                                           ' traducción '
                                                           'automática. La traducción automática puede ser modificada.',
                                                 null=True, blank=True)
    price = models.FloatField(verbose_name='Precio', validators=[MinValueValidator(0.01)])
    stock = models.IntegerField(verbose_name='Cantidad de inventario')
    visible = models.BooleanField(default=False)
    sales = models.IntegerField(default=0, verbose_name='Ventas')
    sku = models.CharField(max_length=255, help_text='Código interno de la empresa', unique=True)
    modified = models.DateTimeField(default=django.utils.timezone.now)
    is_recommended = models.BooleanField('Recomendado', default=False)

    def __str__(self):
        return '{}'.format(self.name)

    @property
    def get_modified(self):
        return datetime(year=self.modified.year, month=self.modified.month, day=self.modified.day,
                        hour=self.modified.hour, minute=self.modified.minute, second=self.modified.second,
                        microsecond=self.modified.microsecond, )

    def thumbnail(self):
        if not self.image:
            return mark_safe('<img src="' + MEDIA_URL + 'default_img/empty.png' + '" width="120">')
        return mark_safe('<img src="' + self.image.url + '" width="120">')

    thumbnail.short_description = 'Vista previa'
    thumbnail.allow_tags = True

    def save(self, *args, **kwargs):
        if not self.name_trans:
            self.name_trans = traducir_por_defecto(self.name, 'en')
        if not self.description_trans:
            self.description_trans = traducir_por_defecto(self.description, 'en')
        if not self.unit_of_measurement_trans:
            self.unit_of_measurement_trans = traducir_por_defecto(self.unit_of_measurement, 'en')
        self.modified = datetime.now()
        self.modified = self.modified.astimezone(getTimezone())
        super(Product, self).save(*args, **kwargs)
        for asociation in AsociationProductGroup.objects.filter(product=self):
            asociation.save(force_update=True)

    def gallery(self):
        gallery = []
        if len(self.product_images.all()) > 0:
            for image in self.product_images.all():
                gallery.append(image.image.url)
        return gallery

    class Meta:
        verbose_name = 'Producto'
        verbose_name_plural = 'Productos'
        ordering = ['definition', 'sku', ]


class ProductGallery(models.Model):
    product = models.ForeignKey('org.Product', on_delete=models.CASCADE, related_name='product_images')
    image = models.ImageField(upload_to='product_images/')

    def __str__(self):
        return 'Imagen {}'.format(self.pk)

    def thumbnail(self):
        return mark_safe('<img src="' + self.image.url + '" width="120">')

    thumbnail.short_description = 'Vista previa'
    thumbnail.allow_tags = True

    class Meta:
        verbose_name = 'Imagen de producto'
        verbose_name_plural = 'Imágenes de producto'


class ProductGroup(models.Model):
    uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    products = models.ManyToManyField('org.Product', through='AsociationProductGroup', related_name='group_of_products')
    batch = models.ForeignKey(Batch, on_delete=models.SET_NULL, null=True, blank=True, related_name='group_batch')
    definition = models.ForeignKey('org.Definition', on_delete=models.CASCADE, related_name='group_definition')
    brand = models.CharField(max_length=255, verbose_name='Marca')
    image = models.ImageField(upload_to='categories/', verbose_name='Imagen')
    name = models.CharField(max_length=255, verbose_name='Nombre')
    name_trans = models.CharField(max_length=255, verbose_name='Traducción del nombre',
                                  help_text='Dejar este campo vacío hará que el sistema proponga una traducción '
                                            'automática. La traducción automática puede ser modificada.',
                                  null=True, blank=True)
    description = models.CharField(max_length=255, verbose_name='Descripción')
    description_trans = models.CharField(max_length=255, verbose_name='Traducción de la descripción',
                                         help_text='Dejar este campo vacío hará que el sistema proponga una traducción '
                                                   'automática. La traducción automática puede ser modificada.',
                                         null=True, blank=True)

    unit_of_measurement = models.CharField(max_length=255, verbose_name='unidad de medida')
    unit_of_measurement_trans = models.CharField(max_length=255, verbose_name='Traducción de la unidad de medida',
                                                 help_text='Dejar este campo vacío hará que el sistema proponga una'
                                                           ' traducción '
                                                           'automática. La traducción automática puede ser modificada.',
                                                 null=True, blank=True)
    price = models.FloatField(verbose_name='Precio', validators=[MinValueValidator(0.01)])
    stock = models.IntegerField(null=True, blank=True,
                                help_text='El sistema determinará la disponibilidad',
                                verbose_name='Cantidad de inventario')
    visible = models.BooleanField(default=False)
    sales = models.IntegerField(default=0, verbose_name='Ventas')
    sku = models.CharField(max_length=255, null=True, blank=True, help_text='Código interno de la empresa. Opcional')
    modified = models.DateTimeField(default=django.utils.timezone.now)
    is_recommended = models.BooleanField('Recomendado', default=False)

    # @property
    # def get_modified(self):
    #     return datetime(year=self.modified.year, month=self.modified.month, day=self.modified.day,
    #                     hour=self.modified.hour, minute=self.modified.minute, second=self.modified.second,
    #                     microsecond=self.modified.microsecond, )

    def __str__(self):
        return '{}'.format(self.name)

    def thumbnail(self):
        return mark_safe('<img src="' + self.image.url + '" width="120">')

    thumbnail.short_description = 'Vista previa'
    thumbnail.allow_tags = True

    def gallery(self):
        gallery = []
        if len(self.group_images.all()) > 0:
            for image in self.group_images.all():
                gallery.append(image.image.url)
        return gallery

    def save(self, *args, **kwargs):
        if not self.name_trans:
            self.name_trans = traducir_por_defecto(self.name, 'en')
        if not self.description_trans:
            self.description_trans = traducir_por_defecto(self.description, 'en')
        if not self.unit_of_measurement_trans:
            self.unit_of_measurement_trans = traducir_por_defecto(self.unit_of_measurement, 'en')
        self.modified = datetime.now()
        self.modified = self.modified.astimezone(getTimezone())
        actual_quantity = self.stock
        if actual_quantity is not None:
            for asociation in self.asociated_group.all():
                potential_quantity = asociation.calculate_stock()
                if potential_quantity < actual_quantity:
                    actual_quantity = potential_quantity
            if actual_quantity < 0:
                actual_quantity = 0
        else:
            actual_quantity = 0
        self.stock = actual_quantity
        super(ProductGroup, self).save(*args, **kwargs)

    class Meta:
        verbose_name = 'Agrupación de productos'
        verbose_name_plural = 'Agrupaciones de productos'
        ordering = ['definition', 'sku', ]


class ProductGroupGallery(models.Model):
    group = models.ForeignKey('org.ProductGroup', on_delete=models.CASCADE, related_name='group_images')
    image = models.ImageField(upload_to='group_images/')

    def __str__(self):
        return 'Imagen {}'.format(self.pk)

    def thumbnail(self):
        return mark_safe('<img src="' + self.image.url + '" width="120">')

    thumbnail.short_description = 'Vista previa'
    thumbnail.allow_tags = True

    class Meta:
        verbose_name = 'Imagen de grupo de productos'
        verbose_name_plural = 'Imágenes de grupo de productos'


class AsociationProductGroup(models.Model):
    group = models.ForeignKey('org.ProductGroup', on_delete=models.CASCADE, related_name='asociated_group')
    product = models.ForeignKey('org.Product', on_delete=models.CASCADE, related_name='asociated_product')
    quantity = models.PositiveIntegerField(default=1, validators=[MinValueValidator(1)])

    def __str__(self):
        return '{}x {}'.format(str(self.quantity), self.product.name)

    class Meta:
        verbose_name = 'Asociación de productos'
        verbose_name_plural = 'Asociaciones de productos'
        unique_together = ('product', 'group')

    def calculate_stock(self):
        actual_quantity = int(self.product.stock / self.quantity)
        return actual_quantity

    def save(
            self, force_insert=False, force_update=False, using=None, update_fields=None
    ):
        super(AsociationProductGroup, self).save(force_insert=False, force_update=False, using=None,
                                                 update_fields=None)
        actual_quantity = self.calculate_stock()
        for asociation in AsociationProductGroup.objects.filter(group=self.group):
            potential_quantity = asociation.calculate_stock()
            if potential_quantity < actual_quantity:
                actual_quantity = potential_quantity
        group = self.group
        if actual_quantity < 0:
            actual_quantity = 0
        group.stock = actual_quantity
        group.save(force_update=True)


class Order(models.Model):
    uuid = models.CharField(max_length=900, unique=True, primary_key=True)
    user = models.ForeignKey(User, on_delete=models.SET_DEFAULT,
                             default=None, related_name='order_user')
    date_of_creation = models.DateTimeField()
    total = models.FloatField(default=0)
    status = models.CharField(max_length=255)

    def __str__(self):
        return 'Orden {} de {}'.format(self.pk, self.user.email)

    class Meta:
        verbose_name = 'Orden'
        verbose_name_plural = 'Órdenes'
        ordering = ['-date_of_creation', ]


class Component(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='component_order')
    product = models.ForeignKey(Product, on_delete=models.SET_DEFAULT, default=None, null=True, blank=True,
                                related_name='component_product', verbose_name='Producto')
    group = models.ForeignKey(ProductGroup, on_delete=models.SET_DEFAULT, default=None, null=True, blank=True,
                              related_name='component_group', verbose_name='Grupo')
    actual_product = models.CharField(max_length=500, null=True, blank=True, verbose_name='Product Real')
    quantity = models.IntegerField()
    actual_amount = models.FloatField(null=True, blank=True, verbose_name='Cantidad Real')

    def __str__(self):
        return '{} x{}'.format(self.product.name, self.quantity)

    class Meta:
        verbose_name = 'Componente'
        verbose_name_plural = 'Componentes'


# Mis modelos
phone_regex = RegexValidator(
    regex=r'\+?1?\d{9,15}$',
    message='El teléfono debe estar en este formato: +9999999999. Hasta 15 dígitos permitidos.'
)


class Contact(models.Model):
    name = models.CharField(verbose_name='Nombre', max_length=100)
    last_name = models.CharField(verbose_name='Apellidos', max_length=200)
    email = models.EmailField('Correo del contacto', unique=True,
                              error_messages={'unique': 'Un contacto con este correo ya existe'})
    description = models.CharField(max_length=500, verbose_name='Descripción', null=True, blank=True)
    phone_number = models.CharField(validators=[phone_regex], max_length=17, unique=True, error_messages={
        'unique': 'Ya este teléfono está registrado'
    }, verbose_name='Celular', help_text='Debe empezar con "+"')

    class Meta:
        verbose_name = 'Contacto'
        verbose_name_plural = 'Contactos'

    def get_full_name(self):
        return self.name + ' ' + self.last_name

    get_full_name.short_description = 'Nombre completo'

    def __str__(self):
        return self.get_full_name()

    def toJSON(self):
        item = model_to_dict(self)
        item['full_name'] = str(self)
        return item


class About(models.Model):
    info = models.TextField('Información')
    info_trans = models.TextField(verbose_name='Traducción de la información',
                                  help_text='Dejar este campo vacío hará que el sistema proponga una traducción '
                                            'automática. La traducción automática puede ser modificada.',
                                  null=True, blank=True)

    def __str__(self):
        return self.info

    class Meta:
        verbose_name = 'Información'
        verbose_name_plural = 'Informaciones'

    def save(self, *args, **kwargs):
        if not self.info_trans:
            self.info_trans = traducir_por_defecto(self.info, 'en')
        super(About, self).save(*args, **kwargs)


class Termino(models.Model):
    info = models.TextField('Información')
    info_trans = models.TextField(verbose_name='Traducción de la información',
                                  help_text='Dejar este campo vacío hará que el sistema proponga una traducción '
                                            'automática. La traducción automática puede ser modificada.',
                                  null=True, blank=True)

    def __str__(self):
        return self.info

    class Meta:
        verbose_name = 'Términos y condiciones'
        verbose_name_plural = 'Términos y condiciones'

    def save(self, *args, **kwargs):
        if not self.info_trans:
            self.info_trans = traducir_por_defecto(self.info, 'en')
        super(Termino, self).save(*args, **kwargs)
