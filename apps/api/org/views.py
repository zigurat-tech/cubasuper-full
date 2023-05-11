import pandas as pd
from os.path import splitext

from django.http import HttpRequest
from django.shortcuts import redirect

from org.models import Product


def load_images(request: HttpRequest, *args, **kwargs):
    if request.method == 'POST':
        for i in request.FILES.getlist('imagenes'):
            name, ext = splitext(i.name)
            if Product.objects.filter(sku=name).exists():
                prod = Product.objects.get(sku=name)
                prod.image = i
                prod.save()
    return redirect('/admin/org/product/')


def load_excel(request: HttpRequest, *args, **kwargs):
    if request.method == 'POST':
        file = request.FILES.get('excel')
        name, ext = splitext(file.name)
        df = pd.read_excel(file)
        if ext.__contains__('xls'):
            for index, row in df.iterrows():
                try:
                    sku = row['sku']
                    name = row['name']
                    brand = row['brand']
                    batch = row['batch']
                    definition = row['definition']
                    description = row['description']
                    unit_of_measurement = row['unit_of_measurement']
                    price = row['price']
                    stock = row['stock']
                    if Product.objects.filter(sku=sku).exists():
                        Product.objects.filter(sku=sku).update(name=name, brand=brand, batch_id=batch,
                                                               definition_id=definition, description=description,
                                                               unit_of_measurement=unit_of_measurement, price=price,
                                                               stock=stock)
                    else:
                        Product.objects.create(name=name, brand=brand, batch_id=batch, definition_id=definition,
                                               description=description, unit_of_measurement=unit_of_measurement,
                                               price=price, stock=stock, sku=sku)
                except Exception as e:
                    print(str(e))

    return redirect('/admin/org/product/')
