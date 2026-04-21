import bcrypt from 'bcryptjs'

export default defineWrappedResponseHandler(async (event) => {
  const body = await readBody(event)
  const { username, password } = body

  if (!username || !password) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Username and password are required',
    })
  }

  // Vérifier si l'utilisateur existe déjà
  const [existing]: any = await event.context.mysql.execute(
    'SELECT * FROM users WHERE username = ?',
    [username]
  )

  if (existing.length > 0) {
    throw createError({
      statusCode: 409,
      statusMessage: 'Username already taken',
    })
  }

  // Hasher le mot de passe
  const hashedPassword = await bcrypt.hash(password, 10)

  // Insérer l'utilisateur
  await event.context.mysql.execute(
    'INSERT INTO users (username, password) VALUES (?, ?)',
    [username, hashedPassword]
  )

  return { message: 'User registered successfully' }
})
