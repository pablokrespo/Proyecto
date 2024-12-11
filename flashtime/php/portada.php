<?php

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (isset($_POST['form'])) {
        $server_bd = "localhost";
        $usuario_bd = "root";
        $contrasena_bd = "";
        $bdUsuarios_bd = "perfiles";

        function comprobarDatosLogin() {
			try {
				if (empty($_POST['usuario'])) { throw new RuntimeException('Falta el nombre de usuario'); }
				if (empty($_POST['contrasena1'])) { throw new RuntimeException('Falta la contraseña'); }
			}
			catch (RuntimeException $e) { echo $e->getMessage(); exit; }
        }

        function comprobarDatosRegister() {
			try {
				if (empty($_POST['nombre'])) { throw new RuntimeException('Falta el nombre'); }
				if (empty($_POST['apellido'])) { throw new RuntimeException('Falta el apellido'); }
				if (empty($_POST['usuario'])) { throw new RuntimeException('Falta el nombre de usuario'); }
				if (empty($_POST['contrasena1'])) { throw new RuntimeException('Falta la contraseña'); }
				if (empty($_POST['contrasena2'])) { throw new RuntimeException('Falta repetir contraseña'); }
			}
			catch (RuntimeException $e) { echo $e->getMessage(); exit; }
		}
		
		function comprobarFormatoLogin() {
			try {
				$format1 = '/^[a-zA-ZáéíóúñÑ\s]{0,}$/';
				$format2 = '/^[a-zA-ZáéíóúñÑ0-9]{0,}$/';        
				if (!preg_match($format2,$_POST['usuario'])) { throw new RuntimeException('Solo se permite: mayúsculas, minúsculas, tildes, y números. Sin espacios'); }
				if (!preg_match($format2,$_POST['contrasena1'])) { throw new RuntimeException('Solo se permite: mayúsculas, minúsculas, tildes, y números. Sin espacios'); }
			}
			catch (RuntimeException $e) { echo $e->getMessage(); exit; }
		}

        function comprobarFormatoRegister() {
			try {
				$format1 = '/^[a-zA-ZáéíóúñÑ\s]{0,}$/';
				$format2 = '/^[a-zA-ZáéíóúñÑ0-9]{0,}$/';        
				if (!preg_match($format1,$_POST['nombre'])) { throw new RuntimeException('Solo se permite: mayúsculas, minúsculas, y tildes'); }
				if (!preg_match($format1,$_POST['apellido'])) { throw new RuntimeException('Solo se permite: mayúsculas, minúsculas, y tildes'); }
				if (!preg_match($format2,$_POST['usuario'])) { throw new RuntimeException('Solo se permite: mayúsculas, minúsculas, tildes, y números. Sin espacios'); }
				if (!preg_match($format2,$_POST['contrasena1'])) { throw new RuntimeException('Solo se permite: mayúsculas, minúsculas, tildes, y números. Sin espacios'); }
				if (!preg_match($format2,$_POST['contrasena2'])) { throw new RuntimeException('Solo se permite: mayúsculas, minúsculas, tildes, y números. Sin espacios'); }
			}
			catch (RuntimeException $e) { echo $e->getMessage(); exit; }
		}
		
		function crearURL() {
			$url="http://flashtime.me/".rawurldecode($_POST['usuario']);
			return $url;	
		}

        if ($_POST['form'] == 'login') {
            comprobarDatosLogin();
            comprobarFormatoLogin();

            $usuario = $_POST['usuario'];
            $contrasena = $_POST['contrasena1'];
            
            // Conexión a la base de datos
            $loging_bd = mysqli_connect($server_bd, $usuario_bd, $contrasena_bd, $bdUsuarios_bd);
            if (!$loging_bd) {
                echo('Error número ' . mysqli_connect_errno() . ' al establecer conexión: ' . mysqli_connect_error());
                exit;
            }

            $usuario = mysqli_real_escape_string($loging_bd, $usuario);
            $contrasena = md5($contrasena);
            $consulta = "SELECT nombre_usuario FROM usuarios WHERE nombre_usuario = '$usuario' AND contrasena_usuario = '$contrasena'";
            $datosUsuario = mysqli_query($loging_bd, $consulta);

            if (!$datosUsuario) {
                echo "Error en la consulta: " . mysqli_error($loging_bd);
                exit;
            }

            $numeroUsuario = mysqli_num_rows($datosUsuario);
            if ($numeroUsuario == 1) {
                session_start();
                $arrayUsuario = mysqli_fetch_assoc($datosUsuario);
                $_SESSION["sesionUsuario"] = $_POST["usuario"];
                echo $_SESSION["sesionUsuario"];
                header("Location: /miproyecto/flashtime/php/menuUsuario.php");
                exit;
            } else {
                header("Location: /miproyecto/flashtime/html/portada.html?error='Datos de Inicio de Sesión incorrectos'");
                exit;
            }
            mysqli_close($loging_bd);

        } elseif ($_POST['form'] == 'register') {
            comprobarDatosRegister();
            comprobarFormatoRegister();

            if ($_POST['contrasena1'] == $_POST['contrasena2']) {
                $password = md5($_POST['contrasena1']);

                // Conexión a la base de datos
                $loging_bd = mysqli_connect($server_bd, $usuario_bd, $contrasena_bd, $bdUsuarios_bd);
                if (!$loging_bd) {
                    echo('Error número ' . mysqli_connect_errno() . ' al establecer conexión: ' . mysqli_connect_error());
                    exit;
                }

                $usuario = mysqli_real_escape_string($loging_bd, $_POST['usuario']);
                $consulta = "SELECT nombre_usuario FROM usuarios WHERE nombre_usuario = '$usuario'";
                $datosUsuario = mysqli_query($loging_bd, $consulta);

                if (!$datosUsuario) {
                    echo "Error en la consulta: " . mysqli_error($loging_bd);
                    exit;
                }

                $numeroUsuario = mysqli_num_rows($datosUsuario);
                if ($numeroUsuario == 0) {
                    $insert = "INSERT INTO usuarios (nombre, apellido, nombre_usuario, contrasena_usuario) VALUES ('" . $_POST["nombre"] . "','" . $_POST["apellido"] . "','" . $_POST["usuario"] . "','" . $password . "')";
                    if (mysqli_query($loging_bd, $insert)) {
                        session_start();
                        $_SESSION["sesionUsuario"] = $_POST["usuario"];
                        header("Location: /miproyecto/flashtime/php/menuUsuario.php");
                        exit;
                    } else {
                        echo "Fallo de insercción: " . mysqli_error($loging_bd);
                        exit;
                    }
                } else {
                    header("Location: /miproyecto/flashtime/html/portada.html?error='Estos datos ya existen'");
                    exit;
                }
                mysqli_close($loging_bd);
            } else {
                header("Location: /miproyecto/flashtime/html/portada.html?error='Las contraseñas deben coincidir'");
                exit;
            }
        }

    } else {
        echo "No se ha enviado ningún formulario";
    }
}

?>