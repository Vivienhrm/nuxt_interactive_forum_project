export default defineWrappedResponseHandler(async (event) => {
  const [rows]: any = await event.context.mysql.execute('SELECT * FROM forums ORDER BY id ASC')
  return rows
})
