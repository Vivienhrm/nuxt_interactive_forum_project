export default defineWrappedResponseHandler(async (event) => {
  const config = useRuntimeConfig()
  const session = await useSession(event, {
    password: config.sessionSecret,
    name: 'forum_session'
  })

  if (!session.data.user || session.data.user.role !== 'admin') {
    throw createError({ statusCode: 403, statusMessage: 'Interdit' })
  }

  const { name } = await readBody(event)

  if (!name) {
    throw createError({ statusCode: 400, statusMessage: 'Le nom du forum est requis' })
  }

  const [result]: any = await event.context.mysql.execute(
    'INSERT INTO forums (name) VALUES (?)',
    [name]
  )

  return { id: result.insertId, name }
})
