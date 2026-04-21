export default defineWrappedResponseHandler(async (event) => {
  const topicId = getRouterParam(event, 'id')

  // 1. Récupérer le sujet
  const [topics]: any = await event.context.mysql.execute(`
    SELECT t.*, u.username as author_name, f.name as forum_name
    FROM topics t
    JOIN users u ON t.author_id = u.id
    JOIN forums f ON t.forum_id = f.id
    WHERE t.id = ?
  `, [topicId])

  if (topics.length === 0) {
    throw createError({
        statusCode: 404,
        statusMessage: 'Sujet non trouvé'
    })
  }

  // 2. Récupérer tous les messages liés
  const [messages]: any = await event.context.mysql.execute(`
    SELECT m.*, u.username as author_name, u.avatar_url
    FROM messages m
    JOIN users u ON m.author_id = u.id
    WHERE m.topic_id = ?
    ORDER BY m.created_at ASC
  `, [topicId])

  return {
    topic: topics[0],
    messages: messages
  }
})
