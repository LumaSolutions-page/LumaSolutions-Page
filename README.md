# Luma Solutions — sitio web

Sitio de [lumasolutionscr.com](https://lumasolutionscr.com): automatización con IA y páginas web para negocios en Costa Rica.

Es un sitio estático (HTML, CSS y JavaScript sin frameworks ni proceso de compilación), publicado con **GitHub Pages** desde la rama `main`. El dominio se configura en `CNAME`.

## Estructura

```
index.html          Contenido de la página (secciones, textos, planes, FAQ)
404.html            Página de error
css/styles.css      Todo el diseño (colores y tipografía en :root, al inicio)
js/main.js          Interacciones y CONFIGURACIÓN (contactos, precios)
assets/             Favicon, ícono de Apple e imagen para compartir en redes
robots.txt, sitemap.xml
```

## Configuración rápida (`js/main.js`)

Al inicio del archivo está el objeto `LUMA_CONFIG`:

| Campo | Qué hace |
|---|---|
| `whatsapp` | Número con código de país, solo dígitos (ej. `50688887777`). Al completarlo aparecen el botón flotante de WhatsApp y los enlaces en Contacto y el pie de página. |
| `email` | Correo de contacto. Aparece en Contacto y en el pie de página. |
| `instagram` | URL completa del perfil. |
| `showPrices` | `true` muestra los precios a todos. Con `false` los clientes ven "Cotización a medida". |

Mientras un dato esté vacío, su botón o enlace permanece oculto.

### Vista previa de precios

Abrí `https://lumasolutionscr.com/?precios=1` para ver los planes con precios, con un aviso de "vista previa interna". Los precios están en `index.html`, en la sección `PLANES` (`<span class="price-real">`). Los precios de páginas web son **de ejemplo** y deben definirse.

> Nota: aunque estén ocultos, los precios forman parte del código fuente de la página, así que alguien que lo revise podría verlos.

## Formulario

Envía los datos a Formspree (`https://formspree.io/f/xnjwblor`) sin salir de la página e incluye protección antispam (`_gotcha`). Los campos que llegan son: nombre, email, teléfono, empresa, interés, plan y mensaje.

## Probar localmente

```bash
python3 -m http.server 8000
# abrir http://localhost:8000
```
