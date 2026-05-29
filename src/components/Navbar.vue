<template>
  <!-- ─── Navbar ──────────────────────────────────────────────────────────── -->
  <nav class="navbar">
    <div class="navbar__brand">
      <RouterLink to="/" class="navbar__logo">
        <span class="navbar__logo-icon">🛒</span>
        <span class="navbar__logo-text">TiendaOnline</span>
      </RouterLink>
    </div>

    <ul class="navbar__links">
      <!-- Siempre visible -->
      <li>
        <RouterLink to="/" class="navbar__link">Inicio</RouterLink>
      </li>
      <li>
        <RouterLink to="/catalogo" class="navbar__link">Catálogo</RouterLink>
      </li>

      <!-- Solo admin -->
      <li v-if="session.esAdmin">
        <RouterLink to="/admin" class="navbar__link navbar__link--admin">
          ⚙ Admin
        </RouterLink>
      </li>
    </ul>

    <div class="navbar__auth">
      <!-- Sin sesión -->
      <template v-if="!session.autenticado">
        <RouterLink to="/registro" class="btn btn--ghost">Registrarse</RouterLink>
        <RouterLink to="/login"    class="btn btn--primary">Iniciar sesión</RouterLink>
      </template>

      <!-- Con sesión -->
      <template v-else>
        <span class="navbar__user">
          👤 {{ session.nombreBienvenida }}
          <span v-if="session.esAdmin" class="badge">Admin</span>
        </span>
        <button
          class="btn btn--danger"
          :disabled="session.cargando"
          @click="handleLogout"
        >
          {{ session.cargando ? 'Saliendo…' : 'Cerrar sesión' }}
        </button>
      </template>
    </div>
  </nav>
</template>

<script setup>
import { useSessionStore }  from '@/stores/sessionStore'
import { useRouter }        from 'vue-router'

const session = useSessionStore()
const router  = useRouter()

async function handleLogout() {
  await session.cerrarSesion()
  router.push({ name: 'home' })
}
</script>

<style scoped>
.navbar {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 0 2rem;
  height: 64px;
  background: #0f172a;
  color: #e2e8f0;
  box-shadow: 0 2px 12px rgba(0,0,0,.35);
  position: sticky;
  top: 0;
  z-index: 100;
}

.navbar__brand { flex: 0 0 auto; }

.navbar__logo {
  display: flex;
  align-items: center;
  gap: .5rem;
  text-decoration: none;
  color: #f8fafc;
  font-weight: 700;
  font-size: 1.15rem;
  letter-spacing: -.02em;
}

.navbar__logo-icon { font-size: 1.4rem; }

.navbar__links {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: .25rem;
  flex: 1;
}

.navbar__link {
  text-decoration: none;
  padding: .4rem .85rem;
  border-radius: 6px;
  color: #94a3b8;
  font-size: .9rem;
  font-weight: 500;
  transition: color .15s, background .15s;
}

.navbar__link:hover,
.navbar__link.router-link-active {
  color: #f8fafc;
  background: rgba(255,255,255,.08);
}

.navbar__link--admin { color: #fbbf24; }

.navbar__auth {
  display: flex;
  align-items: center;
  gap: .75rem;
  flex: 0 0 auto;
}

.navbar__user {
  font-size: .875rem;
  color: #cbd5e1;
  display: flex;
  align-items: center;
  gap: .4rem;
}

.badge {
  background: #1d4ed8;
  color: #fff;
  font-size: .7rem;
  padding: .1rem .45rem;
  border-radius: 999px;
  font-weight: 600;
}

/* Botones */
.btn {
  padding: .45rem 1rem;
  border-radius: 7px;
  font-size: .875rem;
  font-weight: 600;
  cursor: pointer;
  border: none;
  text-decoration: none;
  transition: opacity .15s, transform .1s;
}

.btn:active  { transform: scale(.97); }
.btn:disabled { opacity: .55; cursor: not-allowed; }

.btn--primary { background: #2563eb; color: #fff; }
.btn--primary:hover { background: #1d4ed8; }

.btn--ghost {
  background: transparent;
  color: #94a3b8;
  border: 1px solid #334155;
}
.btn--ghost:hover { background: rgba(255,255,255,.07); color: #e2e8f0; }

.btn--danger { background: #dc2626; color: #fff; }
.btn--danger:hover { background: #b91c1c; }
</style>
