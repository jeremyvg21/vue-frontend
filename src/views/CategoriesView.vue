<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useInventory } from '../stores/inventory'
import { useNotifications } from '../stores/notifications'
import ConfirmDialog from '../components/ConfirmDialog.vue'
const store=useInventory(),notify=useNotifications()
const form=reactive({name:'',description:''}), editing=ref(null), deleting=ref(null), busy=ref(false),failed=ref(false)
const errors=reactive({})
async function load(){failed.value=false;try{await store.loadCategories()}catch{failed.value=true}}
function edit(cat){editing.value=cat.id;form.name=cat.name;form.description=cat.description||'';for(const k in errors)delete errors[k]}
function clear(){editing.value=null;form.name='';form.description='';for(const k in errors)delete errors[k]}
async function save(){for(const k in errors)delete errors[k];if(!form.name.trim()){errors.name='Introduce un nombre de categoría.';return}
 busy.value=true;try{const payload={name:form.name.trim(),description:form.description.trim()||null};if(editing.value)await store.updateCategory(editing.value,payload);else await store.createCategory(payload);
 notify.push(editing.value?'Categoría actualizada':'Categoría creada');clear();await load()}
 catch(err){if(err.response?.status===422){const e=err.response.data?.errors||{};for(const [key,value] of Object.entries(e))errors[key]=Array.isArray(value)?value[0]:value}}
 finally{busy.value=false}}
async function remove(){busy.value=true;try{await store.deleteCategory(deleting.value.id);notify.push('Categoría eliminada');deleting.value=null;await load()}catch{}finally{busy.value=false}}
onMounted(load)
</script>
<template>
 <div class="mb-8"><h1 class="text-3xl font-extrabold">Categorías</h1><p class="text-slate-500 mt-2">Organiza los productos en categorías.</p></div>
 <div class="grid lg:grid-cols-3 gap-6 items-start">
  <form class="panel p-6" @submit.prevent="save" novalidate><h2 class="font-bold text-xl mb-5">{{editing?'Editar categoría':'Nueva categoría'}}</h2>
   <label for="category-name" class="field-label">Nombre *</label><input id="category-name" v-model="form.name" class="input" placeholder="Ej. Electrónica" maxlength="255" :aria-invalid="!!errors.name"><p v-if="errors.name" class="error-text">{{errors.name}}</p>
   <label for="category-description" class="field-label mt-5">Descripción</label><textarea id="category-description" v-model="form.description" class="input" rows="4" maxlength="5000" placeholder="Descripción opcional"></textarea>
   <button type="submit" class="btn btn-primary w-full mt-5" :disabled="busy">{{busy?'Guardando...':editing?'Guardar cambios':'Crear categoría'}}</button>
   <button v-if="editing" class="btn btn-secondary w-full mt-2" type="button" @click="clear">Cancelar edición</button>
  </form>
  <section class="panel lg:col-span-2 overflow-hidden"><div class="flex items-center justify-between p-5"><h2 class="font-bold text-lg">Listado de categorías</h2><button class="btn btn-secondary" @click="load">Actualizar</button></div>
    <p v-if="store.loading && !store.categories.length" class="p-8 text-slate-500">Cargando categorías...</p>
    <p v-else-if="failed" class="p-8 text-rose-600">Error al cargar. <button @click="load" class="underline">Reintentar</button></p>
    <div v-else class="overflow-x-auto"><table class="w-full text-left text-sm"><thead class="bg-slate-50 text-slate-500"><tr><th class="p-4">Categoría</th><th class="p-4">Productos</th><th class="p-4">Acciones</th></tr></thead>
    <tbody><tr v-for="c in store.categories" :key="c.id" class="border-t border-slate-100"><td class="p-4"><p class="font-bold">{{c.name}}</p><p class="text-slate-400 text-xs mt-1">{{c.description||'Sin descripción'}}</p></td><td class="p-4">{{c.products_count}}</td><td class="p-4 whitespace-nowrap"><button class="text-indigo-700 font-bold mr-4 hover:underline" @click="edit(c)">Editar</button><button class="text-rose-600 font-bold hover:underline" @click="deleting=c">Eliminar</button></td></tr>
    <tr v-if="!store.categories.length"><td colspan="3" class="text-slate-500 p-10 text-center">Aún no hay categorías registradas.</td></tr></tbody></table></div>
  </section>
 </div>
 <ConfirmDialog :open="!!deleting" :busy="busy" title="Eliminar categoría" :message="`¿Eliminar ${deleting?.name||'esta categoría'}? Solo es posible si no tiene productos asociados.`" @cancel="deleting=null" @confirm="remove" />
</template>
