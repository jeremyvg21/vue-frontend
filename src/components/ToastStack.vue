<script setup>
import { useNotifications } from '../stores/notifications'
const store=useNotifications()
</script>
<template>
  <div class="fixed right-5 bottom-5 z-50 flex flex-col gap-3 max-w-[calc(100vw-40px)] w-90" aria-live="polite">
    <div v-for="item in store.items" :key="item.id" class="rounded-xl border bg-white shadow-xl px-4 py-3 flex items-start gap-3"
         :class="item.type==='error'?'border-rose-200':'border-emerald-200'" role="status">
      <span :class="item.type==='error'?'text-rose-600':'text-emerald-600'">{{ item.type==='error'?'●':'✓' }}</span>
      <p class="text-sm flex-1">{{item.message}}</p>
      <button type="button" class="text-slate-400 hover:text-slate-700" aria-label="Cerrar aviso" @click="store.remove(item.id)">✕</button>
    </div>
  </div>
</template>
