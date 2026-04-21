export default defineWrappedResponseHandler(async (event) => {
  const forumId = getRouterParam(event, 'id')
  const { page = 1, limit = 10 } = getQuery(event)
  const offset = (Number(page) - 1) * Number(limit)

  // 1. Récupérer les infos du forum
  const [forums]: any = await event.context.mysql.execute(
    'SELECT * FROM forums WHERE id = ?',
    [forumId]
  )

  if (forums.length === 0) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Forum non trouvé'
    })
  }

  // 2. Compter le total de sujets
  const [countResult]: any = await event.context.mysql.execute(
    'SELECT COUNT(*) as total FROM topics WHERE forum_id = ?',
    [forumId]
  )
  const total = countResult[0].total

  // 3. Récupérer les sujets paginés
  const [topics]: any = await event.context.mysql.execute(`
    SELECT t.*, u.username as author_name 
    FROM topics t 
    JOIN users u ON t.author_id = u.id 
    WHERE t.forum_id = ? 
    ORDER BY t.created_at DESC
    LIMIT ? OFFSET ?
  `, [forumId, Number(limit), offset])

  return {
    forum: forums[0],
    topics: topics,
    total: total,
    limit: Number(limit),
    page: Number(page)
  }
})
