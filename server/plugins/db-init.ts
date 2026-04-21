import mysql from 'mysql2/promise'
import bluebird from 'bluebird'
import bcrypt from 'bcryptjs'

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
      await connection.query('CREATE DATABASE IF NOT EXISTS forum')
      await connection.query('USE forum')

      console.log('[db-init] Base de données "forum" prête. Création des tables...')


      // Table UTILISATEURS
      await connection.query(`
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
      await connection.query(`
        CREATE TABLE IF NOT EXISTS forums (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `)

      // Table SUJETS
      await connection.query(`
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
      await connection.query(`
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
      const [userRows]: any = await connection.query('SELECT * FROM users WHERE username = "admin"')
      if (userRows.length === 0) {
        console.log('[db-init] Création du compte admin par défaut...')
        const hashedPassword = await bcrypt.hash('admin', 10)
        await connection.query(
          'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
          ['admin', hashedPassword, 'admin']
        )
      } else {
        // Optionnel : s'équiper d'une protection si admin existe en texte clair
        const user = userRows[0]
        if (user.password === 'admin') {
          console.log('[db-init] Mise à jour du mot de passe admin (hashage)...')
          const hashedPassword = await bcrypt.hash('admin', 10)
          await connection.query(
            'UPDATE users SET password = ? WHERE id = ?',
            [hashedPassword, user.id]
          )
        }
      }

      // Création de quelques FORUMS par défaut
      const [forumRows]: any = await connection.query('SELECT * FROM forums')
      if (forumRows.length === 0) {
        console.log('[db-init] Création des forums par défaut...')
        const defaultForums = ['Général', 'Développement Web', 'Jeux Vidéo', 'Hardware']
        for (const forum of defaultForums) {
          await connection.query('INSERT INTO forums (name) VALUES (?)', [forum])
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
