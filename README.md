# MovilidadMDQ · Frontend (Angular)

Comparador de precios de viaje en Mar del Plata: el usuario carga origen y destino y ve, en una sola pantalla, el precio y el tiempo estimado de **Taxi, Uber y Didi**, con la ruta en el mapa. Elige una opción y la app abre Uber o Didi con el viaje cargado, o inicia la llamada al taxi. Incluye historial, favoritos, foros de la comunidad y un panel de administración (tarifa del taxi, usuarios y moderación).

Este repositorio es el **frontend**. La API REST (Spring Boot + MySQL) está en el repositorio `movilidad-mdq`.

| | |
|---|---|
| Aplicación en producción | https://movilidadmdq-frontend2.vercel.app |
| API | https://api-movilidad.vendlysoft.com · Swagger en `/swagger-ui/index.html` |
| Manual de usuario | [`docs/MANUAL_USUARIO.md`](docs/MANUAL_USUARIO.md) |
| Diseño de pantallas | [`docs/MovilidadMDQ-pantallas.png`](docs/MovilidadMDQ-pantallas.png) |
| Versión entregada | `v1.0.0` (16/11/2026) |

## Tecnologías

- **Angular 22** con componentes standalone, signals y Signal Forms.
- **@angular/google-maps** para el mapa, el autocompletado de direcciones (Places) y el trazado de la ruta (Directions).
- **RxJS** y `HttpClient` para consumir la API; un **interceptor** agrega el token JWT a cada pedido.
- **Guards** de ruta por rol (cliente, administrador e invitado).
- Despliegue en **Vercel**.

## Cómo correrlo en tu máquina

Requisitos: Node.js 20 o superior y npm.

```bash
git clone https://github.com/anibaldb/movilidadmdq-frontend2.git
cd movilidadmdq-frontend2
npm install
npm start          # ng serve → http://localhost:4200
```

Por defecto el front local usa la API de producción, que ya acepta pedidos desde `localhost:4200`.

Otros comandos:

| Comando | Qué hace |
|---|---|
| `npm run build` | Compila para producción en `dist/` |
| `npm run watch` | Compila en modo desarrollo y recompila al guardar |
| `npm test` | Corre las pruebas unitarias |

## Configuración

La configuración está en `src/environments/`:

| Archivo | Uso |
|---|---|
| `environment.ts` | Producción (lo usa el build de Vercel) |
| `environment.development.ts` | Desarrollo (`ng serve`) |

| Variable | Qué es |
|---|---|
| `apiUrl` | URL base de la API |
| `mapsApiKey` | Clave de Google Maps JavaScript API. Es una clave **de navegador**: queda visible en el front por diseño, y por eso está restringida en Google Cloud a los dominios de la aplicación. No reemplazarla por una clave sin restricciones. |
| `tokenKey` | Nombre con el que se guarda el token de sesión en el navegador |
| `roleAdmin` | Nombre del rol de administrador que devuelve la API |

Las claves privadas (base de datos, JWT, OAuth de Google) viven solo en el `.env` del servidor del backend; nunca en este repositorio.

## Estructura

```
src/app/
├── pages/          una carpeta por pantalla
│   ├── calcular/        búsqueda y comparación (pantalla principal)
│   ├── historial/       viajes calculados: repetir, borrar, favorito
│   ├── favoritos/       direcciones favoritas
│   ├── perfil/          ver y editar datos
│   ├── foros/           lista y creación de foros
│   ├── foro-detalle/    foro con sus comentarios
│   ├── login/           inicio de sesión y retorno de Google (oauth2-redirect)
│   ├── registro/        crear cuenta
│   ├── admin-tarifa/    tarifa del taxi (administrador)
│   └── admin-usuarios/  buscar, ver, eliminar y bloquear usuarios (administrador)
├── components/     piezas reutilizables (header, mapa, tarjetas de opciones, mensajes de error)
├── services/       llamadas a la API y estado de la sesión
├── models/         interfaces TypeScript de los datos de la API
├── guards/         acceso por rol
├── interceptors/   token JWT en cada pedido
└── app.routes.ts   rutas de la aplicación
```

## Rutas y permisos

| Ruta | Pantalla | Quién entra |
|---|---|---|
| `/login`, `/registro` | Inicio de sesión y registro | Solo sin sesión |
| `/calcular` (inicio) | Búsqueda y comparación | Cliente |
| `/historial`, `/favoritos`, `/perfil` | Pantallas del cliente | Cliente |
| `/foros`, `/foros/:id` | Foros de la comunidad | Cualquier usuario logueado |
| `/admin/tarifa`, `/admin/usuarios` | Panel de administración | Administrador |

Cualquier otra ruta redirige a `/calcular`. El administrador entra directo a Tarifa y no puede abrir las pantallas del cliente.

## Despliegue

Vercel publica automáticamente la rama `main`. El archivo `vercel.json` redirige todas las rutas a `index.html` para que funcionen las URLs de Angular al recargar la página.

## Forma de trabajo

- Tablero en Jira (proyecto SCRUM). Cada tarjeta se trabaja en una rama con su clave: `SCRUM-30-tarjetas-comparativas`.
- Los commits llevan la clave de la tarjeta: `SCRUM-30 agrega las tarjetas de opciones`.
- Pull request a `dev`, revisado por otro integrante; `dev` se integra a `main` para desplegar.
- Las decisiones del equipo están en `CLAUDE.md` (guía del equipo).

## Equipo

Aníbal Bustos · Agustín Provenzano · Franco Bavaresco — UTN FRMDP, Tecnicatura Universitaria en Programación, 2026.
