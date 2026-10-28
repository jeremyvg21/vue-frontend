<script setup>
defineProps({open:Boolean,title:{type:String,default:'Confirmar eliminación'},message:String,busy:Boolean})
const emit=defineEmits(['confirm','cancel'])
</script>
<template>
 <div v-if="open" class="fixed inset-0 z-40 bg-slate-950/50 flex items-center justify-center p-4" role="presentation" @click.self="emit('cancel')">
   <div role="dialog" aria-modal="true" :aria-label="title" class="bg-white max-w-md w-full rounded-2xl p-6 shadow-2xl">
    <h2 class="text-lg font-bold text-slate-900">{{title}}</h2><p class="text-slate-600 text-sm mt-2">{{message}}</p>
    <div class="flex justify-end gap-3 mt-6"><button type="button" class="btn btn-secondary" :disabled="busy" @click="emit('cancel')">Cancelar</button>
    <button type="button" class="btn btn-danger" :disabled="busy" @click="emit('confirm')">{{busy?'Eliminando...':'Eliminar'}}</button></div>
   </div>
 </div>
</template>
