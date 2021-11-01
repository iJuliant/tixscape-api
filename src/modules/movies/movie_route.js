const express = require('express')
const movie = express.Router()
const controller = require('./movie_controller')
const uploads = require('../../middlewares/uploads')

movie.get('/', controller.getAllMovie)

movie.get('/id/:id', controller.getMovieById)

movie.get('/month/:month', controller.getMoviePerMonth)

movie.post(
  '/',
  uploads,
  controller.createMovie
)

movie.delete(
  '/:id',
  controller.deleteMovie
)

movie.patch(
  '/:id',
  uploads,
  controller.updateMovie

)

module.exports = movie
