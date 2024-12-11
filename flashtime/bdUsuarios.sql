-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 15-03-2024 a las 20:30:45
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

CREATE TABLE `lista_favoritos` (
  `ID_usuario` int(10) NOT NULL,
  `nombre_usuario` varchar(100) NOT NULL,
  `ID_producto` int(10) NOT NULL,
  `ID_pelicula` int(10) NOT NULL,
  `ID_serie` int(10) NOT NULL,
  `titulo_pelicula` varchar(100) NOT NULL,
  `titulo_serie` varchar(100) NOT NULL,
  `ano_pelicula` varchar(50) NOT NULL,
  `ano_serie` varchar(50) NOT NULL,
  `fecha_mod` date NOT NULL,
  `observaciones` varchar(1000) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

CREATE TABLE `lista_peliculas` (
  `ID_usuario` int(10) NOT NULL,
  `nombre_usuario` varchar(100) NOT NULL,
  `ID_pelicula` int(10) NOT NULL,
  `titulo_pelicula` varchar(100) NOT NULL,
  `ano_pelicula` varchar(50) NOT NULL,
  `fecha_mod` date NOT NULL,
  `observaciones` varchar(1000) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

CREATE TABLE `lista_series` (
  `ID_usuario` int(10) NOT NULL,
  `nombre_usuario` varchar(100) NOT NULL,
  `ID_serie` int(10) NOT NULL,
  `titulo_serie` varchar(100) NOT NULL,
  `ano_serie` varchar(50) NOT NULL,
  `temporadas_serie` varchar(50) NOT NULL,
  `episodios_serie` varchar(50) NOT NULL,
  `episodio_actual_serie` varchar(50) NOT NULL,
  `fecha_mod` date NOT NULL,
  `observaciones` varchar(1000) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

CREATE TABLE `usuarios` (
  `ID_usuario` int(10) NOT NULL,
  `nombre` text NOT NULL,
  `apellido` text NOT NULL,
  `nombre_usuario` varchar(100) NOT NULL,
  `contrasena_usuario` varchar(100) NOT NULL,
  `fecha_registro` date NOT NULL,
  `fecha_login` date NOT NULL,
  `usuario_mod` varchar(100) NOT NULL,
  `fecha_mod` date NOT NULL,
  `observaciones` varchar(1000) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

INSERT INTO `usuarios` (`ID_usuario`, `nombre`, `apellido`, `nombre_usuario`, `contrasena_usuario`, `fecha_registro`, `fecha_login`, `usuario_mod`, `fecha_mod`, `observaciones`) VALUES
(1, 'Pablo', 'Crespo', 'pablokrespo', '827ccb0eea8a706c4c34a16891f84e7b', '0000-00-00', '0000-00-00', '', '0000-00-00', '');

ALTER TABLE `lista_favoritos`
  ADD PRIMARY KEY (`ID_producto`);

ALTER TABLE `lista_peliculas`
  ADD PRIMARY KEY (`ID_pelicula`);

ALTER TABLE `lista_series`
  ADD PRIMARY KEY (`ID_serie`);

ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`ID_usuario`);

ALTER TABLE `usuarios`
  MODIFY `ID_usuario` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT = 4;
COMMIT;