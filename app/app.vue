<template>
  <v-app>
    <v-app-bar color="primary" elevation="2">
      <v-app-bar-title>
        <v-btn to="/" variant="plain" class="text-h6 text-none px-0">
          Interactive Forum
        </v-btn>
      </v-app-bar-title>
      
      <v-spacer></v-spacer>

      <v-btn to="/socket" icon="mdi-lan-connect" title="Test WebSockets" class="mr-2"></v-btn>

      <template v-if="user">
        <v-btn v-if="user.role === 'admin'" to="/admin" variant="text" prepend-icon="mdi-shield-crown" class="mr-2">
          Admin
        </v-btn>
        <span class="mr-4 text-subtitle-2">Bienvenue, {{ user.username }}</span>
        <v-btn @click="logout" color="white" variant="text">Déconnexion</v-btn>
      </template>
      <template v-else>
        <v-btn to="/login" variant="text">Connexion</v-btn>
        <v-btn to="/register" variant="outlined" class="ml-2">Inscription</v-btn>
      </template>
    </v-app-bar>

    <v-main>
      <NuxtPage />
    </v-main>

    <v-footer color="grey-lighten-4" class="text-center d-flex flex-column">
      <div class="px-4 py-2 text-grey">
        {{ new Date().getFullYear() }} — <strong>Nuxt Interactive Forum</strong>
      </div>
    </v-footer>
  </v-app>
</template>

<script setup>
const { user, fetchUser, logout } = useAuth()

onMounted(() => {
  fetchUser()
})
</script>
