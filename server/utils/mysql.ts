import mysql from 'mysql2/promise'
import bluebird from 'bluebird'
import type { EventHandler, EventHandlerRequest } from 'h3'

export const defineWrappedResponseHandler = <T extends EventHandlerRequest, D>(
  handler: EventHandler<T, D>
): EventHandler<T, D> =>
  defineEventHandler<T>(async event => {
    try {
      const config = useRuntimeConfig()
      const connection = await mysql.createConnection({
        host: config.dbHost,
        user: config.dbUser,
        password: config.dbPassword,
        database: config.dbName,
        Promise: bluebird,
      })
      event.context.mysql = connection
      const response = await handler(event)
      await event.context.mysql.end()
      return response
    } catch (err: any) {
      // Si c'est déjà une erreur H3 (ex: via createError), on la laisse passer
      if (err.statusCode) {
        throw err
      }
      
      console.error('[mysql error]', err)
      throw createError({
        statusCode: 500,
        statusMessage: 'Internal Server Error (Database)',
        data: err.message
      })
    }
  })
