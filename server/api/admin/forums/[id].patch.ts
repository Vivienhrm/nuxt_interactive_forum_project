export default defineWrappedResponseHandler(async (event) => {
  const forumId = getRouterParam(event, 'id')
  
  const config = useRuntimeConfig()
  const session = await useSession(event, {
    password: config.sessionSecret,
    name: 'forum_session'
  })

  // Sécurité Admin
  if (!session.data.user || session.data.user.role !== 'admin') {
    throw createError({ statusCode: 403, statusMessage: 'Interdit' })
  }

  const { name } = await readBody(event)

  if (!name) {
    throw createError({ statusCode: 400, statusMessage: 'Le nom est requis' })
  }

  await event.context.mysql.execute(
    'UPDATE forums SET name = ? WHERE id = ?',
    [name, forumId]
  )

  return { success: true }
})
