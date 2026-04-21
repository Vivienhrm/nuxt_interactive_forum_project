<template>
  <v-container>
    <!-- Header -->
    <v-row v-if="data">
      <v-col cols="12">
        <v-btn :to="`/forum/${data.topic.forum_id}`" variant="text" prepend-icon="mdi-arrow-left" class="mb-4">
          Retour au forum {{ data.topic.forum_name }}
        </v-btn>
        <h1 class="text-h4 mb-2">{{ data.topic.title }}</h1>
        <div class="text-subtitle-1 text-grey mb-6">
          Sujet ouvert par <strong>{{ data.topic.author_name }}</strong> le {{ new Date(data.topic.created_at).toLocaleDateString() }}
        </div>
      </v-col>
    </v-row>

    <!-- Loading -->
    <v-row v-if="pending">
      <v-col cols="12" class="text-center">
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
      </v-col>
    </v-row>

    <!-- Messages List -->
    <v-row v-else>
      <v-col cols="12">
        <v-card v-for="(msg, index) in data.messages" :key="msg.id" class="mb-4" border elevation="1">
          <v-card-text>
            <v-row no-gutters>
              <!-- Info Auteur -->
              <v-col cols="12" sm="3" class="border-sm-right pr-4 mb-4 mb-sm-0">
                <div class="d-flex flex-column align-center">
                  <v-avatar color="primary" size="64" class="mb-2">
                    <v-img v-if="msg.avatar_url" :src="msg.avatar_url"></v-img>
                    <v-icon v-else icon="mdi-account"></v-icon>
                  </v-avatar>
                  <div class="font-weight-bold">{{ msg.author_name }}</div>
                  <div class="text-caption text-grey">Membre</div>
                </div>
              </v-col>

              <!-- Contenu Message -->
              <v-col cols="12" sm="9" class="pl-sm-4">
                <div class="text-caption text-grey mb-2 d-flex justify-space-between">
                  <span>Posté le {{ new Date(msg.created_at).toLocaleString() }}</span>
                  <span>#{{ index + 1 }}</span>
                </div>
                <div class="text-body-1" style="white-space: pre-wrap;">{{ msg.content }}</div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Formulaire de réponse -->
    <v-row v-if="isAuthenticated">
      <v-col cols="12">
        <v-card class="pa-4" border>
          <v-card-title>Votre réponse</v-card-title>
          <v-card-text>
            <v-textarea
              v-model="replyContent"
              label="Tapez votre message ici..."
              rows="4"
              variant="outlined"
              hide-details
              class="mb-4"
            ></v-textarea>
            <div class="d-flex justify-end">
              <v-btn color="primary" :loading="sending" @click="sendReply">Répondre</v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row v-else>
      <v-col cols="12">
        <v-alert type="info" variant="tonal">
          Vous devez être <NuxtLink to="/login" class="font-weight-bold">connecté</NuxtLink> pour répondre à ce sujet.
        </v-alert>
      </v-col>
    </v-row>

    <!-- Notification nouveau message -->
    <v-snackbar v-model="wsNotification" color="success" location="top">
      Un nouveau message vient d'être posté !
      <template v-slot:actions>
        <v-btn variant="text" @click="wsNotification = false">Fermer</v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script setup>
const route = useRoute()
const { isAuthenticated } = useAuth()
const { data, pending, refresh } = await useFetch(`/api/topics/${route.params.id}`)

const replyContent = ref('')
const sending = ref(false)
const wsNotification = ref(false)

async function sendReply() {
  if (!replyContent.value.trim()) return
  
  sending.value = true
  try {
    await $fetch(`/api/topics/${route.params.id}/messages`, {
      method: 'POST',
      body: { content: replyContent.value }
    })
    replyContent.value = ''
    await refresh()
  } catch (err) {
    alert(err.data?.statusMessage || 'Erreur lors de l\'envoi')
  } finally {
    sending.value = false
  }
}

// Gestion WebSocket
if (import.meta.client) {
  const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws'
  const ws = new WebSocket(`${protocol}://${window.location.host}/_ws`)

  ws.onmessage = (event) => {
    const message = JSON.parse(event.data)
    if (message.type === 'new_message' && message.topicId === parseInt(route.params.id)) {
      wsNotification.value = true
      refresh() // On rafraîchit pour voir le nouveau message
    }
  }

  onUnmounted(() => {
    ws.close()
  })
}
</script>
