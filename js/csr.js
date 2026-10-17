// csr.js — Renderizado en el Cliente (CSR)
// "CSR" significa que el HTML llega casi vacío y es ESTE archivo JavaScript,
// ya corriendo en el navegador del usuario, quien construye el contenido.

// Variable global para almacenar los productos recibidos del catalogo.json
let productosGlobales = [];

// 1) Buscamos el contenedor vacío que dejamos en index.html
const contenedorCatalogo = document.getElementById("catalogo");

// Función para normalizar texto (elimina diferencias de mayúsculas, acentos y espacios)
function normalizarTexto(texto) {
  if (!texto) return "";
  return texto
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

// Función principal para renderizar los productos
function renderizarProductos(categoriaSeleccionada = "todas") {
  if (!contenedorCatalogo) return;

  contenedorCatalogo.innerHTML = "";
  contenedorCatalogo.removeAttribute("aria-busy");
  contenedorCatalogo.removeAttribute("aria-label");

  if (productosGlobales.length === 0) {
    contenedorCatalogo.innerHTML = "<p class='mensaje'>No hay productos disponibles.</p>";
    return;
  }

  // Obtenemos las categorías únicas en el orden del JSON
  const categorias = [...new Set(productosGlobales.map((p) => p.categoria))];
  const catFiltroNorm = normalizarTexto(categoriaSeleccionada);

  categorias.forEach((categoria) => {
    const catNorm = normalizarTexto(categoria);

    // Muestra la sección si selecciona "Todas" o si la categoría coincide
    const coincide =
      catFiltroNorm === "todas" ||
      catNorm === catFiltroNorm ||
      (catFiltroNorm.includes("delicias") && catNorm.includes("acompanar")) ||
      (catFiltroNorm.includes("acompanar") && catNorm.includes("delicias"));

    if (coincide) {
      const productosDeCategoria = productosGlobales.filter((p) => p.categoria === categoria);

      if (productosDeCategoria.length > 0) {
        // Título de la sección
        const tituloCat = document.createElement("h3");
        tituloCat.className = "categoria-titulo";
        tituloCat.textContent = categoria;
        contenedorCatalogo.appendChild(tituloCat);

        // Insertamos cada tarjeta directamente en el contenedor principal `#catalogo`
        productosDeCategoria.forEach((producto) => {
          const tarjeta = document.createElement("div");
          tarjeta.className = "producto";

          tarjeta.innerHTML = `
            <img class="producto__foto" src="${producto.imagen}" alt="${producto.nombre}" loading="lazy">
            <strong>${producto.nombre}</strong>
            <span class="precio">$${producto.precio}</span>
            <p>Stock: ${producto.stock}</p>
            <button type="button" data-id="${producto.id}">Agregar al carrito</button>
          `;

          // Conexión del botón agregar al carrito
          tarjeta.querySelector("button").addEventListener("click", () => {
            if (typeof agregarAlCarrito === "function") {
              agregarAlCarrito(producto);
            }
          });

          contenedorCatalogo.appendChild(tarjeta);
        });
      }
    }
  });
}

// Escuchamos los clics de los botones de filtro
document.addEventListener("DOMContentLoaded", () => {
  const botonesFiltro = document.querySelectorAll(".btn-filtro");

  botonesFiltro.forEach((boton) => {
    boton.addEventListener("click", (e) => {
      botonesFiltro.forEach((b) => b.classList.remove("active"));

      const btnObjetivo = e.target.closest(".btn-filtro");
      btnObjetivo.classList.add("active");

      const categoria = btnObjetivo.getAttribute("data-categoria");
      renderizarProductos(categoria);
    });
  });

  // 2) fetch() le pide el archivo catalogo.json al servidor
  fetch("catalogo.json")
    .then((respuesta) => respuesta.json())
    .then((productos) => {
      // 3) Guardamos y renderizamos
      productosGlobales = productos;
      renderizarProductos("todas");
    })
    .catch((error) => {
      contenedorCatalogo.innerHTML = "<p>No se pudo cargar el catálogo. Intenta más tarde.</p>";
      contenedorCatalogo.removeAttribute("aria-busy");
      contenedorCatalogo.removeAttribute("aria-label");
      console.error("Error al cargar catálogo:", error);
    });
});