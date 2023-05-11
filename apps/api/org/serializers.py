from django.contrib.auth.models import User, Group
from rest_framework import serializers
from rest_framework.fields import Field

from org.models import Slide, Category, Subcategory, Definition, Product, ProductGroup, Contact, About, Termino


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    last_login = serializers.DateTimeField(read_only=True)
    is_superuser = serializers.BooleanField(read_only=False)
    is_staff = serializers.BooleanField(read_only=True)
    is_active = serializers.BooleanField(read_only=True)

    def create(self, validated_data):
        # email = str(validated_data['email']).lower()
        # if len(User.objects.filter(email=email)) != 0:
        #     raise Exception('Ya existe ese usuario')
        # validated_data['email'] = email
        # user = User.objects.create(**validated_data)
        # user.email = email
        # user.save()
        # user.set_password(validated_data['password'])
        # user.is_active = False
        # user.groups = []
        # user.save()
        # mio
        invalidInputs = ["", None]
        email = str(validated_data['email']).lower()
        if User.objects.filter(email=email).exists() or \
                User.objects.filter(username=validated_data['username']).exists():
            raise Exception('Ya existe ese usuario')
        validated_data['email'] = email
        if validated_data['username'].strip() in invalidInputs or validated_data['password'].strip() in invalidInputs:
            raise Exception('Usuario o contraseña vacíos')

        user = User()
        user.username = validated_data['username']
        user.email = validated_data['email']
        user.first_name = validated_data['first_name'] if validated_data['first_name'] else None
        user.last_name = validated_data['last_name'] if validated_data['last_name'] else None
        user.set_password(validated_data['password'])
        user.is_superuser = validated_data['is_superuser']
        user.is_staff = False
        user.is_active = False
        user.save()
        return user

    class Meta:
        model = User
        fields = ['id', 'password', 'email', 'first_name', 'last_name', 'is_staff', 'is_active',
                  'is_superuser', 'last_login', 'username']


class SlideSerializer(serializers.ModelSerializer):
    image = serializers.CharField(source='image_slide')

    class Meta:
        model = Slide
        fields = '__all__'


class CategorySerializer(serializers.ModelSerializer):
    image = serializers.CharField(source='image_category')

    class Meta:
        model = Category
        fields = '__all__'


class SubcategorySerializer(serializers.ModelSerializer):
    category = CategorySerializer()

    class Meta:
        model = Subcategory
        fields = '__all__'


class DefinitionSerializer(serializers.ModelSerializer):
    subcategory = SubcategorySerializer()

    class Meta:
        model = Definition
        fields = '__all__'


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'


class ProductGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductGroup
        fields = '__all__'


class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contact
        fields = ['name', 'last_name', 'email', 'description', 'phone_number', 'get_full_name']


class AboutSerializer(serializers.ModelSerializer):
    class Meta:
        model = About
        fields = '__all__'


class TerminoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Termino
        fields = '__all__'
