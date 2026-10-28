import { defineStore } from 'pinia'
let nextId = 1
export const useNotifications = defineStore('notifications', {
  state: () => ({ items: [] }),
  actions: {
    push(message, type='success') {
      const id = nextId++
      this.items.push({ id, message, type })
      setTimeout(() => this.remove(id), 5000)
    },
    remove(id) { this.items = this.items.filter(item => item.id !== id) }
  }
})
