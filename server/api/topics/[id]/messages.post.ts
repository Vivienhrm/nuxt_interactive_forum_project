import { broadcast } from '../../../utils/ws'

export default defineWrappedResponseHandler(async (event) => {

  const topicId = getRouterParam(event, 'id')
  
  const config = useRuntimeConfig()
  const session = await useSession(event, {
    password: config.sessionSecret,
    name: 'forum_session'
  })

  // Auth check
  if (!session.data.user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Vous devez être connecté pour répondre'
    })
  }

  const { content } = await readBody(event)

  if (!content) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Le contenu du message est vide'
    })
  }

  // Insérer le message
  const [result]: any = await event.context.mysql.execute(
    'INSERT INTO messages (content, topic_id, author_id) VALUES (?, ?, ?)',
    [content, topicId, session.data.user.id]
  )

  const newMessageId = result.insertId

  // On récupère les infos du message pour le broadcast (optionnel mais utile)
  const [newMessages]: any = await event.context.mysql.execute(`
    SELECT m.*, u.username as author_name
    FROM messages m
    JOIN users u ON m.author_id = u.id
    WHERE m.id = ?
  `, [newMessageId])

  // Broadcast WebSocket
  broadcast({
    type: 'new_message',
    topicId: parseInt(topicId as string),
    message: newMessages[0]
  })

  return {
    success: true,
    message: newMessages[0]
  }
})
