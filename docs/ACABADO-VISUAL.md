# Ajustes de interfaz

Hice algunos cambios visuales sin tocar la lógica de inventario:

- Menú lateral con iconos SVG para reconocer mejor cada sección.
- Encabezado que indica en qué módulo estoy trabajando.
- Paleta azul marino, azul y verde suave; mantuve los formularios claros para facilitar la lectura.
- Estados de stock más visibles: sin stock, stock bajo (1 a 9 unidades) y stock disponible (10 o más). El umbral es una decisión visual de esta demo, no una regla de reposición calculada.
- Mejor contraste de botones, estados de foco para teclado y menú horizontal en pantallas pequeñas.

El backend y las rutas siguen iguales. La mejora solo afecta `App.vue`, `style.css`, `ProductsView.vue` y el título del navegador.

Después de aplicar los cambios comprobé localmente lo siguiente (marcar únicamente tras hacerlo):

- [ ] Dashboard, Productos y Categorías abren sin errores.
- [ ] El buscador y los filtros siguen funcionando.
- [ ] Se puede registrar y editar un producto.
- [ ] Se puede eliminar un producto con confirmación.
- [ ] El menú funciona en una pantalla pequeña.
- [ ] `npm.cmd run build` termina correctamente.
