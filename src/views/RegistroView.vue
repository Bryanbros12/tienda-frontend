<template>
  <section class="registro-page">
    <div class="registro-card">
      <div class="registro-card__header">
        <span class="registro-card__icon">✨</span>
        <h1 class="registro-card__title">Crear cuenta</h1>
        <p class="registro-card__sub">Únete a TiendaOnline hoy mismo</p>
      </div>

      <div v-if="mensaje" class="alert alert--ok">{{ mensaje }}</div>
      <div v-if="errorGlobal" class="alert alert--err">{{ errorGlobal }}</div>

      <div class="registro-form">
        <!-- Nombre -->
        <div class="form-field" :class="{ 'form-field--err': errores.nombre }">
          <label class="form-field__label">Nombre completo *</label>
          <input v-model.trim="form.nombre" type="text" class="form-field__input" placeholder="Tu nombre" />
          <span v-if="errores.nombre" class="form-field__err">{{ errores.nombre }}</span>
        </div>

        <!-- Correo -->
        <div class="form-field" :class="{ 'form-field--err': errores.correo }">
          <label class="form-field__label">Correo electrónico *</label>
          <input v-model.trim="form.correo" type="email" class="form-field__input" placeholder="tu@correo.com" />
          <span v-if="errores.correo" class="form-field__err">{{ errores.correo }}</span>
        </div>

        <!-- Contraseña -->
        <div class="form-field" :class="{ 'form-field--err': errores.password }">
          <label class="form-field__label">Contraseña * (mínimo 6 caracteres)</label>
          <input v-model="form.password" type="password" class="form-field__input" placeholder="••••••••" />
          <span v-if="errores.password" class="form-field__err">{{ errores.password }}</span>
        </div>

        <button class="btn-registro" :disabled="cargando" @click="handleRegistro">
          {{ cargando ? 'Registrando…' : 'Crear cuenta' }}
        </button>
      </div>

      <p class="registro-card__footer">
        ¿Ya tienes cuenta?
        <RouterLink to="/login" class="registro-card__link">Inicia sesión</RouterLink>
      </p>
    </div>
  </section>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter }     from 'vue-router'

const API = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000'

const router = useRouter()
const form   = reactive({ nombre: '', correo: '', password: '' })
const errores    = reactive({ nombre: '', correo: '', password: '' })
const cargando   = ref(false)
const mensaje    = ref('')
const errorGlobal = ref('')

function validar() {
  errores.nombre   = form.nombre   ? '' : 'El nombre es obligatorio.'
  errores.correo   = /\S+@\S+\.\S+/.test(form.correo) ? '' : 'Correo no válido.'
  errores.password = form.password.length >= 6 ? '' : 'Mínimo 6 caracteres.'
  return !Object.values(errores).some(Boolean)
}

async function handleRegistro() {
  if (!validar()) return

  cargando.value    = true
  mensaje.value     = ''
  errorGlobal.value = ''

  try {
    const respuesta = await fetch(`${API}/registro`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ ...form }),
    })

    const datos = await respuesta.json()

    if (!respuesta.ok) {
      errorGlobal.value = datos.errores ? datos.errores.join(' ') : datos.mensaje
      return
    }

    mensaje.value = datos.mensaje + ' Redirigiendo…'
    setTimeout(() => router.push({ name: 'login' }), 1800)

  } catch {
    errorGlobal.value = 'No se pudo conectar con el servidor.'
  } finally {
    cargando.value = false
  }
}
</script>

<style scoped>
.registro-page {
  min-height: calc(100vh - 64px);
  display: flex; align-items: center; justify-content: center;
  padding: 2rem 1rem;
  background: linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%);
}
.registro-card {
  width: 100%; max-width: 440px;
  background: #fff; border-radius: 16px;
  padding: 2.5rem 2rem;
  box-shadow: 0 25px 60px rgba(0,0,0,.35);
}
.registro-card__header { text-align: center; margin-bottom: 1.75rem; }
.registro-card__icon   { font-size: 2.5rem; }
.registro-card__title  { margin: .5rem 0 .25rem; font-size: 1.6rem; font-weight: 800; color: #0f172a; }
.registro-card__sub    { color: #64748b; font-size: .9rem; margin: 0; }

.alert { padding: .75rem 1rem; border-radius: 8px; font-size: .875rem; margin-bottom: 1rem; }
.alert--ok  { background: #dcfce7; color: #166534; border: 1px solid #bbf7d0; }
.alert--err { background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; }

.registro-form { display: flex; flex-direction: column; gap: 1rem; }

.form-field { display: flex; flex-direction: column; gap: .3rem; }
.form-field__label { font-size: .83rem; font-weight: 600; color: #374151; }
.form-field__input {
  padding: .65rem .9rem; border: 1.5px solid #d1d5db;
  border-radius: 8px; font-size: .95rem; outline: none;
  transition: border .15s; width: 100%;
}
.form-field__input:focus { border-color: #2563eb; }
.form-field--err .form-field__input { border-color: #dc2626; }
.form-field__err { font-size: .78rem; color: #dc2626; }

.btn-registro {
  margin-top: .5rem; padding: .75rem;
  background: #7c3aed; color: #fff;
  font-size: 1rem; font-weight: 700;
  border: none; border-radius: 9px; cursor: pointer;
  transition: background .15s;
}
.btn-registro:hover:not(:disabled) { background: #6d28d9; }
.btn-registro:disabled { opacity: .6; cursor: not-allowed; }

.registro-card__footer { text-align: center; margin-top: 1.5rem; font-size: .875rem; color: #64748b; }
.registro-card__link   { color: #2563eb; font-weight: 600; text-decoration: none; }
.registro-card__link:hover { text-decoration: underline; }
</style>
