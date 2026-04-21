<template>
  <v-container>
    <!-- Fil d'Ariane / Titre -->
    <v-row>
      <v-col cols="12">
        <v-btn to="/" variant="text" prepend-icon="mdi-arrow-left" class="mb-4">
          Retour aux forums
        </v-btn>
        <div class="d-flex align-center justify-space-between mb-6">
          <h1 class="text-h4" v-if="data">{{ data.forum.name }}</h1>
          <v-btn v-if="isAuthenticated" color="primary" @click="dialog = true">
            Nouveau sujet
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <!-- Liste des Sujets -->
    <v-row v-if="pending">
      <v-col cols="12" class="text-center">
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
      </v-col>
    </v-row>

    <v-row v-else-if="data?.topics.length === 0">
      <v-col cols="12">
        <v-alert type="info">Aucun sujet pour le moment. Soyez le premier à en créer un !</v-alert>
      </v-col>
    </v-row>

    <v-row v-else>
      <v-col cols="12">
        <v-list border rounded>
          <template v-for="(topic, index) in data.topics" :key="topic.id">
            <v-list-item :to="`/topic/${topic.id}`" class="py-3">
              <template v-slot:prepend>
                <v-avatar color="primary" variant="tonal">
                  <v-icon icon="mdi-chat-question"></v-icon>
                </v-avatar>
              </template>

              <v-list-item-title class="text-h6 font-weight-bold">
                {{ topic.title }}
              </v-list-item-title>
              
              <v-list-item-subtitle>
                Par <strong>{{ topic.author_name }}</strong> le {{ new Date(topic.created_at).toLocaleDateString() }}
              </v-list-item-subtitle>

              <template v-slot:append>
                <v-icon v-if="topic.locked" color="grey" icon="mdi-lock"></v-icon>
                <v-icon icon="mdi-chevron-right"></v-icon>
              </template>
            </v-list-item>
            <v-divider v-if="index < data.topics.length - 1"></v-divider>
          </template>
        </v-list>

        <!-- Pagination -->
        <div class="text-center mt-6">
          <v-pagination
            v-model="page"
            :length="Math.ceil(data.total / data.limit)"
            :total-visible="7"
            @update:model-value="refresh"
          ></v-pagination>
        </div>
      </v-col>
    </v-row>

    <!-- Dialogue Nouveau Sujet -->
    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title>Créer un nouveau sujet</v-card-title>
        <v-card-text>
          <v-form @submit.prevent="createTopic" ref="formRef">
            <v-text-field
              v-model="newTopic.title"
              label="Titre du sujet"
              required
              :rules="[v => !!v || 'Requis']"
            ></v-text-field>
            <v-textarea
              v-model="newTopic.content"
              label="Votre message"
              required
              rows="5"
              :rules="[v => !!v || 'Requis']"
            ></v-textarea>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="dialog = false">Annuler</v-btn>
          <v-btn color="primary" :loading="creating" @click="createTopic">Créer</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
const route = useRoute()
const page = ref(1)
const { isAuthenticated } = useAuth()
const { data, pending, refresh } = await useFetch(() => `/api/forums/${route.params.id}?page=${page.value}`)

const dialog = ref(false)
const creating = ref(false)
const newTopic = reactive({
  title: '',
  content: '',
  forumId: route.params.id
})

async function createTopic() {
  if (!newTopic.title || !newTopic.content) return
  
  creating.value = true
  try {
    const res = await $fetch('/api/topics', {
      method: 'POST',
      body: newTopic
    })
    dialog.value = false
    newTopic.title = ''
    newTopic.content = ''
    await refresh()
  } catch (err) {
    alert(err.data?.statusMessage || 'Erreur lors de la création')
  } finally {
    creating.value = false
  }
}
</script>
