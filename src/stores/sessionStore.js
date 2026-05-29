
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const API = 'https://tienda-backend-6w63.onrender.com/' || 'http://127.0.0.1:5000'

export const useSessionStore = defineStore('session', () => {
  const usuario     = ref(JSON.parse(localStorage.getItem('usuario') || 'null'))
  const cargando    = ref(false)
  const error       = ref('')
  const mensaje     = ref('')

  const autenticado = computed(() => !!usuario.value)
  const esAdmin     = computed(() => usuario.value?.rol === 'admin')
  const nombreBienvenida = computed(() => usuario.value?.nombre || 'Invitado')


  async function iniciarSesion(correo, password) {
    cargando.value = true
    error.value    = ''
    mensaje.value  = ''

    try {
      const respuesta = await fetch(`${API}/login`, {
        method:      'POST',
        credentials: 'include',          // envía/recibe la cookie de sesión
        headers:     { 'Content-Type': 'application/json' },
        body:        JSON.stringify({ correo, password }),
      })

      const datos = await respuesta.json()

      if (!respuesta.ok) {
        
        error.value = datos.errores ? datos.errores.join(' ') : datos.mensaje
        return false
      }

      usuario.value = datos.usuario
      localStorage.setItem('usuario', JSON.stringify(datos.usuario))
      mensaje.value = datos.mensaje
      return true

    } catch (err) {
      error.value = 'No se pudo conectar con el servidor.'
      return false
    } finally {
      cargando.value = false
    }
  }


  async function cerrarSesion() {
    try {
      await fetch(`${API}/logout`, {
        method:      'POST',
        credentials: 'include',
      })
    } catch { /* silencioso */ }

    usuario.value = null
    localStorage.removeItem('usuario')
    mensaje.value = ''
    error.value   = ''
  }

  async function verificarSesion() {
    try {
      const respuesta = await fetch(`${API}/session`, {
        credentials: 'include',
      })
      if (respuesta.ok) {
        const datos = await respuesta.json()
        usuario.value = datos.usuario
        localStorage.setItem('usuario', JSON.stringify(datos.usuario))
      } else {
        usuario.value = null
        localStorage.removeItem('usuario')
      }
    } catch { /* sin conexión */ }
  }

  return {
    usuario, cargando, error, mensaje,
    autenticado, esAdmin, nombreBienvenida,
    iniciarSesion, cerrarSesion, verificarSesion,
  }
})
