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

## 3. Reparto (Plan B, 2 personas)

| Sprint | Persona A | Persona B (Aníbal) |
|---|---|---|
| 1 | SCRUM-15 Setup, 17 ApiService, 18 Sesión JWT, 19 Guards, 20 Entornos, 21 Iniciar sesión, 23 Crear cuenta | SCRUM-16 Estilo global, 38 Menú, 39 Ruteo, 27 Formulario, 28 Autocompletado y GPS, 33 Mapa |
| 2 | SCRUM-30 Tarjetas comparativas, 31 Estados, 41 Tarifa, 42 Gestión de usuarios | SCRUM-34 Historial, 35 Marcar favorita, 36 Direcciones favoritas, 25 Perfil, 22 Login con Google |
| 3 | SCRUM-45 a 48 (back de RF44–RF47), 24 Pantalla recuperar contraseña | SCRUM-37 Estadísticas, 43 Informe usuarios por mes, 44 Informe transporte más elegido |

Diferidas (no se hacen salvo que sobre tiempo): SCRUM-26, 29, 32, 40.

**Dependencia clave:** la Persona B puede maquetar sin la API, pero para conectar pantallas necesita SCRUM-17, 18 y 20. Objetivo: base técnica en `main` el **jueves 29/10**.

## 4. Cómo se trabaja con Git

- **Una rama por tarjeta de Jira:** `SCRUM-27-formulario-origen-destino`.
- **Commits con la clave:** `SCRUM-27 valida que origen y destino no estén vacíos`.
- **Nadie pushea directo a `main`.** Todo entra por Pull Request; el otro integrante lo mira y se hace merge. Después se borra la rama.
- Vercel arma una preview de cada PR: se prueba ahí antes de mergear.
- **Antes de empezar una tarjeta:** `git checkout main && git pull` y recién ahí crear la rama.
- **Archivos compartidos** (`app.routes.ts`, `styles.css`): cambios chicos, en el mismo PR de la pantalla que los necesita. Si hay conflicto, lo resuelve el que mergea segundo.
- Fines de línea: los normaliza `.gitattributes` (Windows/Linux no generan cambios falsos).

## 5. Estructura de carpetas — PROPUESTA (la confirma SCRUM-15)

```
src/
  environments/          URL del back y clave de Maps (nunca hardcodear URLs en el código)
  styles.css             variables de diseño (colores, radios, sombras) y estilos base
  app/
    core/                lo que se usa en toda la app y existe una sola vez
      models/            interfaces TypeScript = DTOs del back
      services/          ApiService, AuthService, servicios por dominio
      interceptors/      interceptor JWT
      guards/            authGuard, adminGuard
    components/          componentes reutilizables (header, inputs, tarjetas…) — ya existe
    pages/               una carpeta por pantalla del diseño — ya existe
    app.routes.ts
```

No se mueven ni renombran las carpetas que ya existen (`components/`, `pages/`) para no generar conflictos.

## 6. Cómo se escribe el código — PROPUESTA

| Tema | Regla | Por qué |
|---|---|---|
| Componentes | Standalone, un componente por carpeta (`.ts`, `.html`, `.css`) | Es el estándar de Angular moderno y lo que pide Programación IV |
| Estado | `signal()` / `computed()` | Más simple que manejar todo con RxJS y es lo que se ve en la materia |
| Inyección | `inject()` en vez de constructor | Más corto y es el estilo actual de Angular |
| HTTP | Los servicios devuelven `Observable`; el componente se suscribe y guarda el resultado en una signal | Las llamadas HTTP quedan en un solo lugar (servicios) |
| Formularios | Reactive Forms con validaciones | Hay validaciones (RNF06) y se testean mejor |
| Guards e interceptores | Funcionales (`CanActivateFn`, `HttpInterceptorFn`) | Es la forma actual; las clases están en desuso |
| Nombres | Dominio en español, igual que el back (`viaje`, `tarifa`, `direccionFavorita`) | Que front y back hablen igual |
| Estilos | CSS propio y simple en cada componente. En `styles.css` solo los estilos base y unas pocas variables para los colores que se repiten | Las pantallas son simples; no hace falta Tailwind ni un sistema de diseño |
| Secretos | Nada de claves en el repo salvo la de Maps del front (restringida por dominio) | RNF08 y RNF09 |

| Responsive | Mobile first: estilos base para celular y `@media (min-width: 768px)` para PC/horizontal. Un solo punto de corte | El boceto es mobile; con dos tamaños se cubre celular y PC |

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
| | | | |

## 9. Estado de las tarjetas

Se mira en Jira. Acá solo se anota lo que los demás tienen que saber para seguir (por ejemplo: "AuthService ya está en main, usar `auth.usuario()` para el nombre del header").

| Fecha | Tarjeta | Novedad para el resto |
|---|---|---|
| | | |
