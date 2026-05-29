<template>
  <!-- ─── Catálogo ───────────────────────────────────────────────────────── -->
  <main class="catalogo-page">
    <!-- Encabezado -->
    <header class="catalogo-header">
      <h1 class="catalogo-header__title">Nuestro catálogo</h1>
      <p class="catalogo-header__sub">
        {{ tienda.totalProductos }} productos disponibles
      </p>
    </header>

    <!-- Filtro / búsqueda -->
    <div class="catalogo-toolbar">
      <input
        v-model="busqueda"
        type="search"
        class="catalogo-toolbar__search"
        placeholder=" Buscar producto…"
      />
    </div>

    <!-- Cargando -->
    <div v-if="tienda.cargando" class="catalogo-estado">
      <div class="spinner"></div>
      <p>Cargando productos…</p>
    </div>

    <!-- Error -->
    <div v-else-if="tienda.error" class="catalogo-estado catalogo-estado--error">
      <span>⚠️ {{ tienda.error }}</span>
      <button class="btn-retry" @click="tienda.cargarProductos()">Reintentar</button>
    </div>

    <!-- Sin resultados -->
    <div v-else-if="productosFiltrados.length === 0" class="catalogo-estado">
      <span>😕 No se encontraron productos.</span>
    </div>

    <!-- Grid de tarjetas -->
    <section v-else class="catalogo-grid">
      <article
        v-for="producto in productosFiltrados"
        :key="producto.id"
        class="producto-card"
        :class="{ 'producto-card--destacado': producto.destacado }"
      >
        <!-- Badge destacado -->
        <span v-if="producto.destacado" class="producto-card__badge">⭐ Destacado</span>

        <!-- Imagen -->
        <div class="producto-card__img-wrap">
          <img
            v-if="producto.imagen_url"
            :src="producto.imagen_url"
            :alt="producto.nombre"
            class="producto-card__img"
            loading="lazy"
          />
          <div v-else class="producto-card__img-placeholder">🖼</div>
        </div>

        <!-- Contenido -->
        <div class="producto-card__body">
          <h2 class="producto-card__nombre">{{ producto.nombre }}</h2>
          <p class="producto-card__desc">{{ producto.descripcion }}</p>

          <div class="producto-card__footer">
            <span class="producto-card__precio">
              ${{ producto.precio.toLocaleString('es-MX', { minimumFractionDigits: 2 }) }}
            </span>
            <span class="producto-card__stock" :class="{ 'producto-card__stock--bajo': producto.stock < 5 }">
              {{ producto.stock > 0 ? `${producto.stock} en stock` : 'Sin stock' }}
            </span>
          </div>

          <button
            class="producto-card__btn"
            :disabled="producto.stock === 0"
          >
            {{ producto.stock > 0 ? '🛒 Agregar al carrito' : 'Sin disponibilidad' }}
          </button>
        </div>
      </article>
    </section>
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useProductosStore } from '../stores/productosStore'

const tienda   = useProductosStore()
const busqueda = ref('')

// Filtra por nombre o descripción según el texto buscado
const productosFiltrados = computed(() => {
  const q = busqueda.value.toLowerCase().trim()
  if (!q) return tienda.productos
  return tienda.productos.filter(
    p =>
      p.nombre.toLowerCase().includes(q) ||
      p.descripcion.toLowerCase().includes(q)
  )
})

// Carga al montar el componente
onMounted(() => tienda.cargarProductos())
</script>

<style scoped>
.catalogo-page {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2.5rem 1.5rem;
}

.catalogo-header {
  text-align: center;
  margin-bottom: 2rem;
}

.catalogo-header__title {
  font-size: 2.2rem;
  font-weight: 800;
  color: #0f172a;
  margin: 0 0 .35rem;
}

.catalogo-header__sub { color: #64748b; font-size: 1rem; margin: 0; }

/* Barra de búsqueda */
.catalogo-toolbar {
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
}

.catalogo-toolbar__search {
  width: 100%;
  max-width: 480px;
  padding: .65rem 1.1rem;
  border: 1.5px solid #cbd5e1;
  border-radius: 999px;
  font-size: .95rem;
  outline: none;
  transition: border .15s, box-shadow .15s;
}
.catalogo-toolbar__search:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37,99,235,.15);
}

/* Estados */
.catalogo-estado {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 4rem 0;
  color: #64748b;
  font-size: 1.1rem;
}
.catalogo-estado--error { color: #dc2626; }

.spinner {
  width: 42px;
  height: 42px;
  border: 4px solid #e2e8f0;
  border-top-color: #2563eb;
  border-radius: 50%;
  animation: spin .7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

.btn-retry {
  padding: .5rem 1.25rem;
  background: #dc2626;
  color: #fff;
  border: none;
  border-radius: 7px;
  font-weight: 600;
  cursor: pointer;
}

/* Grid */
.catalogo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1.5rem;
}

/* Tarjeta */
.producto-card {
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 4px 16px rgba(0,0,0,.08);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
  transition: transform .2s, box-shadow .2s;
}
.producto-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0,0,0,.14);
}
.producto-card--destacado {
  border: 2px solid #fbbf24;
}

.producto-card__badge {
  position: absolute;
  top: .75rem;
  left: .75rem;
  background: #fef3c7;
  color: #92400e;
  font-size: .72rem;
  font-weight: 700;
  padding: .2rem .6rem;
  border-radius: 999px;
  z-index: 1;
}

.producto-card__img-wrap {
  height: 180px;
  overflow: hidden;
  background: #f1f5f9;
}

.producto-card__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform .3s;
}
.producto-card:hover .producto-card__img { transform: scale(1.04); }

.producto-card__img-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  color: #94a3b8;
}

.producto-card__body {
  padding: 1.1rem 1.25rem 1.25rem;
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: .5rem;
}

.producto-card__nombre {
  font-size: 1.05rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
  line-height: 1.3;
}

.producto-card__desc {
  font-size: .85rem;
  color: #64748b;
  margin: 0;
  line-height: 1.5;
  flex: 1;
  /* Truncar a 3 líneas */
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.producto-card__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.producto-card__precio {
  font-size: 1.15rem;
  font-weight: 800;
  color: #1d4ed8;
}

.producto-card__stock {
  font-size: .78rem;
  color: #16a34a;
  font-weight: 600;
}
.producto-card__stock--bajo { color: #dc2626; }

.producto-card__btn {
  padding: .6rem;
  background: #2563eb;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: .9rem;
  font-weight: 600;
  cursor: pointer;
  transition: background .15s;
  width: 100%;
  margin-top: .25rem;
}
.producto-card__btn:hover:not(:disabled) { background: #1d4ed8; }
.producto-card__btn:disabled {
  background: #e2e8f0;
  color: #94a3b8;
  cursor: not-allowed;
}
</style>
