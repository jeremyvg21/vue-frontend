# Cómo funciona el frontend

El panel utiliza un esquema sencillo: cada vista muestra la información que corresponde a su pantalla, mientras Pinia maneja la carga de productos, categorías y datos del dashboard.

## Archivos principales

- `src/views/`: las pantallas del sistema.
- `src/router/index.js`: la navegación.
- `src/stores/inventory.js`: las acciones de consulta y mantenimiento.
- `src/stores/notifications.js`: los avisos que aparecen al usuario.
- `src/services/http.js`: Axios, tiempo de espera y manejo global de errores.
- `vite.config.js`: el proxy de desarrollo que reenvía `/api` a Laravel.

## Ejemplo: editar un producto

1. En el listado presiono **Editar**.
2. Vue Router abre el formulario con el identificador del producto.
3. El formulario obtiene los datos actuales y llena los campos.
4. Al guardar se ejecuta una acción del store, que llama a Laravel por Axios.
5. Si la API responde correctamente, aparece una notificación y se actualizan los datos.
6. Si hay un error `422`, se presenta el mensaje correspondiente.

## Decisiones de interfaz

Utilicé una navegación lateral para separar las pantallas. En el listado añadí búsqueda y filtro para encontrar productos sin recorrer toda la tabla. Los formularios y las confirmaciones de eliminación buscan evitar errores al registrar información.

La interfaz está pensada para escritorio, pero usa clases responsive de Tailwind para adaptarse a anchos menores.

## Límite actual

El proxy de Vite solo sirve durante el desarrollo local. Si se publica el proyecto, hay que configurar la URL real de la API o un proxy equivalente, además de las medidas de seguridad correspondientes.
