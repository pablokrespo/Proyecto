// Obtener elementos del DOM
const tituloPrincipal = document.getElementById('titulo-producto');
const portada = document.getElementById('portada');
const tituloSecundario = document.getElementById('titulo-secundario');
const generosLista = document.getElementById('generos-lista');
const fechaEstreno = document.getElementById('fecha');
const descripcion = document.getElementById('descripcion');
const personas = document.getElementById('personas');
const valoracionesLista = document.getElementById('valoraciones-lista');

// Recuperar ID del producto de la URL
const params = new URLSearchParams(window.location.search);
const productoId = params.get('id');
const tipo = params.get('tipo'); // "movie" o "tv"

// Credenciales de la API
const API_KEY = "dc2228b974bcde15fd42bab26fa6d6dd";
const BASE_URL = "https://api.themoviedb.org/3";

// Función para cargar los detalles del producto
async function cargarDetalles() {
    const endpoint = tipo === "movie" ? `/movie/${productoId}` : `/tv/${productoId}`;
    const response = await fetch(`${BASE_URL}${endpoint}?api_key=${API_KEY}&language=es-ES`);
    const data = await response.json();

    // Asignar datos al DOM
    tituloPrincipal.textContent = data.title || data.name;
    tituloSecundario.textContent = data.title || data.name;
    portada.src = `https://image.tmdb.org/t/p/w500${data.poster_path}`;
    generosLista.textContent = data.genres.map(genre => genre.name).join(", ");
    fechaEstreno.textContent = new Date(data.release_date || data.first_air_date).toLocaleDateString('es-ES', {
        day: 'numeric', month: 'long', year: 'numeric'
    });
    descripcion.textContent = data.overview;

    // Cargar personas involucradas
    cargarCreditos();
}

// Función para cargar créditos
async function cargarCreditos() {
    const endpoint = tipo === "movie" ? `/movie/${productoId}/credits` : `/tv/${productoId}/credits`;
    const response = await fetch(`${BASE_URL}${endpoint}?api_key=${API_KEY}&language=es-ES`);
    const data = await response.json();

    personas.innerHTML = data.crew.slice(0, 5).map(persona => `
        <li>${persona.job}: ${persona.name}</li>
    `).join("");

    valoracionesLista.innerHTML = data.cast.slice(0, 5).map(actor => `
        <li>${actor.character}: ${actor.name}</li>
    `).join("");
}

// Volver al menú
document.getElementById('volver').addEventListener('click', () => {
    window.location.href = '/miproyecto/flashtime/html/menuInvitado.html';
});

// Inicializar
cargarDetalles();
