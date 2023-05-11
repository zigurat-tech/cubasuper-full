from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path
from rest_framework import permissions
# from rest_framework.authtoken.views import obtain_auth_token
from rest_framework.documentation import include_docs_urls
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView, TokenVerifyView
)

from cubasuper import settings
from org.api import ProductView, ProductoDetail, SlideView, SlideDetail, CategoryView, CategoryDetail, SubcategoryView, \
    SubcategoryDetail, DefinitionView, DefinitionDetail, PromotedCategoriesView, Search, UserView, UserDetail, \
    CheckoutRedsys, IndexView, ContactView, ContactDetail, AboutView, AboutDetail, TerminoView, TerminoDetail
from org.views import load_images, load_excel

urlpatterns = [
                  path('admin/', admin.site.urls),
                  path('backend/coreapi/',
                       include_docs_urls(title=settings.ADMIN_SITE_NAME, permission_classes=(permissions.AllowAny,))),
                  # Mis URLS
                  path('backend/v1/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
                  path('backend/v1/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
                  path('backend/v1/token/verify/', TokenVerifyView.as_view(), name='token_verify'),
                  path('backend/v1/index/', IndexView.as_view(), name='index_view'),
                  path('backend/v1/contact/', ContactView.as_view(), name='contact_view'),
                  path('backend/v1/contact/<int:pk>/', ContactDetail.as_view(), name='contact_detail'),
                  path('backend/v1/about/', AboutView.as_view(), name='about_view'),
                  path('backend/v1/about/<int:pk>/', AboutDetail.as_view(), name='about_detail'),
                  path('backend/v1/termino/', TerminoView.as_view(), name='termino_view'),
                  path('backend/v1/termino/<int:pk>/', TerminoDetail.as_view(), name='termino_detail'),
                  path('load_images/', load_images, name='load-images'),
                  path('load_excel/', load_excel, name='load-excel'),
                  # path('backend/v1/auth/', obtain_auth_token, name='api_token_auth'),
                  # Marios urls
                  path('backend/v1/product/', ProductView.as_view(), name='product_view'),
                  path('backend/v1/product/<int:pk>/', ProductoDetail.as_view(), name='product_detail'),
                  path('backend/v1/slide/', SlideView.as_view(), name='slide_view'),
                  path('backend/v1/slide/<int:pk>/', SlideDetail.as_view(), name='slide_detail'),
                  path('backend/v1/category/', CategoryView.as_view(), name='category_view'),
                  path('backend/v1/category/promoted/', PromotedCategoriesView.as_view(),
                       name='promoted_categories_view'),
                  path('backend/v1/category/<int:pk>/', CategoryDetail.as_view(), name='category_detail'),
                  path('backend/v1/subcategory/', SubcategoryView.as_view(), name='subcategory_view'),
                  path('backend/v1/subcategory/<int:pk>/', SubcategoryDetail.as_view(), name='subcategory_detail'),
                  path('backend/v1/definition/', DefinitionView.as_view(), name='definition_view'),
                  path('backend/v1/definition/<int:pk>/', DefinitionDetail.as_view(), name='definition_detail'),
                  path('backend/v1/search/<text>/', Search.as_view(), name='search'),
                  path('backend/v1/user/', UserView.as_view(), name='user_view'),
                  path('backend/v1/user/<int:pk>/', UserDetail.as_view(), name='user_detail'),
                  path('backend/v1/checkout/', CheckoutRedsys.as_view(), name='checkout'),

              ] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT) \
              + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
admin.site.site_header = 'CubaSuper - Panel de control'
admin.site.site_title = "CubaSuper"

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
