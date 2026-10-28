import { defineStore } from 'pinia'
import http from '../services/http'
export const useInventory = defineStore('inventory', {
  state: () => ({ products: [], categories: [], dashboard: null, loading: false }),
  actions: {
    async loadProducts(params={}) {
      this.loading=true
      try { const result=await http.get('/products',{params});this.products=result.data;return result.data }
      finally {this.loading=false}
    },
    async loadCategories() {
      this.loading=true
      try {const result=await http.get('/categories');this.categories=result.data;return result.data}
      finally {this.loading=false}
    },
    async loadDashboard() {
      this.loading=true
      try {const result=await http.get('/dashboard');this.dashboard=result.data;return result.data}
      finally {this.loading=false}
    },
    async createCategory(payload) { return http.post('/categories',payload) },
    async updateCategory(id,payload) { return http.put(`/categories/${id}`,payload) },
    async deleteCategory(id) { return http.delete(`/categories/${id}`) },
    async createProduct(payload) { return http.post('/products',payload) },
    async updateProduct(id,payload) { return http.put(`/products/${id}`,payload) },
    async deleteProduct(id) { return http.delete(`/products/${id}`) }
  }
})
