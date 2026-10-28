<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import ToastStack from './components/ToastStack.vue'

const route = useRoute()
const currentSection = computed(() => {
  if (route.path.startsWith('/products')) return 'Productos'
  if (route.path.startsWith('/categories')) return 'Categorías'
  return 'Resumen'
})
const navItems = [
  { label: 'Dashboard', to: '/', key: 'dashboard' },
  { label: 'Productos', to: '/products', key: 'products' },
  { label: 'Categorías', to: '/categories', key: 'categories' },
]
const active = item => item.to === '/'
  ? route.path === '/'
  : route.path.startsWith(item.to)
</script>

<template>
  <div class="workspace min-h-screen lg:flex">
    <aside class="workspace-sidebar text-white lg:w-64 lg:min-h-screen shrink-0" aria-label="Menú principal">
      <div class="sidebar-content">
        <RouterLink to="/" class="brand-lockup" aria-label="Overskull, ir al dashboard">
          <span class="brand-symbol" aria-hidden="true">O<span class="brand-symbol-dot"></span></span>
          <span>
            <span class="brand-name">Overskull</span>
            <span class="brand-subtitle">Control de inventario</span>
          </span>
        </RouterLink>

        <p class="nav-caption">ESPACIO DE TRABAJO</p>
        <nav class="workspace-nav" aria-label="Secciones">
          <RouterLink
            v-for="item in navItems"
            :key="item.key"
            :to="item.to"
            class="workspace-nav-link"
            :class="{ 'is-active': active(item) }"
            :aria-current="active(item) ? 'page' : undefined"
          >
            <svg v-if="item.key === 'dashboard'" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>
            <svg v-else-if="item.key === 'products'" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3 9 4.5v9L12 21l-9-4.5v-9L12 3Z"/><path d="m3 7.5 9 5 9-5M12 12.5V21"/></svg>
            <svg v-else viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12V5a2 2 0 0 1 2-2h7l9 9-9 9-9-9Z"/><circle cx="8" cy="8" r="1"/></svg>
            <span>{{ item.label }}</span>
            <span v-if="active(item)" class="nav-active-dot" aria-hidden="true"></span>
          </RouterLink>
        </nav>
      </div>
      <div class="sidebar-footnote">
        <span class="footnote-line" aria-hidden="true"></span>
        <p class="footnote-heading">Todo en orden</p>
        <p class="footnote-text">Productos, categorías y movimientos en un solo lugar.</p>
        <p class="footnote-version">INVENTARIO / V1.0</p>
      </div>
    </aside>

    <div class="workspace-body flex-1 min-w-0">
      <header class="workspace-header">
        <div>
          <p class="header-eyebrow">INVENTARIO <span aria-hidden="true">/</span> {{ currentSection.toUpperCase() }}</p>
          <p class="header-heading">Panel de gestión</p>
        </div>
        <span class="header-environment"><span class="environment-dot" aria-hidden="true"></span> Entorno local</span>
      </header>
      <main id="contenido" class="workspace-main p-5 lg:p-9 max-w-7xl mx-auto">
        <RouterView />
      </main>
      <footer class="workspace-footer">Overskull · Inventario y catálogo</footer>
    </div>
    <ToastStack />
  </div>
</template>
