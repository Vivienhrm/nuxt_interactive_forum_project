export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const session = await useSession(event, {
    password: config.sessionSecret,
    name: 'forum_session'
  })

  return {
    user: session.data.user || null
  }
})
