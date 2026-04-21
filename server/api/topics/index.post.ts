export default defineWrappedResponseHandler(async (event) => {
  const config = useRuntimeConfig()
  const session = await useSession(event, {
    password: config.sessionSecret,
    name: 'forum_session'
  })

  if (!session.data.user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Inscrivez-vous ou connectez-vous pour créer un sujet'
    })
  }

  const { title, content, forumId } = await readBody(event)

  if (!title || !content || !forumId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Tous les champs sont requis (titre, contenu, forumId)'
    })
  }

  const [topicResult]: any = await event.context.mysql.execute(
    'INSERT INTO topics (title, forum_id, author_id) VALUES (?, ?, ?)',
    [title, forumId, session.data.user.id]
  )

  const newTopicId = topicResult.insertId

  await event.context.mysql.execute(
    'INSERT INTO messages (content, topic_id, author_id) VALUES (?, ?, ?)',
    [content, newTopicId, session.data.user.id]
  )

  return {
    id: newTopicId,
    message: 'Sujet créé avec succès'
  }
})
