<script setup>
import Navbar from './components/Navbar.vue'
</script>

<template>
  <v-app>
    <Navbar />
    <v-main>
      <v-container class="mt-4" fluid>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'App',
})
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
}
</style>