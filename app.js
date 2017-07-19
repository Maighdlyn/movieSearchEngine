const express = require('express')
const app = express()
const path = require('path')
const queries = require('./database/queries.js')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const session = require('express-session')

app.use(express.static(path.join(__dirname, 'public')))
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: false}))
app.use(cookieParser())
app.use(session({
  secret: "Don't tell",
  cookie: {
    maxAge: 30 * 60 * 1000 //30 minutes
  }
}))

app.get('/', (req, res) =>
  {
    if (req.session.userid){
      res.redirect('/home')
    } else {
      res.render('login.ejs')
    }
  })

app.get('/home', (req, res) => {
  res.render('home.ejs')
})

app.get('/logout', (req, res) => {
  req.session.destroy()
  res.redirect('/')
})

app.get('/signup', (req, res) => {
  res.render('signup')
})

app.post('/signup', (req, res) => {
  if(req.body.password === req.body.confirm) {
    queries.addUser(req.body.name, req.body.email, req.body.password)
      .then((data) => {
        req.session.userid = data.id
        res.redirect('/')
      })
  }
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
