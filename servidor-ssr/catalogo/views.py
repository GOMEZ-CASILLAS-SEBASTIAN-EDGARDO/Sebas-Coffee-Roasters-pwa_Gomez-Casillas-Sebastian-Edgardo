from django.shortcuts import render

# "Base de datos" falsa: una lista de diccionarios en memoria.
# En un proyecto real esto vendría de un modelo (models.py) y una tabla,
# pero para ENTENDER qué es SSR no necesitamos base de datos: lo importante
# es que estos datos se insertan en el HTML *antes* de enviarlo al navegador.
PRODUCTOS = [
    {"id":1,"nombre":"Espresso","categoria":"Café caliente","precio":40,"stock":20,"imagen":"img/espresso.jpg"},
  {"id":2,"nombre":"Americano","categoria":"Café caliente","precio":45,"stock":20,"imagen":"img/americano.jpg"},
  {"id":3,"nombre":"Capuchino","categoria":"Café caliente","precio":60,"stock":20,"imagen":"img/capuchino.jpg"},
  {"id":4,"nombre":"Latte","categoria":"Café caliente","precio":62,"stock":20,"imagen":"img/latte.jpg"},
  {"id":5,"nombre":"V60 de origen","categoria":"Café caliente","precio":75,"stock":20,"imagen":"img/v60-de-origen.jpg"},
  {"id":6,"nombre":"Cold brew","categoria":"Bebidas frías","precio":65,"stock":20,"imagen":"img/cold-brew.jpg"},
  {"id":7,"nombre":"Iced latte","categoria":"Bebidas frías","precio":68,"stock":20,"imagen":"img/iced-latte.jpg"},
  {"id":8,"nombre":"Frappé moka","categoria":"Bebidas frías","precio":80,"stock":20,"imagen":"img/frappe-moka.jpg"},
  {"id":9,"nombre":"Affogato","categoria":"Bebidas frías","precio":75,"stock":20,"imagen":"img/affogato.jpg"},
  {"id":10,"nombre":"Chai latte helado","categoria":"Bebidas frías","precio":70,"stock":20,"imagen":"img/chai-latte-helado.jpg"},
  {"id":11,"nombre":"Croissant","categoria":"Para acompañar","precio":45,"stock":20,"imagen":"img/croissant.jpg"},
  {"id":12,"nombre":"Panini de jamón y queso","categoria":"Para acompañar","precio":95,"stock":20,"imagen":"img/panini-de-jamon-y-queso.jpg"},
  {"id":13,"nombre":"Cheesecake","categoria":"Para acompañar","precio":70,"stock":20,"imagen":"img/cheesecake.jpg"},
  {"id":14,"nombre":"Galleta de avena","categoria":"Para acompañar","precio":30,"stock":20,"imagen":"img/galleta-de-avena.jpg"},
  {"id":15,"nombre":"Rol de canela","categoria":"Para acompañar","precio":55,"stock":20,"imagen":"img/rol-de-canela.jpg"}
]


def vista_ssr(request):
    """
    Vista con Renderizado en Servidor (SSR).

    request: el objeto que representa la petición que hizo el navegador.

    render() hace tres cosas:
      1) toma la plantilla 'catalogo/catalogo_ssr.html'
      2) le inyecta el diccionario de "contexto" (aquí: la lista de productos)
      3) devuelve el HTML final, YA CON LOS DATOS DENTRO, listo para el navegador.

    Por eso es "servidor": el HTML que llega al navegador ya trae escritos
    los nombres y precios. Si haces clic derecho > "Ver código fuente de la
    página" verás los productos en el HTML, aunque JavaScript esté desactivado.
    Compáralo con la vista CSR de la Parte B, donde el HTML llega vacío y es
    JavaScript quien dibuja los productos DESPUÉS, ya en el navegador.
    """
    contexto = {"productos": PRODUCTOS}
    return render(request, 'catalogo/catalogo_ssr.html', contexto)