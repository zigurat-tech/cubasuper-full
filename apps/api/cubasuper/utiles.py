import pytz
from googletrans import Translator

from cubasuper import settings


def traducir_por_defecto(texto, idioma):
    translator = Translator()
    return str(translator.translate(text=texto, dest=idioma).text).capitalize()

def getTimezone():
    return pytz.timezone(settings.TIME_ZONE)