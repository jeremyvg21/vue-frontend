# Actividad reciente en el dashboard

La vista `src/views/DashboardView.vue` muestra los últimos seis eventos registrados por Laravel. El frontend no intenta generar estos movimientos localmente: consume `GET /api/dashboard` mediante el servicio Axios y el estado Pinia.

Los eventos tienen `action` (`created`, `updated`, `deleted`), `entity_type` (`Product`, `Category`), `entity_name` y la fecha. La vista los traduce a mensajes legibles, por ejemplo:

- `Se creó el producto «Laptop HP»`.
- `Se actualizó el producto «Teclado compacto Pro»`.
- `Se eliminó la categoría «exteriores»`.

Los iconos distinguen creaciones, ediciones y eliminaciones; la fecha se presenta con formato local `es-PE`. Si el backend no puede recuperar el nombre, aparece el identificador como respaldo.

Para probar: crear y editar un producto desde Vue, volver al dashboard y pulsar **Actualizar**. Si el backend está apagado, la vista muestra un aviso y permite reintentar. La compilación se verifica con `npm.cmd run build`.
