const express = require('express')
const app = express()
const path = require('path')

app.use(express.static(path.join(__dirname, 'public')))
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
  // res.render('home')
  res.render('login.ejs')
})

app.get('/history', (req, res) => {
  res.render('searchHistory')
})

app.get('/results', (req, res) => {
  res.render('searchResults')
})

const port = 3000
app.listen(port, () => {
  console.log('Express server is listening on port', port)
})
