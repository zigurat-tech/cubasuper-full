import operator
import uuid
from datetime import datetime

from crum import get_current_user
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView, get_object_or_404, ListAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from cubasuper.utiles import getTimezone
from org.models import Product, Slide, Category, Subcategory, Definition, Order, Component, ProductGroup, Contact, \
    About, Termino
from org.serializers import ProductSerializer, SlideSerializer, CategorySerializer, SubcategorySerializer, \
    DefinitionSerializer, UserSerializer, ContactSerializer, AboutSerializer, TerminoSerializer


# JSON de producto creo
def fill_json(product, subcategory_id=None, category_id=None, definition_id=None, brand_id=None, min=None, max=None):
    user = get_current_user()
    if subcategory_id is not None and product.definition.subcategory.pk != subcategory_id:
        return None
    if category_id is not None and product.definition.subcategory.category.pk != category_id:
        return None
    if definition_id is not None and product.definition.pk != definition_id:
        return None
    if brand_id is not None and product.brand not in brand_id:
        return None
    if min is not None and product.price < float(min):
        return None
    if max is not None and product.price > float(max):
        return None
    json_product = {
        'id': str(product.pk),
        "name_trans": product.name_trans,
        "name": str(product.name),
        "brand": str(product.brand),
        "definition_id": product.definition.id,
        "definition": {
            'id': product.definition.id,
            'name': product.definition.name,
            'name_trans': product.definition.name_trans,
            'subcategory': {
                'id': product.definition.subcategory.id,
                'name': product.definition.subcategory.name,
                'name_trans': product.definition.subcategory.name_trans,
                'category': {
                    'id': product.definition.subcategory.category.id,
                    'name': product.definition.subcategory.category.name,
                    'name_trans': product.definition.subcategory.category.name_trans,
                    'image': product.definition.subcategory.category.image.url
                },
            },
        },
        "description": str(product.description),
        "description_trans": str(product.description_trans),
        "unit_of_measurement": str(product.unit_of_measurement),
        "unit_of_measurement_trans": str(product.unit_of_measurement_trans),
        "price": product.price * 100,
        "stock": product.stock,
        "sales": product.sales,
        "sku": str(product.sku),
        "image": str(product.image.url),
        "gallery": product.gallery(),
        'modified_int': int(product.modified.strftime('%Y%m%d%H%M%S'))
    }

    return json_product


class UserView(ListCreateAPIView):
    serializer_class = UserSerializer
    queryset = User.objects.all()

    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)


class UserDetail(RetrieveUpdateDestroyAPIView):
    serializer_class = UserSerializer
    queryset = User.objects.all()


class IndexView(ListAPIView):
    serializer_class = ProductSerializer
    queryset = Product.objects.filter(visible=True)

    def list(self, request, *args, **kwargs):
        try:
            offset = int(self.request.query_params['offset'])
        except:
            offset = 0
        try:
            limit = int(self.request.query_params['limit'])
        except:
            limit = 999999
        try:
            subcategory_id = int(self.request.query_params['subcategory'])
        except:
            subcategory_id = None
        try:
            category_id = int(self.request.query_params['category'])
        except:
            category_id = None
        try:
            definition_id = int(self.request.query_params['definition'])
        except:
            definition_id = None
        try:
            brand_id = self.request.query_params['brand']
        except:
            brand_id = None
        try:
            min = int(self.request.query_params['min'])
        except:
            min = None
        try:
            max = int(self.request.query_params['max'])
        except:
            max = None
        json_data = []

        for product in Product.combined.all():
            if product.visible:
                json_product = fill_json(product=product, subcategory_id=subcategory_id,
                                         category_id=category_id, definition_id=definition_id, brand_id=brand_id,
                                         min=min, max=max)
                if json_product is not None:
                    json_data.append(json_product)
        # json_data = sorted(json_data, key=operator.itemgetter('definition_id'))

        populares = []
        for p in Product.combined.all():
            if p.visible:
                json_product = fill_json(product=p, subcategory_id=subcategory_id,
                                         category_id=category_id, definition_id=definition_id, brand_id=brand_id,
                                         min=min, max=max)
                if json_product is not None:
                    populares.append(json_product)
        populares = sorted(populares, key=operator.itemgetter('sales'), reverse=True)

        novedades = []
        for p in Product.combined.all():
            if p.visible:
                json_product = fill_json(product=p, subcategory_id=subcategory_id,
                                         category_id=category_id, definition_id=definition_id, brand_id=brand_id,
                                         min=min, max=max)
                if json_product is not None:
                    novedades.append(json_product)
        novedades = sorted(novedades, key=operator.itemgetter('id'), reverse=True)
        novedades = sorted(novedades, key=lambda prod: prod['modified_int'], reverse=True)

        recomendados = []
        for p in Product.combined.all():
            if p.visible and p.is_recommended:
                json_product = fill_json(product=p, subcategory_id=subcategory_id,
                                         category_id=category_id, definition_id=definition_id, brand_id=brand_id,
                                         min=min, max=max)
                if json_product is not None:
                    recomendados.append(json_product)
        response = {
            'novedades': novedades[:8],
            'recomendados': recomendados[:8],
            'populares': populares[:8],
            'banners': [i.toJSON() for i in Slide.objects.filter(visible=True)],
        }

        print({'results': json_data[offset:offset + limit], 'count': len(json_data[offset:offset + limit]),
               'total': len(json_data)})
        print(response)

        # return Response({'results': json_data[offset:offset + limit], }, status=status.HTTP_200_OK, )
        return Response(data={'results': response, }, status=status.HTTP_200_OK, )


class ProductView(ListCreateAPIView):
    serializer_class = ProductSerializer
    queryset = Product.objects.filter(visible=True)

    def list(self, request, *args, **kwargs):
        try:
            offset = int(self.request.query_params['offset'])
        except:
            offset = 0
        try:
            limit = int(self.request.query_params['limit'])
        except:
            limit = 999999
        try:
            subcategory_id = int(self.request.query_params['subcategory'])
        except:
            subcategory_id = None
        try:
            category_id = int(self.request.query_params['category'])
        except:
            category_id = None
        try:
            definition_id = int(self.request.query_params['definition'])
        except:
            definition_id = None
        try:
            brand_id = self.request.query_params['brand']
        except:
            brand_id = None
        try:
            min = int(self.request.query_params['min'])
        except:
            min = None
        try:
            max = int(self.request.query_params['max'])
        except:
            max = None
        json_data = []
        for product in Product.combined.all():
            if product.visible:
                json_product = fill_json(product=product, subcategory_id=subcategory_id,
                                         category_id=category_id, definition_id=definition_id, brand_id=brand_id,
                                         min=min, max=max)
                if json_product is not None:
                    json_data.append(json_product)
        json_data = sorted(json_data, key=operator.itemgetter('definition_id'))
        return Response({'results': json_data[offset:offset + limit], 'count': len(json_data[offset:offset + limit]),
                         'total': len(json_data)}, status=status.HTTP_200_OK,
                        content_type='application/json')


class ProductoDetail(RetrieveUpdateDestroyAPIView):
    serializer_class = ProductSerializer
    queryset = Product.objects.all().filter(visible=True)
    lookup_field = 'uuid'

    def retrieve(self, request, *args, **kwargs):
        try:
            pk = int(self.kwargs.get('pk'))
        except:
            pk = self.kwargs.get('pk')
        object = None
        for product in Product.combined.all():
            if str(product.pk) == str(pk):
                object = product
                break
        serializer = fill_json(object)
        json_data = []
        for product in Product.combined.all():
            if product.visible:
                json_product = fill_json(product=product, subcategory_id=object.definition.subcategory.pk)
                if json_product is not None:
                    json_data.append(json_product)
        return Response({'results': [serializer], 'related': json_data[:10]})


class SlideView(ListCreateAPIView):
    serializer_class = SlideSerializer
    queryset = Slide.objects.filter(visible=True)


class SlideDetail(RetrieveUpdateDestroyAPIView):
    serializer_class = SlideSerializer
    queryset = Slide.objects.filter(visible=True)


class CategoryView(ListCreateAPIView):
    serializer_class = CategorySerializer
    queryset = Category.objects.all()

    def list(self, request, *args, **kwargs):
        json_data = []
        for category in Category.objects.all():
            aux = {'id': category.pk, 'image': category.image_category()}
            aux['name_trans'] = category.name_trans
            aux['name'] = category.name
            aux['promoted'] = category.promoted
            aux['subcategories'] = category.get_subcategories()
            json_data.append(aux)
        return Response({'results': json_data, 'count': len(json_data)}, status=status.HTTP_200_OK,
                        content_type='application/json')


class CategoryDetail(RetrieveUpdateDestroyAPIView):
    serializer_class = CategorySerializer
    queryset = Category.objects.all()


class SubcategoryView(ListCreateAPIView):
    serializer_class = SubcategorySerializer
    queryset = Subcategory.objects.all()


class SubcategoryDetail(RetrieveUpdateDestroyAPIView):
    serializer_class = SubcategorySerializer
    queryset = Subcategory.objects.all()


class DefinitionView(ListCreateAPIView):
    serializer_class = DefinitionSerializer
    queryset = Definition.objects.all()


class DefinitionDetail(RetrieveUpdateDestroyAPIView):
    serializer_class = DefinitionSerializer
    queryset = Definition.objects.all()


class PromotedCategoriesView(ListAPIView):
    serializer_class = CategorySerializer
    queryset = Category.objects.filter(promoted=True)


class Search(APIView):
    serializer_class = ProductSerializer
    queryset = Product.objects.all()

    def get(self, request, *args, **kwargs):
        try:
            offset = int(self.request.query_params['offset'])
        except:
            offset = 0
        try:
            limit = int(self.request.query_params['limit'])
        except:
            limit = 999999
        try:
            subcategory_id = int(self.request.query_params['subcategory'])
        except:
            subcategory_id = None
        try:
            category_id = int(self.request.query_params['category'])
        except:
            category_id = None
        try:
            definition_id = int(self.request.query_params['definition'])
        except:
            definition_id = None
        try:
            brand_id = str(self.request.query_params['brand']).split(';')
        except:
            brand_id = None
        try:
            min = int(self.request.query_params['min'])
        except:
            min = None
        try:
            max = int(self.request.query_params['max'])
        except:
            max = None
        text = str(self.kwargs['text'])
        products = []

        brands = []
        def_tree = {}
        for product in Product.objects.all():
            if product.name.lower().__contains__(text.lower()) or product.name_trans.lower().__contains__(text.lower()):
                json_object = fill_json(product=product, subcategory_id=subcategory_id,
                                        category_id=category_id, definition_id=definition_id, brand_id=brand_id,
                                        min=min, max=max)
                if json_object is not None:
                    products.append(json_object)
                if product.brand not in brands:
                    brands.append(product.brand)
                if str(product.definition.subcategory.category.uuid) not in def_tree:
                    def_tree["" + str(product.definition.subcategory.category.uuid)] = \
                        {
                            "id": product.definition.subcategory.category.pk,
                            "name": product.definition.subcategory.category.name,
                            "name_trans": product.definition.subcategory.category.name_trans,
                            "image": product.definition.subcategory.category.image.url,
                            "subcategories": {},
                        }
                else:
                    if str(product.definition.subcategory.uuid) not in \
                            def_tree[str(product.definition.subcategory.category.uuid)]["subcategories"]:
                        def_tree[str(product.definition.subcategory.category.uuid)]["subcategories"][
                            str(product.definition.subcategory.uuid)] = \
                            {
                                "id": product.definition.subcategory.pk,
                                "name": product.definition.subcategory.name,
                                "name_trans": product.definition.subcategory.name_trans,
                                "definitions": {}
                            }
                    else:
                        if str(product.definition.uuid) not in \
                                def_tree[str(product.definition.subcategory.category.uuid)]["subcategories"][
                                    str(product.definition.subcategory.uuid)]["definitions"]:
                            def_tree[str(product.definition.subcategory.category.uuid)]["subcategories"][
                                str(product.definition.subcategory.uuid)]["definitions"][str(product.definition.uuid)] = \
                                {
                                    "id": product.definition.pk,
                                    "name": product.definition.name,
                                    "name_trans": product.definition.name_trans,
                                }
        return Response(data={'products': products, 'tree': def_tree, 'brands': brands},
                        content_type='application/json', )


class RelatedProducts(APIView):
    serializer_class = ProductSerializer
    queryset = Product.objects.all()

    def get(self, request, *args, **kwargs):
        try:
            offset = int(self.request.query_params['offset'])
        except:
            offset = 0
        try:
            limit = int(self.request.query_params['limit'])
        except:
            limit = 999999
        try:
            subcategory_id = int(self.request.query_params['subcategory'])
        except:
            subcategory_id = None
        try:
            category_id = int(self.request.query_params['category'])
        except:
            category_id = None
        try:
            definition_id = int(self.request.query_params['definition'])
        except:
            definition_id = None
        try:
            brand_id = str(self.request.query_params['brand']).split(';')
        except:
            brand_id = None
        try:
            min = int(self.request.query_params['min'])
        except:
            min = None
        try:
            max = int(self.request.query_params['max'])
        except:
            max = None
        products = []
        for product in Product.objects.all():
            json_object = fill_json(product=product, subcategory_id=subcategory_id,
                                    category_id=category_id, definition_id=definition_id, brand_id=brand_id,
                                    min=min, max=max)
        return Response(data={'products': products}, content_type='application/json', )


class CheckoutRedsys(APIView):
    serializer_class = ProductSerializer
    queryset = Product.objects.all()
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        errores = False
        print(request.data)
        # print(request.data['component'])
        try:
            cric = uuid.uuid4().hex[:6].upper()
            while len(Order.objects.filter(uuid=cric)) != 0:
                cric = uuid.uuid4().hex[:6].upper()
                cric = "TC{}".format(cric)
            # components = literal_eval(request.data['component'])
            components = request.data['component']
            print(components)
            to_be_saved = []
            # get user
            date_of_creation = str(request.data['date_of_creation']).replace("\"", "").replace(' ', '-').replace(':',
                                                                                                                 '-').split(
                '-')
            date_of_creation = datetime(year=int(date_of_creation[0]), month=int(date_of_creation[1]),
                                        day=int(date_of_creation[2]), hour=int(date_of_creation[3]),
                                        minute=int(date_of_creation[4]), second=int(date_of_creation[5]))
            date_of_creation = date_of_creation.astimezone(getTimezone())
            # get total price
            total = float(request.data['total'])
            order = Order()
            order.uuid = cric
            order.status = "ACEPTADA"
            order.date_of_creation = date_of_creation
            # order.user_id = int(request.data['user'])
            user = User.objects.get(username=request.data['user'])
            order.user_id = user.id
            order.total = total
            order.save()
            for component in components:
                if int(component['quantity']) > 0:
                    # assume there is a product and not a group
                    try:
                        # get the product
                        product = get_object_or_404(Product, pk=int(component['product']))
                        # store the inventory amount
                        backup = product.stock
                        # get the amount to be rested
                        inv_amount = int(component['quantity'])
                        # build the component for the order
                        comp = Component(order=order, product_id=int(component['product']),
                                         quantity=component['quantity'], group_id=None,
                                         actual_product=product.name,
                                         actual_amount=float(component['actual_amount']))
                        comp.save()
                        # check if theres enough existences
                        if product.stock - inv_amount >= 0:
                            backup = component['quantity']
                        # check if this product has already been inserted into the collection
                        existe = False
                        for pre_saved in to_be_saved:
                            if pre_saved.pk == product.pk:
                                # if the product exists, add it this inventory amount
                                pre_saved.stock = pre_saved.stock - inv_amount
                                pre_saved.sales = pre_saved.sales + backup
                                existe = True
                                break
                        # if the product does not exist, add it to the collection
                        if not existe:
                            product.sales = product.sales + 1
                            product.stock = product.stock - inv_amount
                            to_be_saved.append(product)
                        # if theres not enough amount then notify it on the recipe
                        if product.stock <= -1:
                            errores = True
                    except Exception as e1:
                        print('Excepcion1 ' + str(e1))
                        # if the component is not a product then it's a group
                        group = get_object_or_404(ProductGroup, pk=str(component['product']))
                        sales = None
                        for prod in group.asociated_group.all():
                            product = get_object_or_404(Product, pk=int(prod.product.pk))
                            backup = product.stock
                            a_rebajar = (int(component['quantity']) * prod.quantity)
                            comp = Component(order=order, product_id=product.pk, group_id=group.pk,
                                             quantity=component['quantity'], actual_product=group.name,
                                             actual_amount=float(component['actual_amount']))
                            comp.save()
                            if product.stock - a_rebajar >= 0:
                                backup = component['quantity']
                                if sales is None or sales > backup:
                                    sales = backup
                            existe = False
                            for pre_salvado in to_be_saved:
                                if pre_salvado.pk == product.pk:
                                    pre_salvado.stock = pre_salvado.stock - a_rebajar
                                    pre_salvado.sales = pre_salvado.sales + backup
                                    existe = True
                                    break
                            if not existe:
                                product.sales = product.sales
                                product.stock = product.stock - a_rebajar
                                to_be_saved.append(product)
                            if product.stock <= -1:
                                errores = True
                        existe = False
                        for pre_salvado in to_be_saved:
                            if pre_salvado.pk == group.pk:
                                try:
                                    pre_salvado.sales = pre_salvado.sales + sales
                                except:
                                    pre_salvado.sales = pre_salvado.sales + 0
                                existe = True
                                break
                        if not existe:
                            try:
                                group.sales = group.sales + sales
                            except:
                                group.sales = group.sales + 0
                            to_be_saved.append(group)
            return Response(data={"status": "success"}, status=200, content_type='application/json')
        except Exception as e:
            print('Excepcion ' + str(e))
            return Response(data={"status": "error_gateway"}, status=500, content_type='application/json')


class ContactView(ListCreateAPIView):
    serializer_class = ContactSerializer
    queryset = Contact.objects.all()


class ContactDetail(RetrieveUpdateDestroyAPIView):
    serializer_class = ContactSerializer
    queryset = Contact.objects.all()


class AboutView(ListCreateAPIView):
    serializer_class = AboutSerializer
    queryset = About.objects.all()


class AboutDetail(RetrieveUpdateDestroyAPIView):
    serializer_class = AboutSerializer
    queryset = About.objects.all()


class TerminoView(ListCreateAPIView):
    serializer_class = TerminoSerializer
    queryset = Termino.objects.all()


class TerminoDetail(RetrieveUpdateDestroyAPIView):
    serializer_class = TerminoSerializer
    queryset = Termino.objects.all()
