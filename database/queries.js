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
  selectById: (id) => {
    return db.one('SELECT * FROM users WHERE id=$1', [id])
  }
}

module.exports = queries
