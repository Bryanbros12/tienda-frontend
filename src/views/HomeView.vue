<script setup>
</script>

<template>
  <main class="home">

    <!-- ── Hero ─────────────────────────────────────────────── -->
    <section class="hero">
      <div class="hero__content">
        <span class="hero__tag">🛒 Bienvenido a TiendaOnline</span>
        <h1 class="hero__title">Tecnología al<br><em>mejor precio</em></h1>
        <p class="hero__sub">
          Encuentra laptops, periféricos y accesorios con envío rápido
          y garantía oficial en toda la República Mexicana.
        </p>
        <div class="hero__actions">
          <!-- ✅ BOTÓN DE INICIO: redirige al catálogo con useRouter -->
          <button class="btn-hero btn-hero--primary" @click="irAlCatalogo">
            Ver catálogo
          </button>
          <RouterLink to="/registro" class="btn-hero btn-hero--ghost">
            Crear cuenta gratis
          </RouterLink>
        </div>
      </div>
      <div class="hero__visual" aria-hidden="true">
        <div class="hero__blob"></div>
        <img
          src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600"
          alt="Laptop en escritorio"
          class="hero__img"
        />
      </div>
    </section>

    <!-- ── Características ──────────────────────────────────── -->
    <section class="features">
      <div
        v-for="f in features"
        :key="f.titulo"
        class="feature-card"
      >
        <span class="feature-card__icon">{{ f.icono }}</span>
        <h3 class="feature-card__title">{{ f.titulo }}</h3>
        <p class="feature-card__desc">{{ f.desc }}</p>
      </div>
    </section>

  </main>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

// ✅ CORRECCIÓN BOTÓN DE INICIO: navega al catálogo usando Vue Router
function irAlCatalogo() {
  router.push({ name: 'catalogo' })
}

const features = [
  { icono: '🚚', titulo: 'Envío rápido',      desc: 'Entrega en 24–48 h a todo México.' },
  { icono: '🔒', titulo: 'Pago seguro',        desc: 'Transacciones cifradas con SSL.' },
  { icono: '⭐', titulo: 'Garantía oficial',   desc: '12 meses en todos nuestros productos.' },
  { icono: '💬', titulo: 'Soporte 24/7',       desc: 'Asesores disponibles siempre para ti.' },
]
</script>

<style scoped>
/* ── Página ─────────────────────────────────────────────────── */
.home {
  font-family: 'Segoe UI', system-ui, sans-serif;
}

/* ── Hero ───────────────────────────────────────────────────── */
.hero {
  min-height: calc(100vh - 64px);
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  gap: 3rem;
  padding: 4rem 6rem;
  background: linear-gradient(135deg, #0f172a 0%, #1e3a5f 60%, #1e40af 100%);
  color: #fff;
}

@media (max-width: 900px) {
  .hero {
    grid-template-columns: 1fr;
    padding: 3rem 2rem;
    text-align: center;
  }
  .hero__visual { display: none; }
  .hero__actions { justify-content: center; }
}

.hero__tag {
  display: inline-block;
  background: rgba(255,255,255,.12);
  border: 1px solid rgba(255,255,255,.2);
  padding: .35rem .9rem;
  border-radius: 999px;
  font-size: .82rem;
  font-weight: 600;
  letter-spacing: .04em;
  margin-bottom: 1.25rem;
  color: #bfdbfe;
}

.hero__title {
  font-size: clamp(2.4rem, 5vw, 3.6rem);
  font-weight: 900;
  line-height: 1.1;
  margin: 0 0 1.25rem;
  letter-spacing: -.03em;
}

.hero__title em {
  font-style: normal;
  background: linear-gradient(90deg, #60a5fa, #a78bfa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero__sub {
  font-size: 1.1rem;
  color: #93c5fd;
  line-height: 1.65;
  max-width: 480px;
  margin: 0 0 2.25rem;
}

.hero__actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

/* Botones hero */
.btn-hero {
  padding: .8rem 2rem;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  text-decoration: none;
  border: none;
  transition: transform .15s, box-shadow .15s, opacity .15s;
  display: inline-flex;
  align-items: center;
}
.btn-hero:hover { transform: translateY(-2px); }
.btn-hero:active { transform: scale(.97); }

.btn-hero--primary {
  background: #2563eb;
  color: #fff;
  box-shadow: 0 8px 24px rgba(37,99,235,.45);
}
.btn-hero--primary:hover { background: #1d4ed8; box-shadow: 0 12px 32px rgba(37,99,235,.55); }

.btn-hero--ghost {
  background: rgba(255,255,255,.1);
  color: #fff;
  border: 1.5px solid rgba(255,255,255,.25);
}
.btn-hero--ghost:hover { background: rgba(255,255,255,.18); }

/* Imagen hero */
.hero__visual { position: relative; display: flex; justify-content: center; }

.hero__blob {
  position: absolute;
  width: 420px;
  height: 420px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(99,102,241,.35) 0%, transparent 70%);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  filter: blur(40px);
}

.hero__img {
  position: relative;
  width: 100%;
  max-width: 500px;
  border-radius: 20px;
  box-shadow: 0 30px 80px rgba(0,0,0,.5);
  object-fit: cover;
  aspect-ratio: 4/3;
}

/* ── Features ───────────────────────────────────────────────── */
.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
  padding: 4rem 6rem;
  background: #f8fafc;
}

@media (max-width: 900px) { .features { padding: 2.5rem 1.5rem; } }

.feature-card {
  background: #fff;
  border-radius: 16px;
  padding: 2rem 1.5rem;
  box-shadow: 0 4px 20px rgba(0,0,0,.06);
  transition: transform .2s, box-shadow .2s;
  border-top: 3px solid #2563eb;
}
.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0,0,0,.1);
}

.feature-card__icon { font-size: 2rem; display: block; margin-bottom: .75rem; }

.feature-card__title {
  font-size: 1.05rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 .5rem;
}

.feature-card__desc { font-size: .9rem; color: #64748b; margin: 0; line-height: 1.55; }
</style>