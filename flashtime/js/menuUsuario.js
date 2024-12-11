const peliculasBtn = document.getElementById("peliculas");
const seriesBtn = document.getElementById("series");
const estrenosBtn = document.getElementById("estrenos");
const filtrosBtn = document.getElementById("filtros");
const busquedaInput = document.getElementById("busqueda");
const busquedaBtn = document.getElementById("busqueda");
const perfilBtn = document.getElementById("perfil");
const catalogo = document.querySelector(".catalogo");

// Función para mostrar el catálogo según el tipo de contenido (pelicula o serie)
function mostrarCatalogo(tipo) {
  var config = {
    apiKey: "dc2228b974bcde15fd42bab26fa6d6dd",
    authDomain: "",
    databaseURL: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: ""
  };
  catalogo.innerHTML = `Mostrando catálogo de ${tipo}`;
}

// Eventos para los botones
peliculasBtn.addEventListener("click", () => mostrarCatalogo("peliculas"));
seriesBtn.addEventListener("click", () => mostrarCatalogo("series"));
estrenosBtn.addEventListener("click", () => mostrarCatalogo("estrenos"));

// Función para mostrar los filtros
function mostrarFiltros() {
  // Aquí se mostraría un los filtros disponibles
  alert("Mostrando filtros");
}

filtrosBtn.addEventListener("click", mostrarFiltros);

// Función para buscar en el catálogo
function buscarEnCatalogo() {
  const textoBusqueda = busquedaInput.value;
  // Aquí llamar a la API para buscar en el catálogo el texto introducido
  catalogo.innerHTML = `Mostrando resultados para "${textoBusqueda}"`;
}

busquedaBtn.addEventListener("click", buscarEnCatalogo);

perfilBtn.addEventListener('click', () => {
    window.location.href = "cerrarsesion.php";
});

// Función para obtener la fecha actual
function obtenerFechaActual() {
  const hoy = new Date();
  const dd = String(hoy.getDate()).padStart(2, "0");
  const mm = String(hoy.getMonth() + 1).padStart(2, "0"); // Los meses empiezan en 0
  const yyyy = hoy.getFullYear();
  return `${yyyy}-${mm}-${dd}`;
}

// Función para mostrar los próximos estrenos
function mostrarProximosEstrenos() {
  const fechaActual = obtenerFechaActual();
  // Aquí llamar a la API para obtener los próximos estrenos a partir de la fecha actual
  catalogo.innerHTML = `Mostrando próximos estrenos a partir de ${fechaActual}`;
}

estrenosBtn.addEventListener("click", mostrarProximosEstrenos);

// Función para mostrar el catálogo por defecto
mostrarCatalogo("peliculas");