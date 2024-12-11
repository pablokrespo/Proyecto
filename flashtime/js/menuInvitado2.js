// Referencias a los botones y elementos del DOM
const peliculasBtn = document.getElementById("peliculas");
const seriesBtn = document.getElementById("series");
const estrenosBtn = document.getElementById("estrenos");
const filtrosBtn = document.getElementById("filtros");
const busquedaInput = document.getElementById("busqueda");
const buscarBtn = document.getElementById("buscarBtn");
const perfilBtn = document.getElementById("perfil");
const catalogo = document.querySelector(".catalogo");

// Credenciales de la API
const API_KEY = "dc2228b974bcde15fd42bab26fa6d6dd";
const BASE_URL = "https://api.themoviedb.org/3";
const ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkYzIyMjhiOTc0YmNkZTE1ZmQ0MmJhYjI2ZmE2ZDZkZCIsIm5iZiI6MTcwMDY1NDE5My44NjYsInN1YiI6IjY1NWRlYzcxZDM5OWU2MDBhZjhjNmFiNCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.z7ZRfMsujF3ogVl3pG4Ps0EDT4V2NupI6_EBrwlCg00";

// Configuración de las cabeceras de la API
const headers = {
    Authorization: `Bearer ${ACCESS_TOKEN}`,
    "Content-Type": "application/json;charset=utf-8"
};

// Función para realizar solicitudes a la API
async function fetchFromAPI(endpoint) {
    try {
        const response = await fetch($`{BASE_URL}${endpoint}, { headers }`);
        if (!response.ok) throw new Error(`Error al obtener datos: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error(error);
        catalogo.innerHTML = `<p>Error al cargar los datos. Inténtalo más tarde.</p>`;
    }
}

function formatearFecha(fecha) {
    const meses = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    // Verificar si la fecha es válida
    const date = new Date(fecha);
    if (isNaN(date)) {
        return "Fecha no disponible";
    }

    const dia = String(date.getDate()).padStart(2, '0'); // Asegurarse de que el día tenga dos dígitos
    const mes = meses[date.getMonth()]; // Obtener el nombre del mes
    const ano = date.getFullYear(); // Obtener el año

    return `${dia} de ${mes} de ${ano}`; // Formato deseado: "01 de Enero de 1900"
}

// Función para mostrar contenido en el catálogo
function renderizarCatalogo(items) {
    if (items && items.length > 0) {
        // Ordenar por fecha de estreno (release_date o first_air_date)
        items.sort((a, b) => {
            const dateA = new Date(a.release_date || a.first_air_date || "1900-01-01");
            const dateB = new Date(b.release_date || b.first_air_date || "1900-01-01");
            return dateB - dateA; // Orden descendente (más reciente primero)
        });

        catalogo.innerHTML = items
            .map(item => `
                <div class="item" data-id="${item.id}">
                    <h2>${item.title || item.name}</h2>
                    <p>${formatearFecha(item.release_date || item.first_air_date || "1900-01-01")}</p>
                    <img src="https://image.tmdb.org/t/p/w500${item.poster_path}" alt="${item.title || item.name}">
                </div>
            `).join("");

        // Asignar evento de clic a las imágenes para redirigir a pantallaCompleta.html
        const itemsElements = document.querySelectorAll(".item");
        itemsElements.forEach(itemElement => {
            itemElement.addEventListener("click", () => {
                const itemId = itemElement.dataset.id;
                window.location.href = `/miproyecto/flashtime/html/pantallaCompleta.html?id=${itemId}`;
            });
        });
    } else {
        catalogo.innerHTML = "<p>No hay resultados disponibles.</p>";
    }
}

// Función para mostrar catálogo por tipo
async function mostrarCatalogo(tipo) {
    let endpoint;
    switch (tipo) {
        case "peliculas":
            endpoint = "/movie/popular";
            break;
        case "series":
            endpoint = "/tv/popular";
            break;
        default:
            return;
    }

    const data = await fetchFromAPI(endpoint);
    renderizarCatalogo(data?.results || []);
}

// Función para buscar en el catálogo
async function buscarEnCatalogo() {
    const query = busquedaInput.value;
    if (!query) return;

    const endpoint = `/search/multi?query=${encodeURIComponent(query)}`;
    const data = await fetchFromAPI(endpoint);
    renderizarCatalogo(data?.results || []);
}

// Función para mostrar próximos estrenos
async function mostrarProximosEstrenos() {
    const endpoint = "/movie/upcoming";
    const data = await fetchFromAPI(endpoint);
    renderizarCatalogo(data?.results || []);
}

// Función para mostrar filtros
function mostrarFiltros() {
    alert("Mostrando filtros (en construcción)");
}

// Evento de perfil (redirección)
perfilBtn.addEventListener("click", () => {
    window.location.href = "/miproyecto/flashtime/html/portada.html";
});

// Asociar eventos a botones
peliculasBtn.addEventListener("click", () => mostrarCatalogo("peliculas"));
seriesBtn.addEventListener("click", () => mostrarCatalogo("series"));
estrenosBtn.addEventListener("click", mostrarProximosEstrenos);
filtrosBtn.addEventListener("click", mostrarFiltros);
buscarBtn.addEventListener("click", buscarEnCatalogo);

// Función de inicialización
function inicializarPagina() {
    console.log("Página inicializada correctamente.");
    peliculasBtn.click();
}

// Llamar a la función de inicialización
inicializarPagina();

// Función para cargar más datos al hacer scroll
let currentPage = 1; // Página inicial
async function cargarMasContenido() {
    if (catalogo.scrollTop + catalogo.clientHeight >= catalogo.scrollHeight) {
        currentPage++; // Incrementar la página
        console.log(`Cargando página ${currentPage}...`);

        const data = await fetchFromAPI(`/movie/popular?page=${currentPage}`);
        if (data && data.results) {
            const currentItems = catalogo.innerHTML; // Obtener el catálogo actual
            const newItems = data.results
                .map(item => `
                    <div class="item" data-id="${item.id}">
                        <h2>${item.title || item.name}</h2>
                        <p>${formatearFecha(item.release_date || item.first_air_date || "1900-01-01")}</p>
                        <img src="https://image.tmdb.org/t/p/w500${item.poster_path}" alt="${item.title || item.name}">
                    </div>
                `).join("");

            catalogo.innerHTML = currentItems + newItems; // Concatenar los nuevos elementos

            // Volver a asignar eventos a los nuevos elementos
            const itemsElements = document.querySelectorAll(".item");
            itemsElements.forEach(itemElement => {
                itemElement.addEventListener("click", () => {
                    const itemId = itemElement.dataset.id;
                    window.location.href = `/miproyecto/flashtime/html/pantallaCompleta.html?id=${itemId}`;
                });
            });
        } else {
            console.log("No hay más datos disponibles.");
        }
    }
    renderizarCatalogo(data?.results || []);
}

// Evento para detectar el scroll en el catálogo
catalogo.addEventListener("scroll", cargarMasContenido);