const http = require('http')
const cheerio = require('cheerio')
const nodeInput = process.argv[2]
const rp = require('request-promise')
const express = require('express')
const app = express()

function queryIMDB(search) {

  const options = {
    uri: 'http://www.imdb.com/find?ref_=nv_sr_fn&q='+search+'&s=all',
    transform: function (body) {
      return cheerio.load(body)
    }
  }
  return rp(options)
    .then(function($) {
      const moviesArray = $('.findSection')
        .first()
        .find('.result_text a')
        .map((i,element) => $(element).text())
        .toArray()
      const yearsArray = $('.findSection')
        .first()
        .find('.result_text')
        .map((i,element) => $(element).text().slice(moviesArray[i].length + 2, moviesArray[i].length + 8))
        .toArray()
      const imgArray = $('.findSection')
        .first()
        .find('img')
        .map((i,element) => $(element)[0].attribs.src)
        .toArray()

      let output = {"movies": []}
      for (i=0; i<moviesArray.length; i++) {
        let movieObject = {}
        movieObject.name = moviesArray[i]
        movieObject.year = yearsArray[i]
        movieObject.img = imgArray[i]
        output.movies.push(movieObject)
      }
      return output
    })
    .catch(function (err) {
      console.log("There's an ERROR!!!")
    })

}

module.exports = queryIMDB
