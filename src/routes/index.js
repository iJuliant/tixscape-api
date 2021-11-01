const express = require('express')
const Route = express.Router()

// import module router
const movieRouter = require('../modules/movies/movie_route')

Route.use('/movie/', movieRouter)

module.exports = Route
