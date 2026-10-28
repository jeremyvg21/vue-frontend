# Panel de inventario — Vue 3

Frontend de una aplicación de inventario. El panel permite gestionar productos y categorías, consultar el stock y revisar los últimos movimientos. Los datos se obtienen de una API REST desarrollada con Laravel.

La interfaz está organizada para que las tareas habituales sean rápidas: revisar el resumen, buscar un producto, editar sus datos o administrar categorías desde el menú lateral.

## Funciones

- **Dashboard:** productos, categorías, unidades disponibles, valor estimado del inventario y actividad reciente.
- **Productos:** listado con búsqueda por nombre o descripción, filtro por categoría y opciones para editar y eliminar.
- **Formulario de producto:** creación y edición con validaciones antes de enviar los datos.
- **Categorías:** consulta, creación, edición y eliminación.
- **Notificaciones:** mensajes de éxito o error y confirmación antes de eliminar.
- **Inventario:** indicadores visuales para identificar el stock bajo y los productos sin unidades.

## Tecnologías

- Vue 3 con Composition API (`<script setup>`).
- Vite 7.
- Pinia para el estado compartido y las operaciones con la API.
- Vue Router para navegar entre las vistas.
- Axios con interceptor de errores HTTP y de conexión.
- Tailwind CSS 4, junto con clases propias para ajustar el diseño.

## Requisitos

- Node.js compatible con Vite 7 (Node **20.19+** o **22.12+**).
- npm.
- Backend Laravel iniciado en `http://127.0.0.1:8000` y conectado a MySQL.

No se utilizó Docker.

## Instalación y ejecución

```powershell
cd vue-frontend
npm.cmd install
npm.cmd run dev
```

En Windows con PowerShell se puede usar `npm.cmd` si la política de ejecución bloquea `npm.ps1`. El servidor de desarrollo queda disponible en **http://127.0.0.1:5173**.

En una terminal distinta, el backend debe estar ejecutándose:

```powershell
php artisan serve --host=127.0.0.1 --port=8000
```

Para compilar:

```powershell
npm.cmd run build
```

El comando crea `dist/`; no despliega la página en internet. **Última compilación comprobada el 28/10/2026:** correcta, 100 módulos transformados.

## Vistas

| Ruta | Sección |
| --- | --- |
| `/` | Dashboard y movimientos recientes |
| `/products` | Listado y búsqueda de productos |
| `/products/new` | Formulario para crear producto |
| `/products/:id/edit` | Formulario para editar producto |
| `/categories` | Administración de categorías |

## Conexión con Laravel

Las vistas utilizan el store de Pinia (`src/stores/inventory.js`), que llama al cliente Axios (`src/services/http.js`). Axios utiliza la URL base `/api`; Vite redirige las peticiones hacia Laravel durante el desarrollo.

```text
Vista Vue → Pinia → Axios → /api → Proxy Vite → Laravel → MySQL
```

El interceptor centraliza los errores de red y respuestas `4xx`/`5xx`, mientras que las vistas muestran estados de carga, confirmaciones y mensajes de resultado. Las validaciones del navegador mejoran la experiencia, pero Laravel vuelve a validar los datos antes de guardarlos.

## Archivos principales

```text
src/
  App.vue                       Menú, encabezado y distribución
  main.js                       Inicio de la aplicación
  router/index.js               Navegación
  stores/inventory.js           Estado de productos, categorías y resumen
  stores/notifications.js       Alertas visuales
  services/http.js              Axios e interceptor
  components/ConfirmDialog.vue  Confirmación de eliminación
  components/ToastStack.vue     Notificaciones
  views/DashboardView.vue       Indicadores y movimientos
  views/ProductsView.vue        Listado, búsqueda y filtros
  views/ProductFormView.vue     Alta y edición de productos
  views/CategoriesView.vue      Gestión de categorías
  style.css                     Tailwind y estilos propios
vite.config.js                  Vite y proxy local
```

## Comprobaciones manuales

1. Abrir el dashboard y revisar las cifras.
2. Crear una categoría y un producto asociado.
3. Buscar el producto y filtrar por categoría.
4. Editar el precio y la cantidad, y comprobar los cambios.
5. Intentar guardar un precio negativo: debe mostrarse un error.
6. Intentar eliminar una categoría que tenga productos: debe bloquearse.
7. Eliminar el producto mediante la confirmación y volver a eliminar la categoría.
8. Revisar la actividad reciente y comprobar que use los nombres de los registros.

Estas operaciones se probaron manualmente durante el desarrollo. El backend dispone además de 10 pruebas automatizadas aprobadas (41 aserciones) en el último resultado compartido.

## Solución de problemas

- **No aparecen los datos:** comprobar que Laravel esté iniciado en el puerto `8000`.
- **Error de red:** revisar la consola del navegador y el proxy de `vite.config.js`.
- **HTTP `422`:** verificar los datos del formulario y el mensaje específico del servidor.
- **Pantalla en blanco:** revisar `F12 → Console`.
- **Error al ejecutar npm en PowerShell:** utilizar `npm.cmd`.

## Alcance

Se diseñó para una demostración local, sin autenticación de usuarios. Para un despliegue público sería necesario configurar el backend con seguridad, gestionar las variables de entorno y preparar un servidor de producción. El código de Laravel se encuentra en [laravel-api](https://github.com/jeremyvg21/laravel-api).
