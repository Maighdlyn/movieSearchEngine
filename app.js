const express = require('express')
const app = express()
const path = require('path')
const queries = require('./database/queries.js')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const queryIMDB = require('./queryIMDB.js')

app.use(express.static(path.join(__dirname, 'public')))
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: false}))
app.use(cookieParser())
app.use(session({
  secret: "Don't tell",
  cookie: {
    maxAge: 60 * 60 * 1000 //one hour
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

app.post('/', (req, res) => {
  queries.checkEmail(req.body.email)
    .then((data) => {
      if(data.password === req.body.password){
        req.session.userid = data.id
        res.redirect('/')
      }
    })
})

let searchTerm = {
  title: '',
  search: [],
  img:''
}

app.get('/home', (req, res) => {
  if(req.session.userid){
        res.render('home', searchTerm)
  } else {
    res.redirect('/')
  }
})

app.post('/home', (req, res) => {
  searchTerm.title = req.body.search
  queries.addToHistory(req.session.userid, searchTerm.title)
  queryIMDB(searchTerm.title)
    .then((data) => {
      searchTerm.search = data.movies
      searchTerm.img = data.img
      res.redirect('/home')
    })
})

app.get('/logout', (req, res) => {
  req.session.destroy()
  searchTerm.title = ''
  searchTerm.search = []
  searchTerm.img = ''
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
  if(req.session.userid){
    queries.historyById(req.session.userid)
      .then((data) => {
        res.render('searchHistory', {
          history: data
        })
        console.log('line 93:', data)
      })
  } else {
    res.redirect('/')
  }



})

const port = 3000
app.listen(port, () => {
  console.log('Express server is listening on port', port)
})
