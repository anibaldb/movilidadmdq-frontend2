# MovilidadMDQ — frontend2 (Angular)

Guía del equipo para trabajar en este repo. La leen los integrantes y también Claude, si alguno lo usa: así todos seguimos las mismas reglas aunque cada uno codee por su lado.

**Regla de oro:** si tomás una decisión que afecta a los demás (estructura, librerías, nombres, cómo se hace algo), anotala en el **Registro de decisiones** de abajo en el mismo PR.

---

## 1. Qué es el proyecto

Comparador de precios de viaje (Taxi, Uber y Didi) en Mar del Plata. Este repo es el **frontend nuevo en Angular**; el backend es Spring Boot y ya está desplegado.

| Cosa | Valor |
|---|---|
| Backend (API) | `https://api-movilidad.vendlysoft.com` — Swagger en `/swagger-ui/index.html` |
| Front en producción | `https://movilidadmdq-frontend2.vercel.app` (Vercel despliega `main`) |
| Diseño a lograr | `docs/MovilidadMDQ-pantallas.png` (14 pantallas, mobile) |
| Tablero | Jira, proyecto SCRUM |
| Angular | 22, componentes standalone |

El back ya acepta pedidos (CORS) desde `localhost:4200` y desde la URL de Vercel.

## 2. Fechas

| Sprint | Fechas | Objetivo |
|---|---|---|
| Sprint 1 | 27/10 – 01/11 | Base técnica, login y búsqueda |
| Sprint 2 | 02/11 – 06/11 | Pre-entrega (06/11): todo menos RF44–RF47 |
| Sprint 3 | 09/11 – 16/11 | RF44–RF47, despliegue (14/11) y entrega final (16/11) |

Exposición: 17/11.

## 3. Reparto (3 personas)

| Sprint | Persona A (Agustín) | Persona B (Aníbal) | Persona C |
|---|---|---|---|
| 1 | SCRUM-15 Setup, 17 ApiService, 18 Sesión JWT, 19 Guards, 20 Entornos, 21 Iniciar sesión, 23 Crear cuenta | SCRUM-16 Estilo global, 38 Menú, 39 Ruteo, 27 Formulario, 28 Autocompletado y GPS, 33 Mapa | — |
| 2 | SCRUM-30 Tarjetas comparativas, 31 Estados | SCRUM-34 Historial, 35 Marcar favorita, 36 Direcciones favoritas, 25 Perfil, 22 Login con Google | SCRUM-41 Tarifa, 42 Gestión de usuarios |
| 3 | SCRUM-45 a 48 (back de RF44–RF47), 24 Pantalla recuperar contraseña | SCRUM-37 Estadísticas | SCRUM-43 Informe usuarios por mes, 44 Informe transporte más elegido, 49 Auditoría de búsquedas (si llega; está en el backlog) |

Diferidas (no se hacen salvo que sobre tiempo): SCRUM-26, 29, 32, 40.

**Dependencia clave:** la Persona B y la Persona C pueden maquetar sin la API, pero para conectar pantallas necesitan SCRUM-15 (`provideHttpClient`), 17, 18, 19 y 20. Objetivo: base técnica en `dev` el **jueves 29/10**. Mientras tanto se usan los nombres acordados de la sección 6.1.

### 3.1 Tarjetas de la Persona C (panel de administración)

Son las pantallas 11 a 14 del boceto. Todas son **solo ADMIN**: rutas bajo `/admin/...` con `canActivate: [adminGuard]`. Referencia de cómo lo resuelve la app anterior: `AdminDashboard.tsx` y `AuditView.tsx` de frontend1. Los endpoints exactos y los DTOs están en el Swagger.

| Tarjeta | Qué pide | Back | Ruta y carpeta |
|---|---|---|---|
| SCRUM-41 Tarifa (RF19) | Ver y modificar bajada de bandera, ficha (día/noche) y metros por ficha, mostrando los valores actuales | ✅ `GET` y `PUT /admin/tarifas/taxi` | `/admin/tarifa` · `pages/admin-tarifa` |
| SCRUM-42 Gestión de usuarios | Buscar por username o email, ver la info y eliminar | ✅ `GET /usuarios/buscar?query=` y `DELETE /usuarios/{id}` | `/admin/usuarios` · `pages/admin-usuarios` |
| SCRUM-43 Informe usuarios por mes | Gráfico de línea con filtro por año | ❌ Falta `GET /admin/estadisticas/usuarios-por-mes?anio` (y que `Usuario` guarde fecha de alta). Maquetar con datos de prueba | `/admin/informe-usuarios` · `pages/admin-informe-usuarios` |
| SCRUM-44 Informe transporte más elegido | Torta con filtro por fechas | ❌ Falta `GET /admin/estadisticas/transporte-elegido?desde&hasta`. Maquetar con datos de prueba | `/admin/informe-transporte` · `pages/admin-informe-transporte` |
| SCRUM-49 Auditoría de búsquedas | Lista de búsquedas con filtros por usuario, origen, destino, fechas y favorito | ✅ `GET /viajes/admin/auditoria` (paginado: `page`, `size`) | `/admin/auditoria` · `pages/admin-auditoria` |

- **Gráficos (43 y 44):** hace falta una librería de gráficos. La elige la Persona C y la anota en el Registro de decisiones antes de instalarla (que sea simple, por ejemplo Chart.js).
- **Servicios:** uno por dominio en `services/` con `@Service()` (`TarifaService`, `UsuariosService`, `InformesService`, `AuditoriaService`), `httpResource` para leer y `HttpClient` para guardar o borrar (ver sección 6).
- **Ruteo:** cada uno agrega sus rutas en `app.routes.ts` en el PR de su pantalla (cambio chico, ver sección 4).

## 4. Cómo se trabaja con Git

- **Una rama por tarjeta de Jira:** `SCRUM-27-formulario-origen-destino`.
- **Commits con la clave:** `SCRUM-27 valida que origen y destino no estén vacíos`.
- **Rama de integración: `dev`.** Las ramas de tarjeta salen de `dev` y su Pull Request va a `dev`; el otro integrante lo revisa y se hace merge. Después se borra la rama.
- **`main` es producción** (lo publica Vercel): solo recibe `dev`, por PR, al cerrar cada sprint o antes de una entrega.
- **Nadie pushea directo a `dev` ni a `main`.** Única excepción: cambios solo de documentación (este archivo), si el otro está de acuerdo.
- Vercel arma una preview de cada PR, pero ahí el mapa y la API no andan (la clave de Maps y el CORS del back solo aceptan `localhost` y la URL de producción): se prueba en `localhost` antes de pedir revisión.
- **Antes de empezar una tarjeta:** `git checkout dev && git pull` y recién ahí crear la rama.
- **Archivos compartidos** (`app.routes.ts`, `styles.css`): cambios chicos, en el mismo PR de la pantalla que los necesita. Si hay conflicto, lo resuelve el que mergea segundo.
- Fines de línea: los normaliza `.gitattributes` (Windows/Linux no generan cambios falsos).

## 5. Estructura de carpetas

Igual que el modelo de parcial de la cátedra (sin carpeta `core/`):

```
src/
  environments/          URL del back y clave de Maps (nunca hardcodear URLs en el código)
  styles.css             variables de diseño (colores, radios, sombras) y estilos base
  app/
    models/              interfaces TypeScript = DTOs del back
    services/            un servicio por dominio (sesión, viajes, tarifas…)
    interceptors/        interceptor JWT
    guards/              authGuard, adminGuard
    components/          componentes que se usan en 2 o más pantallas (header, mensaje-error…)
    pages/               una carpeta por pantalla del diseño
    app.routes.ts
```

No se mueven ni renombran las carpetas que ya existen (`components/`, `pages/`) para no generar conflictos.

## 6. Cómo se escribe el código

Seguimos el estilo del modelo de parcial de la cátedra. Ejemplo de formulario: `pages/calcular`.

| Tema | Regla | Por qué |
|---|---|---|
| Componentes | Standalone, un componente por carpeta (`.ts`, `.html`, `.css`). Componente aparte **solo si se usa en 2 o más pantallas o tiene lógica compleja** (ej. el mapa); si no, va directo en la página | Menos archivos y sin `input`/`output` que no hacen falta |
| Estado | `signal()` / `computed()` | Más simple que RxJS y es lo que se ve en la materia |
| Inyección | `inject()` en vez de constructor | Más corto y es el estilo actual de Angular |
| Servicios | `@Service()` (de `@angular/core`), uno por dominio, en `services/` | Es como lo hace la cátedra |
| HTTP — leer (GET) | `httpResource` en el servicio; el componente usa `.value()`, `.isLoading()` y `.error()` | No hace falta `subscribe` ni manejar "cargando" a mano |
| HTTP — escribir (POST/PUT/PATCH/DELETE) | `HttpClient` en el servicio; el componente hace `subscribe` y después `reload()` del recurso para refrescar los datos | Las llamadas quedan en los servicios y la pantalla se actualiza sola |
| Formularios | **Signal Forms**: `signal` con los datos + `form()` con las reglas (`required`, `pattern`, `email`…) + `[formField]` en cada input. Errores con `<app-mensaje-error [campo]="miForm.campo()" />`. Botón de enviar `[disabled]` mientras el form sea inválido | Es lo que usa la cátedra y es menos código que Reactive Forms |
| Guards e interceptores | Funcionales (`CanActivateFn`, `HttpInterceptorFn`) | Es la forma actual; las clases están en desuso |
| Nombres | Dominio en español, igual que el back (`viaje`, `tarifa`, `direccionFavorita`) | Que front y back hablen igual |
| Estilos | CSS propio y simple en cada componente. En `styles.css` solo los estilos base, unas pocas variables de color y las clases comunes `.card`, `.btn-primary`, `.input`, `.label` | Las pantallas son simples; no hace falta Tailwind ni un sistema de diseño |
| Responsive | Mobile first: estilos base para celular y `@media (min-width: 768px)` para PC/horizontal. Un solo punto de corte | El boceto es mobile; con dos tamaños se cubre celular y PC |
| Secretos | Nada de claves en el repo salvo la de Maps del front (restringida por dominio) | RNF08 y RNF09 |
### 6.1 Nombres acordados (sesión y rutas)

Acordados el 28/10 para poder trabajar en paralelo antes de que la sesión (SCRUM-18) y los guards (SCRUM-19) estén en `dev`. Mientras no estén, se usan valores de prueba con un `// TODO SCRUM-18` y después se cambia esa línea.

| Qué | Nombre |
|---|---|
| Servicio de sesión | `SesionService` en `services/sesion.service.ts` |
| Usuario logueado | signal `usuario()` → `Usuario \| null` (los campos salen de lo que devuelve `POST /usuarios/login`) |
| ¿Está logueado? | `logueado()` (computed) |
| ¿Es admin? | `esAdmin()` (computed, según el rol) |
| Cerrar sesión | `cerrarSesion()` |
| Guards | `authGuard` y `adminGuard` en `guards/` |
| Rutas de la Persona A | `/login`, `/registro` |
| Rutas de la Persona B | `/calcular`, `/historial`, `/favoritos`, `/perfil`, `/estadisticas` |
| Rutas de la Persona C | `/admin/tarifa`, `/admin/usuarios`, `/admin/informe-usuarios`, `/admin/informe-transporte`, `/admin/auditoria` |

## 7. Diseño

**Dos fuentes, cada una para una cosa:**

| Qué | De dónde sale |
|---|---|
| **Estilo visual** (colores, tipografía, botones, tarjetas, inputs, íconos, modo claro/oscuro) | **frontend1** (la app React en producción). frontend2 tiene que verse como la misma app. |
| **Distribución de cada pantalla** (qué va en cada una y dónde) | **El boceto** `docs/MovilidadMDQ-pantallas.png` |

- Los valores de frontend1 (colores, bordes redondeados, sombras, fuente Inter) se copian a CSS común. Los colores que se repiten en todas las pantallas van como variables en `styles.css` (SCRUM-16); el resto, CSS directo en cada componente.
- Sin modo oscuro por ahora (SCRUM-40 está diferido).
- El maquetado que ya existe en este repo (Calcular, Historial, Favoritos) **no sigue todavía el estilo de frontend1**: se adapta a medida que se trabaja cada tarjeta.
- Ante una duda de estilo, se mira cómo lo resuelve frontend1; ante una duda de distribución, se mira el boceto.

**Resumen del estilo de frontend1:**

- Fondo gris muy claro, tarjetas blancas con bordes redondeados y sombra suave.
- Botones principales negros con texto en MAYÚSCULAS.
- Wordmark: "Movilidad" normal + "**MDQ**" en negrita.
- Header: "Hola, [usuario]" + menú hamburguesa (pantalla 10) con Mi perfil, Mi historial, Mis direcciones favoritas, Mis estadísticas. Admin ve su propio menú ("Menu General").
- Mobile primero.

## 8. Registro de decisiones

| Fecha | Quién | Decisión | Por qué |
|---|---|---|---|
| 27/10 | Equipo | Una rama por tarjeta de Jira y PR obligatorio a `main` | Ramas cortas, pocos conflictos y trazabilidad con Jira (lo pide el dossier) |
| 27/10 | Equipo | Se reutiliza este repo (no se crea uno nuevo) | Vercel, CORS y la clave de Maps ya están configurados para esta URL; el maquetado cuenta como trabajo hecho en el dossier |
| 27/10 | Aníbal | El estilo visual sale de frontend1 y la distribución de pantallas, del boceto | Que la app nueva se vea como la misma app que ya está en producción; el maquetado actual se adapta |
| 27/10 | Aníbal | CSS propio y simple (sin Tailwind ni librería de UI), con pocas variables de color | El diseño es simple a propósito para no complicar el CSS; el modo oscuro está diferido |
| 28/10 | Aníbal | Se sigue el estilo del modelo de parcial de la cátedra: Signal Forms, `httpResource` para GET, `@Service()` y carpetas `models/`, `services/`, `guards/`, `interceptors/` directo en `app/` (reemplaza la propuesta de Reactive Forms y `core/`) | Es lo que la cátedra espera ver y es menos código |
| 28/10 | Aníbal | Componente aparte solo si se usa en 2 o más pantallas o tiene lógica compleja | Se probó con `route-form` y `location-input` y era demasiado para algo de una sola pantalla; se borraron |
| 28/10 | Equipo | Rama `dev` de integración: las tarjetas van por PR a `dev`; `main` solo recibe `dev` al cerrar sprint | `main` es producción en Vercel: ahí solo entra lo ya probado |
| 28/10 | Equipo | Los cambios solo de documentación (`CLAUDE.md`) pueden ir directo a `dev` si el otro está de acuerdo | No hace falta revisión de código para texto |
| 28/10 | Equipo | Se suma la Persona C: toma SCRUM-41 y 42 (eran de la Persona A), 43 y 44 (eran de la Persona B) y 49 | Repartir el panel de administración, que está separado del resto, para llegar a la pre-entrega |
| 28/10 | Equipo | Nombres acordados para la sesión, los guards y las rutas (sección 6.1) | Trabajar en paralelo sin esperar la base técnica y sin servicios duplicados |

## 9. Estado de las tarjetas

Se mira en Jira. Acá solo se anota lo que los demás tienen que saber para seguir (por ejemplo: "AuthService ya está en main, usar `auth.usuario()` para el nombre del header").

| Fecha | Tarjeta | Novedad para el resto |
|---|---|---|
| 28/10 | SCRUM-18/19 | Nombres de la sesión y los guards acordados con Agustín (sección 6.1). Hasta que estén en `dev`, usar valores de prueba con `// TODO SCRUM-18` |
| 28/10 | SCRUM-27 | `components/mensaje-error` disponible para mostrar errores de formulario (cuando se mergee SCRUM-27) |
