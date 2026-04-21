export default defineWrappedResponseHandler(async (event) => {
  const topicId = getRouterParam(event, 'id')
  
  const config = useRuntimeConfig()
  const session = await useSession(event, {
    password: config.sessionSecret,
    name: 'forum_session'
  })

  // Vérifier Admin
  if (!session.data.user || session.data.user.role !== 'admin') {
    throw createError({
      statusCode: 403,
      statusMessage: 'Action réservée aux administrateurs'
    })
  }

  const { locked } = await readBody(event)

  await event.context.mysql.execute(
    'UPDATE topics SET locked = ? WHERE id = ?',
    [locked ? 1 : 0, topicId]
  )

  // Notify via WS
  broadcast({
    type: 'topic_status',
    topicId: parseInt(topicId as string),
    locked: !!locked
  })

  return { success: true, locked: !!locked }
})
