<template>
  <section class="login-page">
    <div class="login-card">
      <!-- Cabecera -->
      <div class="login-card__header">
        <span class="login-card__icon">🔐</span>
        <h1 class="login-card__title">Iniciar sesión</h1>
        <p class="login-card__sub">Accede a tu cuenta de TiendaOnline</p>
      </div>

      <div v-if="session.error" class="alert alert--error" role="alert">
        {{ session.error }}
      </div>

      <div class="login-form">
        <!-- Correo -->
        <div class="form-field" :class="{ 'form-field--error': erroresLocales.correo }">
          <label class="form-field__label" for="correo">Correo electrónico</label>
          <input
            id="correo"
            v-model.trim="form.correo"
            type="email"
            class="form-field__input"
            placeholder="tu@correo.com"
            autocomplete="email"
            @blur="validarCampo('correo')"
          />
          <span v-if="erroresLocales.correo" class="form-field__error">
            {{ erroresLocales.correo }}
          </span>
        </div>

        <div class="form-field" :class="{ 'form-field--error': erroresLocales.password }">
          <label class="form-field__label" for="password">Contraseña</label>
          <div class="form-field__pw-wrap">
            <input
              id="password"
              v-model="form.password"
              :type="mostrarPw ? 'text' : 'password'"
              class="form-field__input"
              placeholder="••••••••"
              autocomplete="current-password"
              @blur="validarCampo('password')"
            />
            <button
              type="button"
              class="form-field__pw-toggle"
              @click="mostrarPw = !mostrarPw"
              :aria-label="mostrarPw ? 'Ocultar contraseña' : 'Mostrar contraseña'"
            >
              {{ mostrarPw ? '🔒' : '👁' }}
            </button>
          </div>
          <span v-if="erroresLocales.password" class="form-field__error">
            {{ erroresLocales.password }}
          </span>
        </div>

        <!-- Botón -->
        <button
          class="btn-login"
          :disabled="session.cargando"
          @click="handleLogin"
        >
          <span v-if="session.cargando">Verificando…</span>
          <span v-else>Ingresar</span>
        </button>
      </div>

      <!-- Footer del card -->
      <p class="login-card__footer">
        ¿No tienes cuenta?
        <RouterLink to="/registro" class="login-card__link">Regístrate aquí</RouterLink>
      </p>
    </div>
  </section>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter }      from 'vue-router'
import { useSessionStore } from '@/stores/sessionStore'

const session = useSessionStore()
const router  = useRouter()

// Estado del formulario
const form = reactive({ correo: '', password: '' })
const erroresLocales = reactive({ correo: '', password: '' })
const mostrarPw = ref(false)

// Validación local (antes de enviar al servidor)
function validarCampo(campo) {
  if (campo === 'correo') {
    if (!form.correo)
      erroresLocales.correo = 'El correo es obligatorio.'
    else if (!/\S+@\S+\.\S+/.test(form.correo))
      erroresLocales.correo = 'Ingresa un correo válido.'
    else
      erroresLocales.correo = ''
  }

  if (campo === 'password') {
    erroresLocales.password = form.password ? '' : 'La contraseña es obligatoria.'
  }
}

function formularioValido() {
  validarCampo('correo')
  validarCampo('password')
  return !erroresLocales.correo && !erroresLocales.password
}

async function handleLogin() {
  if (!formularioValido()) return

  const ok = await session.iniciarSesion(form.correo, form.password)
  if (ok) router.push({ name: 'catalogo' })
}
</script>

<style scoped>
.login-page {
  min-height: calc(100vh - 64px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  background: linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%);
}

.login-card {
  width: 100%;
  max-width: 420px;
  background: #fff;
  border-radius: 16px;
  padding: 2.5rem 2rem;
  box-shadow: 0 25px 60px rgba(0,0,0,.35);
}

.login-card__header { text-align: center; margin-bottom: 1.75rem; }

.login-card__icon { font-size: 2.5rem; }

.login-card__title {
  margin: .5rem 0 .25rem;
  font-size: 1.6rem;
  font-weight: 800;
  color: #0f172a;
}

.login-card__sub { color: #64748b; font-size: .9rem; margin: 0; }

/* Alerta */
.alert {
  padding: .75rem 1rem;
  border-radius: 8px;
  font-size: .875rem;
  margin-bottom: 1.25rem;
}
.alert--error { background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; }

/* Campos */
.login-form { display: flex; flex-direction: column; gap: 1.1rem; }

.form-field { display: flex; flex-direction: column; gap: .35rem; }

.form-field__label { font-size: .85rem; font-weight: 600; color: #374151; }

.form-field__input {
  padding: .65rem .9rem;
  border: 1.5px solid #d1d5db;
  border-radius: 8px;
  font-size: .95rem;
  outline: none;
  transition: border .15s;
  width: 100%;
}
.form-field__input:focus { border-color: #2563eb; }

.form-field--error .form-field__input { border-color: #dc2626; }

.form-field__error { font-size: .78rem; color: #dc2626; }

.form-field__pw-wrap { position: relative; }

.form-field__pw-toggle {
  position: absolute;
  right: .65rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  padding: 0;
}

/* Botón principal */
.btn-login {
  margin-top: .5rem;
  padding: .75rem;
  background: #2563eb;
  color: #fff;
  font-size: 1rem;
  font-weight: 700;
  border: none;
  border-radius: 9px;
  cursor: pointer;
  transition: background .15s, transform .1s;
}
.btn-login:hover:not(:disabled) { background: #1d4ed8; }
.btn-login:active { transform: scale(.98); }
.btn-login:disabled { opacity: .6; cursor: not-allowed; }

.login-card__footer {
  text-align: center;
  margin-top: 1.5rem;
  font-size: .875rem;
  color: #64748b;
}

.login-card__link { color: #2563eb; font-weight: 600; text-decoration: none; }
.login-card__link:hover { text-decoration: underline; }
</style>
