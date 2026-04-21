export default defineWrappedResponseHandler(async (event) => {
  const topicId = getRouterParam(event, 'id')
  const { page = 1, limit = 10 } = getQuery(event)
  const offset = (Number(page) - 1) * Number(limit)

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

  // 2. Compter le total de messages
  const [countResult]: any = await event.context.mysql.execute(
    'SELECT COUNT(*) as total FROM messages WHERE topic_id = ?',
    [topicId]
  )
  const total = countResult[0].total

  // 3. Récupérer les messages paginés
  const [messages]: any = await event.context.mysql.execute(`
    SELECT m.*, u.username as author_name, u.avatar_url
    FROM messages m
    JOIN users u ON m.author_id = u.id
    WHERE m.topic_id = ?
    ORDER BY m.created_at ASC
    LIMIT ? OFFSET ?
  `, [topicId, Number(limit), offset])

  return {
    topic: topics[0],
    messages: messages,
    total,
    page: Number(page),
    limit: Number(limit)
  }
})

