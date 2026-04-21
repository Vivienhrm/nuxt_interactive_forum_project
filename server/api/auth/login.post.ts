import bcrypt from 'bcryptjs'

export default defineWrappedResponseHandler(async (event) => {
  const body = await readBody(event)
  const { username, password } = body

  const config = useRuntimeConfig()

  if (!username || !password) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Username and password are required',
    })
  }

  // Trouver l'utilisateur
  const [users]: any = await event.context.mysql.execute(
    'SELECT * FROM users WHERE username = ?',
    [username]
  )

  if (users.length === 0) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid credentials',
    })
  }

  const user = users[0]

  // Vérifier le mot de passe
  const isValid = await bcrypt.compare(password, user.password)

  if (!isValid) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid credentials',
    })
  }

  // Créer la session
  const session = await useSession(event, {
    password: config.sessionSecret,
    name: 'forum_session'
  })

  await session.update({
    user: {
      id: user.id,
      username: user.username,
      role: user.role
    }
  })

  return { 
    user: {
      id: user.id,
      username: user.username,
      role: user.role
    }
  }
})
