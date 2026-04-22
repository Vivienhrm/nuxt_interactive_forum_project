export default defineWrappedResponseHandler(async (event) => {
  const targetUserId = getRouterParam(event, 'id')
  
  const config = useRuntimeConfig()
  const session = await useSession(event, {
    password: config.sessionSecret,
    name: 'forum_session'
  })

  // Sécurité Admin
  if (!session.data.user || session.data.user.role !== 'admin') {
    throw createError({ statusCode: 403, statusMessage: 'Interdit' })
  }

  const { role } = await readBody(event)

  if (!['user', 'admin'].includes(role)) {
    throw createError({ statusCode: 400, statusMessage: 'Rôle invalide' })
  }

  // Empêcher de se rétrograder soi-même par erreur
  if (parseInt(targetUserId as string) === session.data.user.id && role !== 'admin') {
     throw createError({ statusCode: 400, statusMessage: 'Vous ne pouvez pas retirer vos propres droits admin' })
  }

  await event.context.mysql.execute(
    'UPDATE users SET role = ? WHERE id = ?',
    [role, targetUserId]
  )

  return { success: true }
})
