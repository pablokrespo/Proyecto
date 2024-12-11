// Obtener el parámetro 'id' de la URL
const params = new URLSearchParams(window.location.search);
const itemId = params.get("id");

// Credenciales de la API
const API_KEY = "dc2228b974bcde15fd42bab26fa6d6dd";
const BASE_URL = "https://api.themoviedb.org/3";
const ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkYzIyMjhiOTc0YmNkZTE1ZmQ0MmJhYjI2ZmE2ZDZkZCIsIm5iZiI6MTcwMDY1NDE5My44NjYsInN1YiI6IjY1NWRlYzcxZDM5OWU2MDBhZjhjNmFiNCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.z7ZRfMsujF3ogVl3pG4Ps0EDT4V2NupI6_EBrwlCg00";

const headers = {
    Authorization: `Bearer ${ACCESS_TOKEN}`,
    "Content-Type": "application/json;charset=utf-8"
};

// Referencias a los elementos del DOM
const tituloHeader = document.getElementById("titulo");
const detalleSection = document.getElementById("detalle");
const volverBtn = document.getElementById("volver");

// Función para obtener detalles de la película/serie
async function fetchDetalles() {
    try {
        const response = await fetch(`${BASE_URL}/movie/${itemId}`, { headers });
        if (!response.ok) throw new Error(`Error al obtener detalles: ${response.status}`);
        const data = await response.json();
        mostrarDetalles(data);
    } catch (error) {
        console.error(error);
        detalleSection.innerHTML = "<p>Error al cargar los detalles.</p>";
        tituloHeader.textContent = "Error";
    }
}

// Función para mostrar detalles en la página
function mostrarDetalles(data) {
    tituloHeader.textContent = data.title || data.name;
    detalleSection.innerHTML = `
        <img src="https://image.tmdb.org/t/p/w500${data.poster_path}" alt="${data.title || data.name}">
        <h2>${data.title || data.name}</h2>
        <p>${data.overview}</p>
        <p><strong>Fecha de lanzamiento:</strong> ${data.release_date || data.first_air_date}</p>
        <p><strong>Calificación:</strong> ${data.vote_average}/10</p>
    `;
}

// Evento para regresar a la pantalla anterior
volverBtn.addEventListener("click", () => {
    window.location.href = "/miproyecto/flashtime/html/menuInvitado.html";
});

// Llamar a la función para cargar los detalles
if (itemId) {
    fetchDetalles();
} else {
    tituloHeader.textContent = "ID no válido";
    detalleSection.innerHTML = "<p>ID no válido.</p>";
}

// Función para renderizar el catálogo
function renderizarCatalogo(items) {
    if (items && items.length > 0) {
        catalogo.innerHTML = items
            .map(item => `
                <div class="item" data-id="${item.id}">
                    <h3>${item.title || item.name}</h3>
                    <p>${item.overview}</p>
                    <img src="https://image.tmdb.org/t/p/w500${item.poster_path}" 
                         alt="${item.title || item.name}">
                </div>
            `).join("");

        // Añadir evento de clic al contenedor `.item`
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

