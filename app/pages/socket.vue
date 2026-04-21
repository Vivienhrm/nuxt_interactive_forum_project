<script setup>
let ws
const messages = ref([])

// Fonction de connexion au serveur WebSocket
const connect = async () => {
  // En HTTP, le protocole ws:// est utilisé. En HTTPS, il est nécessaire d'utiliser le protocole wss://.
  const isSecure = location.protocol === "https:";
  const url = (isSecure ? "wss://" : "ws://") + location.host + "/_ws";
  
  if (ws) {
    // Déjà connecté, on ferme la connexion existante
    ws.close();
  }
  
  // Connexion au serveur
  console.log("Connexion à", url, "...");
  ws = new WebSocket(url);
  
  // Ajout d'un listener pour être notifié lorsque le serveur nous envoie un message
  ws.addEventListener("message", (event) => {
    const message = event.data
    console.log(message);
    messages.value.push(message)
  });
  
  // On attend d'être connecté
  await new Promise((resolve) => ws.addEventListener("open", resolve));
  console.log("ws connecté!");
};

const ping = () => {
  if (ws && ws.readyState === WebSocket.OPEN) {
    console.log("ws envoi ping");
    ws.send("ping");
  } else {
    console.log("ws non connecté");
  }
};
</script>

<template>
  <v-container>
    <v-card class="pa-4">
      <v-card-title>Test WebSocket</v-card-title>
      <v-card-text>
        <div>Messages reçus: {{ messages }}</div>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" @click="connect">Connecter</v-btn>
        <v-btn color="secondary" @click="ping">Ping</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>
