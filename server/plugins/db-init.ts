import mysql from 'mysql2/promise'
import bluebird from 'bluebird'

export default defineNitroPlugin(async (nitroApp) => {
  console.log('[db-init] Démarrage de l\'initialisation...')

  const setupDb = async () => {
    let connection;
    try {
      const config = useRuntimeConfig()
      connection = await mysql.createConnection({
        host: config.dbHost,
        user: config.dbUser,
        password: config.dbPassword,
        Promise: bluebird,
      })

      console.log('[db-init] Connexion au serveur MySQL... OK')
      
      // Création de la DB
      await connection.execute('CREATE DATABASE IF NOT EXISTS forum')
      await connection.execute('USE forum')

      console.log('[db-init] Base de données "forum" prête. Création des tables...')


      // Table UTILISATEURS
      await connection.execute(`
        CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          username VARCHAR(255) NOT NULL UNIQUE,
          password VARCHAR(255) NOT NULL,
          role ENUM('user', 'admin') DEFAULT 'user',
          avatar_url VARCHAR(255) NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `)

      // Table FORUMS
      await connection.execute(`
        CREATE TABLE IF NOT EXISTS forums (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `)

      // Table SUJETS
      await connection.execute(`
        CREATE TABLE IF NOT EXISTS topics (
          id INT AUTO_INCREMENT PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          forum_id INT NOT NULL,
          author_id INT NOT NULL,
          locked BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (forum_id) REFERENCES forums(id) ON DELETE CASCADE,
          FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
        )
      `)

      // Table MESSAGES
      await connection.execute(`
        CREATE TABLE IF NOT EXISTS messages (
          id INT AUTO_INCREMENT PRIMARY KEY,
          content TEXT NOT NULL,
          topic_id INT NOT NULL,
          author_id INT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE CASCADE,
          FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
        )
      `)

      // Création du compte ADMIN par défaut
      const [userRows]: any = await connection.execute('SELECT * FROM users WHERE username = "admin"')
      if (userRows.length === 0) {
        console.log('[db-init] Création du compte admin par défaut...')
        // Note: Dans une vraie app on hasherait le mot de passe, on verra ça à l'étape Auth
        await connection.execute(
          'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
          ['admin', 'admin', 'admin']
        )
      }

      // Création de quelques FORUMS par défaut
      const [forumRows]: any = await connection.execute('SELECT * FROM forums')
      if (forumRows.length === 0) {
        console.log('[db-init] Création des forums par défaut...')
        const defaultForums = ['Général', 'Développement Web', 'Jeux Vidéo', 'Hardware']
        for (const forum of defaultForums) {
          await connection.execute('INSERT INTO forums (name) VALUES (?)', [forum])
        }
      }

      console.log('[db-init] Initialisation terminée avec succès !')
    } catch (err) {
      console.error('[db-init] Erreur lors de l\'initialisation :', err)
    } finally {
      if (connection) await connection.end()
    }
  }

  // On lance l'init
  await setupDb()
})
