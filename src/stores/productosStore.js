
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const API = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000'

export const useProductosStore = defineStore('productos', () => {
  const productos  = ref([])
  const cargando   = ref(false)
  const error      = ref('')
  const mensaje    = ref('')

  const destacados     = computed(() => productos.value.filter(p => p.destacado))
  const totalProductos = computed(() => productos.value.length)


  async function cargarProductos() {
    cargando.value = true
    error.value    = ''

    try {
      const respuesta = await fetch(`${API}/productos`, {
        credentials: 'include',
      })
      const datos = await respuesta.json()

      if (!respuesta.ok) {
        throw new Error(datos.mensaje || 'Error al cargar productos')
      }

      productos.value = datos
    } catch (err) {
      error.value = err.message
    } finally {
      cargando.value = false
    }
  }

  async function agregarProducto(nuevoProducto) {
    mensaje.value = ''
    error.value   = ''

    try {
      const respuesta = await fetch(`${API}/productos`, {
        method:      'POST',
        credentials: 'include',
        headers:     { 'Content-Type': 'application/json' },
        body:        JSON.stringify(nuevoProducto),
      })

      const datos = await respuesta.json()

      if (!respuesta.ok) {
        const detalle = datos.errores ? datos.errores.join(' ') : datos.mensaje
        throw new Error(detalle)
      }

      mensaje.value = datos.mensaje
      await cargarProductos()   // refresca la lista
      return true

    } catch (err) {
      error.value = err.message
      return false
    }
  }

  return {
    productos, cargando, error, mensaje,
    destacados, totalProductos,
    cargarProductos, agregarProducto,
  }
})
