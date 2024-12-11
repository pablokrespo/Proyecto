// Referencias a los elementos del DOM
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

// Variables globales
let currentPage = 1; // Página actual para la paginación
let currentType = "peliculas"; // Tipo actual del catálogo (películas, series, estrenos o búsqueda)
let currentQuery = ""; // Palabra clave para búsquedas
let catalogData = []; // Array para almacenar los datos del catálogo
let isLoading = false; // Estado de carga para evitar múltiples solicitudes

// Spinner de carga
function mostrarSpinner() {
    const spinnerHTML = `<div class="spinner">Cargando...</div>`;
    if (!document.querySelector(".spinner")) {
        catalogo.insertAdjacentHTML("beforeend", spinnerHTML);
    }
}

function ocultarSpinner() {
    const spinner = document.querySelector(".spinner");
    if (spinner) spinner.remove();
}

// Función para realizar solicitudes a la API con reintentos
async function fetchFromAPI(endpoint, retries = 3) {
    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, { headers });
        if (!response.ok) throw new Error(`Error al obtener datos: ${response.status}`);
        return await response.json();
    } catch (error) {
        if (retries > 0) {
            console.warn(`Reintentando... (${retries} intentos restantes)`);
            return fetchFromAPI(endpoint, retries - 1);
        } else {
            console.error(error);
            catalogo.innerHTML = `<p>Error al cargar los datos. Inténtalo más tarde.</p>`;
        }
    }
}

// Función para formatear fechas
function formatearFecha(fecha) {
    const meses = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];
    const date = new Date(fecha);
    if (isNaN(date)) return "Fecha no disponible";
    const dia = String(date.getDate()).padStart(2, '0');
    const mes = meses[date.getMonth()];
    const ano = date.getFullYear();
    return `${dia} de ${mes} de ${ano}`;
}

// Función para filtrar contenido relevante (fechas válidas)
function filtrarPorFecha(items, tipo) {
    const hoy = new Date();
    return items.filter(item => {
        const fecha = new Date(item.release_date || item.first_air_date || "1900-01-01");
        if (tipo === "estrenos") {
            return fecha >= hoy; // Estrenos solo en el futuro
        } else {
            return fecha <= hoy; // Películas y series solo hasta hoy
        }
    });
}

// Función para ordenar por fecha
function ordenarPorFecha(items, ascendente = false) {
    return items.sort((a, b) => {
        const dateA = new Date(a.release_date || a.first_air_date || "1900-01-01");
        const dateB = new Date(b.release_date || b.first_air_date || "1900-01-01");
        return ascendente ? dateA - dateB : dateB - dateA;
    });
}

async function cargarCatalogo(tipo, query = "") {
    if (isLoading) return;
    isLoading = true;
    mostrarSpinner();

    let endpoint;
    switch (tipo) {
        case "peliculas":
            endpoint = `/discover/movie?sort_by=release_date.desc&release_date.lte=${new Date().toISOString().split('T')[0]}&page=${currentPage}`;
            break;
        case "series":
            endpoint = `/discover/tv?sort_by=first_air_date.desc&first_air_date.lte=${new Date().toISOString().split('T')[0]}&page=${currentPage}`;
            break;
        case "estrenos":
            const hoy = new Date();
            const fechaHoy = hoy.toISOString().split('T')[0];  // Fecha actual en formato YYYY-MM-DD
            endpoint = `/movie/upcoming?release_date.gte=${fechaHoy}&page=${currentPage}`;
            break;
        case "busqueda":
            if (!query.trim()) {
                catalogo.innerHTML = `<p>Por favor, ingresa un término de búsqueda.</p>`;
                ocultarSpinner();
                isLoading = false;
                return;
            }
            endpoint = `/search/multi?query=${encodeURIComponent(query)}&page=${currentPage}`;
            break;
        default:
            return;
    }

    const data = await fetchFromAPI(endpoint);

    // Debug: Verificar los datos obtenidos
    console.log("Datos obtenidos de la API:", data);

    if (data?.results) {
        let nuevosItems = tipo === "estrenos" ? data.results : filtrarPorFecha(data.results, tipo);

        // Ordenar datos según el tipo
        if (tipo === "estrenos") {
            nuevosItems = ordenarPorFecha(nuevosItems, true); // Estrenos ascendente
        } else {
            nuevosItems = ordenarPorFecha(nuevosItems, false); // Películas/series descendente
        }

        catalogData = [...catalogData, ...nuevosItems]; // Añadir al dataset
        renderizarCatalogo();
    }
    ocultarSpinner();
    isLoading = false;
}

// Función para renderizar el catálogo
function renderizarCatalogo() {
    const nuevosItemsHTML = catalogData
        .slice((currentPage - 1) * 20) // Añadir solo los nuevos elementos
        .map(item => `
            <div class="item" data-id="${item.id}">
                <h2>${item.title || item.name}</h2>
                <p>${formatearFecha(item.release_date || item.first_air_date || "1900-01-01")}</p>
                <img src="https://image.tmdb.org/t/p/w500${item.poster_path}" alt="${item.title || item.name}">
            </div>
        `).join("");

    catalogo.insertAdjacentHTML("beforeend", nuevosItemsHTML);

    // Asignar eventos de clic a los nuevos elementos
    document.querySelectorAll(".item").forEach(itemElement => {
        itemElement.addEventListener("click", () => {
            const itemId = itemElement.dataset.id;
            window.location.href = `/miproyecto/flashtime/html/pantallaCompleta.html?id=${itemId}`;
        });
    });
}

// Función de inicialización
function inicializarPagina() {
    catalogData = [];
    currentPage = 1;
    catalogo.innerHTML = ""; // Limpiar solo al reiniciar
    cargarCatalogo(currentType, currentQuery);
}

// Función para mostrar filtros
function mostrarFiltros() {
    alert("Mostrando filtros (en construcción)");
}

// Asociar eventos a los botones
perfilBtn.addEventListener("click", () => {
    window.location.href = "/miproyecto/flashtime/html/portada.html";
});

peliculasBtn.addEventListener("click", () => {
    currentType = "peliculas";
    inicializarPagina();
});

seriesBtn.addEventListener("click", () => {
    currentType = "series";
    inicializarPagina();
});

estrenosBtn.addEventListener("click", () => {
    currentType = "estrenos";
    inicializarPagina();
});

filtrosBtn.addEventListener("click", (mostrarFiltros) => {
    currentType = "filtros";
    inicializarPagina();
});

buscarBtn.addEventListener("click", () => {
    currentType = "busqueda";
    currentQuery = busquedaInput.value;
    inicializarPagina();
});

// Detectar el scroll en el catálogo
catalogo.addEventListener("scroll", () => {
    if (!isLoading && catalogo.scrollTop + catalogo.clientHeight >= catalogo.scrollHeight - 100) {
        currentPage++;
        cargarCatalogo(currentType, currentQuery);
    }
});

// Inicializar la página
inicializarPagina();