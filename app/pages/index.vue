<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h3 mb-6">Bienvenue sur le Forum Interactif</h1>
      </v-col>
    </v-row>

    <v-row v-if="pending">
      <v-col cols="12" class="text-center">
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
      </v-col>
    </v-row>

    <v-row v-else>
      <v-col v-for="forum in forums" :key="forum.id" cols="12" md="6">
        <v-card class="mx-auto" elevation="2" border>
          <v-card-item>
            <v-card-title>
              <v-icon icon="mdi-forum" start color="primary"></v-icon>
              {{ forum.name }}
            </v-card-title>
            <v-card-subtitle>
              Explores les sujets de cette catégorie
            </v-card-subtitle>
          </v-card-item>

          <v-card-actions>
            <v-btn color="primary" variant="tonal" :to="`/forum/${forum.id}`">
              Voir les sujets
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-snackbar v-model="errorSnackbar" color="error" timeout="3000">
      Une erreur est survenue lors du chargement des forums.
    </v-snackbar>
  </v-container>
</template>

<script setup>
const { data: forums, pending, error } = await useFetch('/api/forums')

const errorSnackbar = ref(false)
watch(error, (newVal) => {
  if (newVal) errorSnackbar.value = true
})
</script>

<style scoped>
.v-card {
  transition: transform 0.2s ease-in-out;
}
.v-card:hover {
  transform: translateY(-5px);
}
</style>
