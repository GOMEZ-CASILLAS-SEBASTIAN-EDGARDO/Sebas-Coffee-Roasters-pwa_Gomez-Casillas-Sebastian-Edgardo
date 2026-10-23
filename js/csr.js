// csr.js — Renderizado en el Cliente (CSR)
// "CSR" significa que el HTML llega casi vacío y es ESTE archivo JavaScript,
// ya corriendo en el navegador del usuario, quien construye el contenido.

// Variable global para almacenar los productos recibidos del catalogo.json
let productosGlobales = [];
let categoriaActiva = "todas";

// 1) Buscamos el contenedor vacío que dejamos en index.html
const contenedorCatalogo = document.getElementById("catalogo");

// Función para normalizar texto (evita fallos por mayúsculas, acentos o espacios)
function normalizarTexto(texto) {
  if (!texto) return "";
  return texto
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

// Función que dibuja el catálogo en pantalla filtrando por la categoría seleccionada
function renderizarCatalogo() {
  if (!contenedorCatalogo) return;

  contenedorCatalogo.innerHTML = "";
  contenedorCatalogo.removeAttribute("aria-busy");
  contenedorCatalogo.removeAttribute("aria-label");

  if (productosGlobales.length === 0) {
    contenedorCatalogo.innerHTML = "<p>No hay productos disponibles.</p>";
    return;
  }

  // Filtrar productos por categoría
  const filtroNorm = normalizarTexto(categoriaActiva);
  const productosFiltrados = productosGlobales.filter((producto) => {
    if (filtroNorm === "todas") return true;
    
    const catNorm = normalizarTexto(producto.categoria);
    return (
      catNorm === filtroNorm ||
      (filtroNorm.includes("delicias") && catNorm.includes("acompanar")) ||
      (filtroNorm.includes("acompanar") && catNorm.includes("delicias"))
    );
  });

  if (productosFiltrados.length === 0) {
    contenedorCatalogo.innerHTML = "<p>No hay productos en esta categoría.</p>";
    return;
  }

  productosFiltrados.forEach((producto) => {
    // creamos un <div class="producto"> por cada producto, desde JavaScript puro
    const tarjeta = document.createElement("div");
    tarjeta.className = "producto";

    // usamos el propio objeto "producto" para llenar el texto (sin plantillas de servidor)
    tarjeta.innerHTML = `
      <img class="producto__foto" src="${producto.imagen}" alt="${producto.nombre}" loading="lazy">
      <strong>${producto.nombre}</strong>
      <span class="precio">$${producto.precio}</span>
      <p>Stock: ${producto.stock}</p>
      <button type="button" data-id="${producto.id}">Agregar al carrito</button>
    `;

    contenedorCatalogo.appendChild(tarjeta);

    // conectamos el botón recién creado con la función agregarAlCarrito() de carrito.js
    tarjeta.querySelector("button").addEventListener("click", () => {
      if (typeof agregarAlCarrito === "function") {
        agregarAlCarrito(producto);
      }
    });
  });
}

// Inicialización de eventos de los botones de filtro
document.addEventListener("DOMContentLoaded", () => {
  const botonesFiltro = document.querySelectorAll(".btn-filtro");

  botonesFiltro.forEach((boton) => {
    boton.addEventListener("click", (e) => {
      botonesFiltro.forEach((b) => b.classList.remove("active"));

      const btnObjetivo = e.target.closest(".btn-filtro");
      btnObjetivo.classList.add("active");

      categoriaActiva = btnObjetivo.getAttribute("data-categoria") || "todas";
      renderizarCatalogo();
    });
  });
});

// 2) fetch() le pide el archivo catalogo.json al servidor (aquí simula una API real).
//    fetch() devuelve una "promesa": un valor que llegará más adelante, no de inmediato.
fetch("catalogo.json")
  .then((respuesta) => respuesta.json()) // convierte el texto recibido en un array de objetos JS
  .then((productos) => {
    // 3) Ya tenemos los productos: guardamos en variable global y dibujamos
    productosGlobales = productos;
    renderizarCatalogo();
  })
  .catch((error) => {
    // si algo falla (por ejemplo, sin conexión y sin caché), avisamos en pantalla
    contenedorCatalogo.innerHTML = "<p>No se pudo cargar el catálogo. Intenta más tarde.</p>";
    contenedorCatalogo.removeAttribute("aria-busy");
    contenedorCatalogo.removeAttribute("aria-label");
    console.error("Error al cargar catálogo:", error);
  });