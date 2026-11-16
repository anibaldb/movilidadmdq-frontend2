# MovilidadMDQ — Frontend

Aplicación web para comparar el precio y el tiempo de un viaje en Mar del Plata
entre Taxi, Uber y Didi. Trabajo final de Programación 4 (UTN).

**App publicada:** https://movilidadmdq-frontend2.vercel.app

## Qué se puede hacer
- Registrarse o entrar con usuario y contraseña, o con Google.
- Calcular un viaje: origen y destino con sugerencias de Google, ubicación actual,
  mapa con la ruta y precios de Taxi, Uber y Didi.
- Ver el historial de viajes, repetir uno y marcar favoritos.
- Guardar direcciones favoritas con nombre ("Casa", "Trabajo") y usarlas al calcular.
- Participar en foros: crear hasta 5 propios y comentar.
- Administrador: configurar la tarifa de taxi, buscar, bloquear o eliminar usuarios
  y moderar los foros.

## Tecnologías
Angular 22 (componentes standalone, signals, Signal Forms, httpResource),
Google Maps (Places, Directions, Geocoding) y Vercel.
El backend es una API en Spring Boot, en un repositorio aparte.

## Cómo correrlo en local
Requiere Node.js.

    npm install
    npm start

Se abre en http://localhost:4200. La dirección del backend está en
`src/environments/`.

## Estructura
    src/app/
      pages/         una carpeta por pantalla
      components/    piezas reutilizables (mapa, tarjetas, header, pestañas)
      services/      llamadas al backend y sesión
      models/        tipos de datos que devuelve el backend
      guards/        qué pantallas puede ver cada usuario
      interceptors/  agrega el token a los pedidos

## Integrantes
- Agustín ...
- Anibal Bustos
- Franco Bavaresco