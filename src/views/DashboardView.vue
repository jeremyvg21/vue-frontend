<script setup>
import { onMounted, computed, ref } from 'vue'
import { useInventory } from '../stores/inventory'

const store = useInventory()
const error = ref(false)
const info = computed(() => store.dashboard || {
  products: 0, categories: 0, stock: 0, inventory_value: 0, recent_activity: []
})

const money = value => new Intl.NumberFormat('es-PE', {
  style: 'currency', currency: 'PEN'
}).format(Number(value || 0))

const verbs = { created: 'Se creó', updated: 'Se actualizó', deleted: 'Se eliminó' }
const badges = {
  created: { symbol: '+', css: 'bg-emerald-50 text-emerald-700' },
  updated: { symbol: '✎', css: 'bg-indigo-50 text-indigo-700' },
  deleted: { symbol: '−', css: 'bg-rose-50 text-rose-700' }
}

function activityText(log) {
  const noun = log.entity_type === 'Product' ? 'producto'
    : log.entity_type === 'Category' ? 'categoría' : 'registro'
  const article = noun === 'categoría' ? 'la' : 'el'
  const name = log.entity_name || log.new_values?.name || log.old_values?.name
  const description = name ? `«${name}»` : `#${log.entity_id}`
  const verb = verbs[log.action] || 'Se modificó'
  return `${verb} ${article} ${noun} ${description}`
}

function activityDate(value) {
  if (!value) return ''
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '' : new Intl.DateTimeFormat('es-PE', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
  }).format(date)
}

async function reload() {
  error.value = false
  try { await store.loadDashboard() } catch { error.value = true }
}
onMounted(reload)
</script>

<template>
  <div class="flex flex-wrap items-center justify-between gap-4 mb-8">
    <div>
      <h1 class="text-3xl font-extrabold tracking-tight">Dashboard</h1>
      <p class="text-slate-500 mt-2">Indicadores generales del inventario.</p>
    </div>
    <RouterLink class="btn btn-primary" to="/products/new">＋ Nuevo producto</RouterLink>
  </div>

  <p v-if="store.loading && !store.dashboard" class="text-slate-500 py-12">Cargando indicadores...</p>
  <div v-if="error" class="panel p-5 text-rose-700">
    No se pudieron cargar los indicadores.
    <button class="underline" @click="reload">Reintentar</button>
  </div>

  <div v-if="!error" class="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
    <div v-for="card in [
      { name: 'Productos', value: info.products, icon: '▤' },
      { name: 'Categorías', value: info.categories, icon: '▧' },
      { name: 'Unidades en stock', value: info.stock, icon: '▣' },
      { name: 'Valor del inventario', value: money(info.inventory_value), icon: 'S/' }
    ]" :key="card.name" class="panel p-6">
      <div class="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-extrabold text-xl">{{ card.icon }}</div>
      <p class="text-sm text-slate-500 mt-5">{{ card.name }}</p>
      <p class="text-3xl font-extrabold text-slate-900 mt-1">{{ card.value }}</p>
    </div>
  </div>

  <div class="grid lg:grid-cols-3 gap-5 mt-6">
    <section class="panel p-6 lg:col-span-2">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 class="font-extrabold text-xl">Actividad reciente</h2>
          <p class="text-slate-500 text-sm mt-1">Últimos movimientos del inventario.</p>
        </div>
        <button type="button" class="text-sm font-semibold text-indigo-700 hover:text-indigo-900" @click="reload">Actualizar</button>
      </div>

      <div v-if="!info.recent_activity.length" class="text-slate-400 text-sm py-8">
        Todavía no hay operaciones registradas.
      </div>
      <div v-for="log in info.recent_activity" :key="log.id"
        class="py-3.5 border-t border-slate-100 flex flex-wrap items-center gap-3 text-sm first:mt-5">
        <span class="w-8 h-8 rounded-lg inline-flex items-center justify-center font-bold shrink-0"
          :class="badges[log.action]?.css || 'bg-slate-100 text-slate-600'"
          aria-hidden="true">{{ badges[log.action]?.symbol || '•' }}</span>
        <span class="text-slate-700 flex-1 min-w-52">{{ activityText(log) }}</span>
        <time class="text-slate-400 text-xs" :datetime="log.created_at">{{ activityDate(log.created_at) }}</time>
      </div>
    </section>

    <section class="panel p-6">
      <h2 class="font-extrabold text-xl">Accesos rápidos</h2>
      <p class="text-slate-500 text-sm mt-1 mb-5">Administra los recursos del sistema.</p>
      <div class="flex flex-col gap-3">
        <RouterLink class="btn btn-secondary" to="/products">Ver productos</RouterLink>
        <RouterLink class="btn btn-secondary" to="/categories">Gestionar categorías</RouterLink>
        <a class="btn btn-secondary" href="http://127.0.0.1:8000/api/docs" target="_blank" rel="noopener noreferrer">Documentación API</a>
      </div>
    </section>
  </div>
</template>
