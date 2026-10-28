<script setup>
import { ref, computed, onMounted } from 'vue'
import { useInventory } from '../stores/inventory'
import { useNotifications } from '../stores/notifications'
import ConfirmDialog from '../components/ConfirmDialog.vue'
const store=useInventory(), notify=useNotifications()
const search=ref(''), category=ref(''), deleting=ref(null), busy=ref(false), failed=ref(false)
const filtered=computed(()=>store.products.filter(p=>
  (!search.value||`${p.name} ${p.description||''}`.toLowerCase().includes(search.value.toLowerCase()))&&
  (!category.value||String(p.category_id)===String(category.value))))
const money=n=>new Intl.NumberFormat('es-PE',{style:'currency',currency:'PEN'}).format(Number(n))
async function refresh(){failed.value=false;try{await Promise.all([store.loadProducts(),store.loadCategories()])}catch{failed.value=true}}
async function remove(){busy.value=true;try{await store.deleteProduct(deleting.value.id);notify.push('Producto eliminado');deleting.value=null;await store.loadProducts()}catch{}finally{busy.value=false}}
onMounted(refresh)
</script>
<template>
 <div class="flex flex-wrap items-center justify-between gap-4 mb-8"><div><h1 class="text-3xl font-extrabold tracking-tight">Productos</h1><p class="text-slate-500 mt-2">Organiza tu catálogo y controla las existencias.</p></div><RouterLink to="/products/new" class="btn btn-primary">＋ Nuevo producto</RouterLink></div>
 <section class="panel overflow-hidden"><div class="p-5 border-b border-slate-100 flex flex-wrap gap-3">
  <input v-model="search" type="search" class="input flex-1 min-w-52" placeholder="Buscar por nombre o descripción" aria-label="Buscar productos">
  <select v-model="category" class="input max-w-56" aria-label="Filtrar por categoría"><option value="">Todas las categorías</option><option v-for="c in store.categories" :key="c.id" :value="String(c.id)">{{c.name}}</option></select>
  <button class="btn btn-secondary" @click="refresh">Actualizar</button></div>
  <div v-if="store.loading && !store.products.length" class="p-10 text-center text-slate-500">Cargando productos...</div>
  <div v-else-if="failed" class="p-10 text-center text-rose-600">No se pudieron cargar los datos. <button class="underline" @click="refresh">Reintentar</button></div>
  <div v-else class="overflow-x-auto"><table class="w-full min-w-[700px] text-left text-sm"><thead class="bg-slate-50 text-slate-500"><tr><th class="p-4">Producto</th><th class="p-4">Categoría</th><th class="p-4">Precio</th><th class="p-4">Stock</th><th class="p-4">Acciones</th></tr></thead>
   <tbody><tr v-for="p in filtered" :key="p.id" class="border-t border-slate-100 hover:bg-slate-50"><td class="p-4"><p class="font-bold text-slate-900">{{p.name}}</p><p class="text-slate-400 text-xs max-w-72 truncate">{{p.description||'Sin descripción'}}</p></td><td class="p-4">{{p.category?.name||'—'}}</td><td class="p-4 font-semibold">{{money(p.price)}}</td><td class="p-4"><span class="px-3 py-1 rounded-full text-xs font-bold" :class="p.stock===0?'bg-rose-50 text-rose-700':p.stock<10?'bg-amber-50 text-amber-700':'bg-emerald-50 text-emerald-700'">{{p.stock===0?'Sin stock':p.stock<10?`${p.stock} · Stock bajo`:`${p.stock} unidades`}}</span></td><td class="p-4 whitespace-nowrap"><RouterLink :to="`/products/${p.id}/edit`" class="text-indigo-700 font-bold mr-4 hover:underline">Editar</RouterLink><button class="text-rose-600 font-bold hover:underline" @click="deleting=p">Eliminar</button></td></tr>
    <tr v-if="!filtered.length"><td colspan="5" class="text-center p-12 text-slate-500">No hay productos para mostrar.</td></tr></tbody></table></div>
   <div class="px-5 py-3 border-t border-slate-100 text-xs text-slate-500">{{filtered.length}} producto(s) mostrado(s)</div>
 </section>
 <ConfirmDialog :open="!!deleting" :busy="busy" title="Eliminar producto" :message="`¿Eliminar ${deleting?.name||'este producto'}? Esta acción no se puede deshacer.`" @cancel="deleting=null" @confirm="remove" />
</template>
