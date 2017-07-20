const pgPromise = require('pg-promise')
const pgp = pgPromise()
const db = pgp({
  database: 'moviesdb'
})

const queries = {
  addUser: (name, email, password) => {
    return db.one('INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING (id)', [name, email, password])
  },
  checkEmail: (email) => {
    return db.one('SELECT * FROM users WHERE email=$1', [email])
  },
  historyById: (user_id) => {
    return db.any('SELECT * FROM history WHERE user_id=$1', [user_id])
  },
  addToHistory: (user_id, movie) => {
    return db.none('INSERT INTO history (user_id, movie) VALUES ($1, $2)', [user_id, movie])
  },
}

module.exports = queries
