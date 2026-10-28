<script setup>
import { reactive, ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useInventory } from '../stores/inventory'
import { useNotifications } from '../stores/notifications'
import http from '../services/http'
const route=useRoute(),router=useRouter(),store=useInventory(),notify=useNotifications()
const isEdit=computed(()=>Boolean(route.params.id))
const form=reactive({name:'',description:'',price:'',stock:0,category_id:''})
const errors=reactive({}), busy=ref(false), failed=ref(false), loading=ref(false)
const clearErrors=()=>{for(const k of Object.keys(errors))delete errors[k]}
async function load(){loading.value=true;failed.value=false;try{
  await store.loadCategories()
  if(isEdit.value){const response=await http.get(`/products/${route.params.id}`);const p=response.data;Object.assign(form,{name:p.name,description:p.description||'',price:p.price,stock:p.stock,category_id:String(p.category_id)})}
}catch{failed.value=true}finally{loading.value=false}}
watch(()=>route.params.id,load)
onMounted(load)
function validate(){clearErrors();if(!form.name.trim())errors.name='El nombre es obligatorio.';
 if(form.price===''||!Number.isFinite(Number(form.price))||Number(form.price)<=0)errors.price='Introduce un precio mayor a cero.';
 else if(!/^\d+(\.\d{1,2})?$/.test(String(form.price)))errors.price='El precio admite máximo dos decimales.';
 if(form.stock===''||!Number.isInteger(Number(form.stock))||Number(form.stock)<0)errors.stock='Introduce un stock entero de cero o más.';
 if(!form.category_id)errors.category_id='Selecciona una categoría.';
 return !Object.keys(errors).length }
async function submit(){if(!validate())return;busy.value=true
 const payload={name:form.name.trim(),description:form.description.trim()||null,price:Number(form.price),stock:Number(form.stock),category_id:Number(form.category_id)}
 try{if(isEdit.value)await store.updateProduct(route.params.id,payload);else await store.createProduct(payload);
 notify.push(isEdit.value?'Producto actualizado correctamente':'Producto creado correctamente');router.push('/products')}
 catch(err){if(err.response?.status===422){const serverErrors=err.response.data?.errors||{};for(const [key,messages] of Object.entries(serverErrors))errors[key]=Array.isArray(messages)?messages[0]:messages}}
 finally{busy.value=false}}
</script>
<template>
 <div class="flex flex-wrap items-center justify-between gap-3 mb-8"><div><p class="text-sm text-indigo-700 font-bold">Productos / {{isEdit?'Editar':'Nuevo'}}</p><h1 class="text-3xl font-extrabold mt-2">{{isEdit?'Editar producto':'Registrar producto'}}</h1><p class="text-slate-500 mt-2">Completa los campos del producto.</p></div><RouterLink to="/products" class="btn btn-secondary">← Volver al listado</RouterLink></div>
 <div v-if="loading" class="panel p-10 text-slate-500">Cargando formulario...</div>
 <div v-else-if="failed" class="panel p-8 text-rose-600">No se pudo cargar el producto o las categorías. <button class="underline" @click="load">Reintentar</button></div>
 <form v-else class="panel p-6 lg:p-8 max-w-3xl" novalidate @submit.prevent="submit">
  <div class="grid sm:grid-cols-2 gap-5">
   <div class="sm:col-span-2"><label for="name" class="field-label">Nombre *</label><input id="name" v-model="form.name" maxlength="255" class="input" placeholder="Ej. Monitor 24 pulgadas" :aria-invalid="!!errors.name"><p v-if="errors.name" class="error-text">{{errors.name}}</p></div>
   <div class="sm:col-span-2"><label for="description" class="field-label">Descripción</label><textarea id="description" v-model="form.description" rows="3" maxlength="5000" class="input" placeholder="Características y detalles..."></textarea></div>
   <div><label for="price" class="field-label">Precio (S/) *</label><input id="price" v-model="form.price" type="number" min="0.01" step="0.01" class="input" placeholder="99.90" :aria-invalid="!!errors.price"><p v-if="errors.price" class="error-text">{{errors.price}}</p></div>
   <div><label for="stock" class="field-label">Stock *</label><input id="stock" v-model="form.stock" type="number" min="0" step="1" class="input" :aria-invalid="!!errors.stock"><p v-if="errors.stock" class="error-text">{{errors.stock}}</p></div>
   <div class="sm:col-span-2"><label for="category" class="field-label">Categoría *</label><select id="category" v-model="form.category_id" class="input" :aria-invalid="!!errors.category_id"><option value="">Selecciona una categoría</option><option v-for="c in store.categories" :key="c.id" :value="String(c.id)">{{c.name}}</option></select><p v-if="errors.category_id" class="error-text">{{errors.category_id}}</p><p class="text-xs text-slate-500 mt-2">¿No encuentras la categoría? <RouterLink to="/categories" class="text-indigo-700 underline">Crear categoría</RouterLink>.</p></div>
  </div>
  <div class="flex gap-3 justify-end mt-8 pt-5 border-t border-slate-100"><RouterLink to="/products" class="btn btn-secondary">Cancelar</RouterLink><button class="btn btn-primary" :disabled="busy">{{busy?'Guardando...':isEdit?'Actualizar producto':'Guardar producto'}}</button></div>
 </form>
</template>
