export default defineWrappedResponseHandler(async (event) => {
  const messageId = getRouterParam(event, 'id')
  
  const config = useRuntimeConfig()
  const session = await useSession(event, {
    password: config.sessionSecret,
    name: 'forum_session'
  })

  if (!session.data.user) {
    throw createError({ statusCode: 401, statusMessage: 'Non authentifié' })
  }

  // 1. Récupérer le message pour vérifier l'auteur
  const [messages]: any = await event.context.mysql.execute(
    'SELECT * FROM messages WHERE id = ?',
    [messageId]
  )

  if (messages.length === 0) {
    throw createError({ statusCode: 404, statusMessage: 'Message non trouvé' })
  }

  const message = messages[0]

  // 2. Vérifier les droits (Admin ou Auteur)
  const isAdmin = session.data.user.role === 'admin'
  const isAuthor = session.data.user.id === message.author_id

  if (!isAdmin && !isAuthor) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Vous n\'avez pas la permission de supprimer ce message'
    })
  }

  // 3. Supprimer
  await event.context.mysql.execute('DELETE FROM messages WHERE id = ?', [messageId])

  // WebSocket broadcast to refresh clients
  broadcast({
    type: 'message_deleted',
    topicId: message.topic_id,
    messageId: parseInt(messageId as string)
  })

  return { success: true }
})
