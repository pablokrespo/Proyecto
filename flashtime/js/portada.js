const panelLogin = document.querySelector('.panelLogin');
const panelRegistro = document.querySelector('.panelRegistro');
const botonLogin = document.querySelector('.botonLogin');
const botonRegistro = document.querySelector('.botonRegistro');
const botonInvitado = document.getElementById('botonInvitado');

// Mostrar el panel de inicio de sesión por defecto
panelRegistro.classList.add('ocultar', 'escondido');

botonInvitado.addEventListener('click', () => {
    window.location.href = "menuInvitado.html";
});