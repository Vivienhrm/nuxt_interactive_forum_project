<template>
  <v-container>
    <!-- Cas : Utilisateur non autorisé -->
    <div v-if="!user || user.role !== 'admin'" class="d-flex flex-column align-center justify-center" style="min-height: 60vh;">
      <v-icon icon="mdi-shield-lock" size="100" color="error" class="mb-4"></v-icon>
      <h1 class="text-h3 font-weight-bold mb-2">Accès restreint</h1>
      <p class="text-h6 text-grey-darken-1 mb-6 text-center">
        Désolé, cette zone est réservée aux administrateurs du forum.<br>
        Vous n'avez pas les droits nécessaires pour accéder à cette page.
      </p>
      <v-btn to="/" color="primary" size="large" prepend-icon="mdi-home">
        Retour à l'accueil
      </v-btn>
    </div>

    <!-- Cas : Utilisateur autorisé (Admin) -->
    <v-row v-else>
      <v-col cols="12">
        <h1 class="text-h4 mb-6">Panneau d'administration</h1>

        <v-tabs v-model="tab" color="primary" class="mb-4">
          <v-tab value="users">Utilisateurs</v-tab>
          <v-tab value="forums">Forums</v-tab>
        </v-tabs>

        <v-window v-model="tab">
          <!-- Onglet Utilisateurs -->
          <v-window-item value="users">
            <v-card border>
              <v-table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nom d'utilisateur</th>
                    <th>Rôle</th>
                    <th>Date d'inscription</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="userItem in users" :key="userItem.id">
                    <td>{{ userItem.id }}</td>
                    <td>{{ userItem.username }}</td>
                    <td>
                      <v-chip :color="userItem.role === 'admin' ? 'red' : 'green'" size="small">
                        {{ userItem.role }}
                      </v-chip>
                    </td>
                    <td>{{ new Date(userItem.created_at).toLocaleDateString() }}</td>
                    <td>
                      <v-btn
                        size="small"
                        variant="text"
                        :color="userItem.role === 'admin' ? 'warning' : 'primary'"
                        @click="changeRole(userItem)"
                      >
                        {{ userItem.role === 'admin' ? 'Rétrograder User' : 'Promouvoir Admin' }}
                      </v-btn>
                    </td>
                  </tr>
                </tbody>
              </v-table>
            </v-card>
          </v-window-item>

          <!-- Onglet Forums -->
          <v-window-item value="forums">
            <v-card border>
              <v-card-text>
                <div class="d-flex align-center gap-4 mb-6 pt-4">
                  <v-text-field
                    v-model="newForumName"
                    label="Nom du nouveau forum"
                    hide-details
                    density="compact"
                    class="mr-4"
                  ></v-text-field>
                  <v-btn color="primary" @click="createForum" :loading="creatingForum">Ajouter</v-btn>
                </div>

                <v-list border rounded>
                  <v-list-item v-for="forum in forums" :key="forum.id">
                    <v-list-item-title>{{ forum.name }}</v-list-item-title>
                    <template v-slot:append>
                      <v-btn icon="mdi-pencil" variant="text" size="small"></v-btn>
                    </template>
                  </v-list-item>
                </v-list>
              </v-card-text>
            </v-card>
          </v-window-item>
        </v-window>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
const tab = ref('users')
const { user } = useAuth()

// Fetch des données (Nuxt gèrera les erreurs 403 si l'utilisateur n'est pas admin)
const { data: users, refresh: refreshUsers } = await useFetch('/api/admin/users')
const { data: forums, refresh: refreshForums } = await useFetch('/api/forums')

// Gestion Utilisateurs
async function changeRole(targetUser) {
  const newRole = targetUser.role === 'admin' ? 'user' : 'admin'
  if (!confirm(`Voulez-vous vraiment passer ${targetUser.username} en rôle ${newRole} ?`)) return
  
  try {
    await $fetch(`/api/admin/users/${targetUser.id}/role`, {
      method: 'PATCH',
      body: { role: newRole }
    })
    await refreshUsers()
  } catch (err) {
    alert(err.data?.statusMessage || 'Erreur lors du changement de rôle')
  }
}

// Gestion Forums
const newForumName = ref('')
const creatingForum = ref(false)
async function createForum() {
  if (!newForumName.value.trim()) return
  creatingForum.value = true
  try {
    await $fetch('/api/admin/forums', {
      method: 'POST',
      body: { name: newForumName.value }
    })
    newForumName.value = ''
    await refreshForums()
  } catch (err) {
    alert(err.data?.statusMessage || 'Erreur')
  } finally {
    creatingForum.value = false
  }
}
</script>
