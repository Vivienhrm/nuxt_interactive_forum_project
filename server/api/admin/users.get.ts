export default defineWrappedResponseHandler(async (event) => {
  const config = useRuntimeConfig()
  const session = await useSession(event, {
    password: config.sessionSecret,
    name: 'forum_session'
  })

  // Vérification STRICTE Admin
  if (!session.data.user || session.data.user.role !== 'admin') {
    throw createError({
      statusCode: 403,
      statusMessage: 'Accès interdit : Administrateurs uniquement'
    })
  }

  // Récupérer tous les utilisateurs
  const [users]: any = await event.context.mysql.execute(
    'SELECT id, username, role, created_at FROM users ORDER BY created_at DESC'
  )

  return users
})
