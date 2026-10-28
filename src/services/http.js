import axios from 'axios'
import { useNotifications } from '../stores/notifications'
const http = axios.create({
  baseURL: '/api', timeout: 15000,
  headers: { Accept: 'application/json', 'Content-Type': 'application/json' }
})
http.interceptors.response.use(
  response => response.data,
  error => {
    const store = useNotifications()
    const data = error.response?.data
    const firstError = data?.errors ? Object.values(data.errors).flat()[0] : null
    const message = firstError || data?.message ||
      (!error.response ? 'No se pudo conectar con Laravel. Comprueba el puerto 8000.' :
      error.response.status >= 500 ? 'Error del servidor. Revisa Laravel.' : 'No se pudo completar la solicitud.')
    store.push(String(message), 'error')
    return Promise.reject(error)
  }
)
export default http
