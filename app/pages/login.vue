<template>
  <v-container class="fill-height">
    <v-row justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="elevation-12 pa-4">
          <v-card-title class="text-h5 text-center mb-4">Connexion</v-card-title>
          <v-card-text>
            <v-form @submit.prevent="handleLogin" v-model="valid">
              <v-text-field
                v-model="form.username"
                label="Nom d'utilisateur"
                prepend-inner-icon="mdi-account"
                required
                :rules="[v => !!v || 'Requis']"
              ></v-text-field>

              <v-text-field
                v-model="form.password"
                label="Mot de passe"
                prepend-inner-icon="mdi-lock"
                type="password"
                required
                :rules="[v => !!v || 'Requis']"
              ></v-text-field>

              <v-alert v-if="error" type="error" class="mb-4" density="compact">
                {{ error }}
              </v-alert>

              <v-btn
                type="submit"
                color="primary"
                block
                size="large"
                :loading="loading"
                :disabled="!valid"
              >
                Se connecter
              </v-btn>
            </v-form>
          </v-card-text>
          <v-card-actions class="justify-center">
            <span>Pas encore de compte ?</span>
            <v-btn variant="text" color="primary" to="/register">S'inscrire</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
const { login } = useAuth()
const valid = ref(false)
const loading = ref(false)
const error = ref('')

const form = reactive({
  username: '',
  password: ''
})

async function handleLogin() {
  loading.value = true
  error.value = ''
  try {
    await login(form)
    navigateTo('/')
  } catch (err) {
    error.value = err.data?.statusMessage || 'Identifiants invalides'
  } finally {
    loading.value = false
  }
}
</script>
