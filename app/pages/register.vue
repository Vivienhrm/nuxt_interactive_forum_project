<template>
  <v-container class="fill-height">
    <v-row justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="elevation-12 pa-4">
          <v-card-title class="text-h5 text-center mb-4">Inscription</v-card-title>
          <v-card-text>
            <v-form @submit.prevent="handleRegister" v-model="valid">
              <v-text-field
                v-model="form.username"
                label="Nom d'utilisateur"
                prepend-inner-icon="mdi-account"
                required
                :rules="usernameRules"
              ></v-text-field>

              <v-text-field
                v-model="form.password"
                label="Mot de passe"
                prepend-inner-icon="mdi-lock"
                type="password"
                required
                :rules="passwordRules"
              ></v-text-field>

              <v-text-field
                v-model="form.confirmPassword"
                label="Confirmer le mot de passe"
                prepend-inner-icon="mdi-lock-check"
                type="password"
                required
                :rules="confirmRules"
              ></v-text-field>

              <v-alert v-if="error" type="error" class="mb-4" density="compact">
                {{ error }}
              </v-alert>

              <v-btn
                type="submit"
                color="secondary"
                block
                size="large"
                :loading="loading"
                :disabled="!valid"
              >
                Créer un compte
              </v-btn>
            </v-form>
          </v-card-text>
          <v-card-actions class="justify-center">
            <span>Déjà inscrit ?</span>
            <v-btn variant="text" color="primary" to="/login">Se connecter</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
const { register } = useAuth()
const valid = ref(false)
const loading = ref(false)
const error = ref('')

const form = reactive({
  username: '',
  password: '',
  confirmPassword: ''
})

const usernameRules = [
  v => !!v || 'Requis',
  v => v.length >= 3 || 'Min 3 caractères'
]

const passwordRules = [
  v => !!v || 'Requis',
  v => v.length >= 6 || 'Min 6 caractères'
]

const confirmRules = [
  v => !!v || 'Requis',
  v => v === form.password || 'Les mots de passe ne correspondent pas'
]

async function handleRegister() {
  loading.value = true
  error.value = ''
  try {
    await register({ username: form.username, password: form.password })
    // Après inscription réussie, redirection vers login ou auto-login?
    // On va rediriger vers login pour cet exemple
    navigateTo('/login')
  } catch (err) {
    error.value = err.data?.statusMessage || 'Erreur lors de l\'inscription'
  } finally {
    loading.value = false
  }
}
</script>
