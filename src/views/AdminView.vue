<template>
  <!-- ─── Panel Admin ─────────────────────────────────────────────────────── -->
  <main class="admin-page">
    <div class="admin-page__inner">
      <h1 class="admin-page__title">⚙ Panel de administración</h1>

      <!-- Éxito / Error global -->
      <div v-if="tienda.mensaje" class="alert alert--ok">✅ {{ tienda.mensaje }}</div>
      <div v-if="tienda.error"   class="alert alert--err">❌ {{ tienda.error }}</div>

      <!-- ── Formulario: agregar producto ──────────────────────────── -->
      <section class="admin-card">
        <h2 class="admin-card__title">Agregar nuevo producto</h2>

        <div class="admin-form">
          <!-- Nombre -->
          <div class="form-field" :class="{ 'form-field--err': errores.nombre }">
            <label class="form-field__label">Nombre *</label>
            <input v-model.trim="form.nombre" type="text" class="form-field__input" placeholder="Nombre del producto" />
            <span v-if="errores.nombre" class="form-field__err">{{ errores.nombre }}</span>
          </div>

          <!-- Descripción -->
          <div class="form-field" :class="{ 'form-field--err': errores.descripcion }">
            <label class="form-field__label">Descripción *</label>
            <textarea v-model.trim="form.descripcion" class="form-field__input form-field__textarea" rows="3" placeholder="Descripción detallada…"></textarea>
            <span v-if="errores.descripcion" class="form-field__err">{{ errores.descripcion }}</span>
          </div>

          <!-- Precio y Stock -->
          <div class="admin-form__row">
            <div class="form-field" :class="{ 'form-field--err': errores.precio }">
              <label class="form-field__label">Precio (MXN) *</label>
              <input v-model.number="form.precio" type="number" min="0" step="0.01" class="form-field__input" placeholder="0.00" />
              <span v-if="errores.precio" class="form-field__err">{{ errores.precio }}</span>
            </div>

            <div class="form-field" :class="{ 'form-field--err': errores.stock }">
              <label class="form-field__label">Stock *</label>
              <input v-model.number="form.stock" type="number" min="0" class="form-field__input" placeholder="0" />
              <span v-if="errores.stock" class="form-field__err">{{ errores.stock }}</span>
            </div>
          </div>

          <!-- URL de imagen -->
          <div class="form-field">
            <label class="form-field__label">URL de imagen (opcional)</label>
            <input v-model.trim="form.imagen_url" type="url" class="form-field__input" placeholder="https://…" />
          </div>

          <!-- Destacado -->
          <label class="form-field__check">
            <input v-model="form.destacado" type="checkbox" />
            Marcar como producto destacado
          </label>

          <button class="btn-submit" :disabled="tienda.cargando" @click="handleSubmit">
            {{ tienda.cargando ? 'Guardando…' : '➕ Agregar producto' }}
          </button>
        </div>
      </section>

      <!-- ── Lista de productos actuales ──────────────────────────── -->
      <section class="admin-card">
        <h2 class="admin-card__title">Productos registrados ({{ tienda.totalProductos }})</h2>

        <div v-if="tienda.cargando && tienda.productos.length === 0" class="admin-loading">
          Cargando…
        </div>

        <table v-else class="admin-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Destacado</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="p in tienda.productos" :key="p.id">
              <td>{{ p.id }}</td>
              <td>{{ p.nombre }}</td>
              <td>${{ p.precio.toLocaleString('es-MX', { minimumFractionDigits: 2 }) }}</td>
              <td>{{ p.stock }}</td>
              <td>{{ p.destacado ? '⭐' : '—' }}</td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  </main>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import { useProductosStore }   from '@/stores/productosStore'

const tienda = useProductosStore()

// Formulario reactivo
const form = reactive({
  nombre:      '',
  descripcion: '',
  precio:      null,
  stock:       null,
  imagen_url:  '',
  destacado:   false,
})

// Errores locales
const errores = reactive({
  nombre: '', descripcion: '', precio: '', stock: '',
})

function validar() {
  errores.nombre      = form.nombre      ? '' : 'El nombre es obligatorio.'
  errores.descripcion = form.descripcion ? '' : 'La descripción es obligatoria.'
  errores.precio      = form.precio >= 0 ? '' : 'Ingresa un precio válido.'
  errores.stock       = Number.isInteger(form.stock) && form.stock >= 0
    ? '' : 'Ingresa un stock válido.'

  return !Object.values(errores).some(Boolean)
}

async function handleSubmit() {
  if (!validar()) return

  const ok = await tienda.agregarProducto({ ...form })

  if (ok) {
    // Limpiar formulario
    Object.assign(form, {
      nombre: '', descripcion: '', precio: null,
      stock: null, imagen_url: '', destacado: false,
    })
  }
}

onMounted(() => tienda.cargarProductos())
</script>

<style scoped>
.admin-page {
  min-height: calc(100vh - 64px);
  background: #f1f5f9;
  padding: 2rem 1rem;
}

.admin-page__inner {
  max-width: 860px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
}

.admin-page__title {
  font-size: 1.8rem;
  font-weight: 800;
  color: #0f172a;
  margin: 0;
}

/* Alertas */
.alert {
  padding: .8rem 1.1rem;
  border-radius: 9px;
  font-size: .9rem;
  font-weight: 500;
}
.alert--ok  { background: #dcfce7; color: #166534; border: 1px solid #bbf7d0; }
.alert--err { background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; }

/* Card */
.admin-card {
  background: #fff;
  border-radius: 14px;
  padding: 1.75rem;
  box-shadow: 0 4px 16px rgba(0,0,0,.07);
}

.admin-card__title {
  margin: 0 0 1.25rem;
  font-size: 1.1rem;
  font-weight: 700;
  color: #0f172a;
}

/* Formulario */
.admin-form { display: flex; flex-direction: column; gap: 1rem; }

.admin-form__row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }

.form-field { display: flex; flex-direction: column; gap: .3rem; }

.form-field__label { font-size: .83rem; font-weight: 600; color: #374151; }

.form-field__input {
  padding: .6rem .85rem;
  border: 1.5px solid #d1d5db;
  border-radius: 8px;
  font-size: .92rem;
  outline: none;
  transition: border .15s;
  font-family: inherit;
  width: 100%;
}
.form-field__input:focus { border-color: #2563eb; }
.form-field--err .form-field__input { border-color: #dc2626; }

.form-field__textarea { resize: vertical; min-height: 80px; }

.form-field__err { font-size: .77rem; color: #dc2626; }

.form-field__check {
  display: flex;
  align-items: center;
  gap: .5rem;
  font-size: .875rem;
  font-weight: 500;
  color: #374151;
  cursor: pointer;
}

.btn-submit {
  padding: .75rem;
  background: #16a34a;
  color: #fff;
  font-size: .95rem;
  font-weight: 700;
  border: none;
  border-radius: 9px;
  cursor: pointer;
  transition: background .15s;
  align-self: flex-start;
  min-width: 200px;
}
.btn-submit:hover:not(:disabled) { background: #15803d; }
.btn-submit:disabled { opacity: .6; cursor: not-allowed; }

/* Tabla */
.admin-table {
  width: 100%;
  border-collapse: collapse;
  font-size: .875rem;
}

.admin-table th,
.admin-table td {
  padding: .65rem .9rem;
  text-align: left;
  border-bottom: 1px solid #e2e8f0;
}

.admin-table th {
  background: #f8fafc;
  font-weight: 700;
  color: #475569;
  font-size: .78rem;
  text-transform: uppercase;
  letter-spacing: .05em;
}

.admin-table tr:hover td { background: #f8fafc; }

.admin-loading { color: #64748b; text-align: center; padding: 2rem; }
</style>
