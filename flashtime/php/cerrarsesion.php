<?php
	session_start();
	
	if (isset($_SESSION['sesionUsuario'])) {
		echo "ha cerrado sesion ".$_SESSION['sesionUsuario'];
		session_destroy();
	}

	header("Location: html/portada.html"); 

?> 