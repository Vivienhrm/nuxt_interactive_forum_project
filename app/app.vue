<template>
  <v-app>
    <v-app-bar color="primary" elevation="2">
      <v-app-bar-title>
        <v-btn to="/" variant="plain" class="text-h6 text-none px-0">
          Interactive Forum
        </v-btn>
      </v-app-bar-title>
      
      <v-spacer></v-spacer>

      <v-btn to="/socket" icon="mdi-lan-connect" title="Test WebSockets"></v-btn>
      <v-btn to="/login" variant="text">Connexion</v-btn>
      <v-btn to="/register" variant="outlined" class="ml-2">Inscription</v-btn>
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


