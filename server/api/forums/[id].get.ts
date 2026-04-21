export default defineWrappedResponseHandler(async (event) => {
  const forumId = getRouterParam(event, 'id')

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

  const [topics]: any = await event.context.mysql.execute(`
    SELECT t.*, u.username as author_name 
    FROM topics t 
    JOIN users u ON t.author_id = u.id 
    WHERE t.forum_id = ? 
    ORDER BY t.created_at DESC
  `, [forumId])

  return {
    forum: forums[0],
    topics: topics
  }
})
