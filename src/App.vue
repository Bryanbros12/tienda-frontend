<template>
  <Navbar />
  <RouterView />
</template>

<script setup>
import { onMounted }       from 'vue'
import Navbar              from './components/Navbar.vue'
import { useSessionStore } from './stores/sessionStore.js'

const session = useSessionStore()

// Al arrancar la app, verificar si existe sesión activa en Flask
onMounted(() => session.verificarSesion())
</script>
