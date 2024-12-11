<!DOCTYPE html>
<html lang="es">
<head> 
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Flashtime</title>
    <link rel="stylesheet" href="css/menuUsuario.css">
</head>

<body>
    <header>
        <?php
            session_start();
            if(isset($_SESSION['sesionUsuario'])) {
                $nombre = $_SESSION['sesionUsuario'];
            } else {
                $nombre = "Invitado"; // 
            }
        ?>

        <h1>FLASHTIME - <?php echo "$nombre"; ?> </h1>
        
    </header>
    
    <section class="barraAcciones">
        <button class="button" id="peliculas">Películas</button>
        <button class="button" id="series">Series</button>
        <button class="button" id="estrenos">Próximos estrenos</button>
        <button class="button" id="filtros">Filtros</button>
        <input type="text" id="busqueda" placeholder="Buscar...">
        <button class="button" id="busqueda">Buscar</button>
        <button class="button" id="perfil">Cerrar sesión</button>
    </section>
    
    <section class="panelListas">
        <div class="lista1">
            <h2>Lista de películas</h2>
            <ul></ul>
        </div>
        <div class="lista2">
            <h2>Lista de series</h2>
            <ul></ul>
        </div>
        <div class="lista3">
            <h2>Favoritos</h2>
            <ul></ul>
        </div>
    </section>
    
    <section class="catalogo">
    </section>
  
    <script src="js/menuUsuario.js"></script>
</body>

</html>
