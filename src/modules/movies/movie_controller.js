const fs = require('fs')
const deleter = require('../../helpers/deleter')
const model = require('./movie_model')
const path = require('path')
const wrapper = require('../../helpers/wrapper')
const { v4: uuidv4 } = require('uuid')

module.exports = {

  getAllMovie: async (req, res) => {
    try {
      let { page, lim, order, search } = req.query

      page = +page || 1
      lim = +lim || 5
      order = order || 'movie_release_date ASC'
      search = search || '%'

      const offset = page * lim - lim
      const totalData = await model.countData(search)
      const totalPage = Math.ceil(totalData / lim)
      const pageInfo = { page, totalPage, lim, totalData }

      const result = await model.getAllMovies(lim, offset, search, order)

      return wrapper.response(res, 200, 'Success getting all movies', result, pageInfo)
    } catch (error) {
      console.log(error)
      return wrapper.response(res, 400, 'Bad request', error)
    }
  },

  getMovieById: async (req, res) => {
    try {
      const { id } = req.params
      const result = await model.getMovieByCondition({ movie_id: id })

      result.length > 0
        ? (wrapper.response(res, 200, 'Success getting movie by id', result))
        : (wrapper.response(res, 404, 'No data found for this id'))
    } catch (error) {
      console.log(error)
      return wrapper.response(res, 400, 'Bad request', error)
    }
  },

  getMoviePerMonth: async (req, res) => {
    try {
      const { month } = req.params
      const result = await model.getMovieByCondition({ month: month })
      result.length > 0
        ? (wrapper.response(res, 200, 'Success getting data per month', result))
        : (wrapper.response(res, 404, "Data for this month doesn't exist"))
    } catch (error) {
      console.log(error)
      return wrapper.response(res, 400, 'Bad request, error')
    }
  },

  createMovie: async (req, res) => {
    try {
      const id = uuidv4()
      const { title, director, casts, synopsis, duration, releaseDate, category } = req.body
      const setData = {
        movie_id: id,
        movie_title: title,
        movie_director: director,
        movie_casts: casts,
        movie_synopsis: synopsis,
        movie_poster: req.file ? req.file.filename : '',
        movie_duration: duration,
        movie_release_date: releaseDate,
        movie_category: category,
        movie_created_at: new Date(Date.now()),
        movie_updated_at: null
      }

      const result = await model.createMovie(setData)

      return wrapper.response(res, 200, 'Success creating new movie!', result)
    } catch (error) {
      console.log(error)
      return wrapper.response(res, 400, 'Bad request', error)
    }
  },

  updateMovie: async (req, res) => {
    try {
      const { id } = req.params
      const { title, director, casts, synopsis, duration, releaseDate, category } = req.body
      const prevData = await model.getMovieByCondition({ movie_id: id })

      if (prevData.length > 0) {
        const setData = {
          movie_title: title,
          movie_director: director,
          movie_casts: casts,
          movie_synopsis: synopsis,
          movie_poster: req.file ? req.file.filename : '',
          movie_duration: duration,
          movie_release_date: releaseDate,
          movie_category: category,
          movie_updated_at: new Date(Date.now())
        }

        !req.file
          ? delete setData.movie_poster
          : deleter.deletePoster(prevData[0].movie_poster)

        const result = await model.updateMovie(setData, id)

        return wrapper.response(res, 200, 'Movie successfully updated', result)
      } else {
        return wrapper.response(res, 404, "Movie doesn't exist")
      }
    } catch (error) {
      console.log(error)
      return wrapper.response(res, 400, 'Bad request', error)
    }
  },

  deleteMovie: async (req, res) => {
    try {
      const { id } = req.params
      const dataMovie = await model.getMovieByCondition({ movie_id: id })

      if (dataMovie.length > 0) {
        const isImageExist = fs.existsSync(path.join(__dirname, '../../uploads/', dataMovie[0].movie_poster))
        console.log(isImageExist)
        if (isImageExist) {
          deleter.deletePoster(dataMovie[0].movie_poster)
        }
        const result = await model.deleteMovie(id)

        return wrapper.response(res, 200, 'Success deleting movie', result)
      } else {
        return wrapper.response(res, 404, "Movie doesn't exist")
      }
    } catch (error) {
      console.log(error)
      return wrapper.response(res, 400, 'Bad request', error)
    }
  }

}
