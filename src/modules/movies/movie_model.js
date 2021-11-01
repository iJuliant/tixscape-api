const connection = require('../../config/mysql')

module.exports = {

  countData: (search) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT COUNT(*) as TOTAL from movies WHERE
        movie_title LIKE ?`,
        search,
        (error, result) => {
          !error
            ? resolve(result)
            : reject(new Error(error))
        }
      )
    })
  },

  getAllMovies: (lim, offset, search, order) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT * FROM movies WHERE movie_title LIKE ?
        ORDER BY ${order} LIMIT ? OFFSET ?`,
        [search, lim, offset],
        (error, result) => {
          !error
            ? resolve(result)
            : reject(new Error(error))
        }
      )
    })
  },

  getMovieByCondition: (condition) => {
    return new Promise((resolve, reject) => {
      let sqlQuery
      condition.month
        ? sqlQuery = `SELECT * FROM movies WHERE monthname(movie_release_date)='${condition.month}'`
        : sqlQuery = 'SELECT * FROM movies WHERE ?'
      connection.query(
        sqlQuery,
        condition,
        (error, result) => {
          !error
            ? resolve(result)
            : reject(new Error(error))
        }
      )
    })
  },

  createMovie: (setData) => {
    return new Promise((resolve, reject) => {
      connection.query(
        'INSERT INTO movies SET ?',
        setData,
        (error, result) => {
          !error
            ? resolve(result)
            : reject(new Error(error))
        }
      )
    })
  },

  updateMovie: (setData, id) => {
    return new Promise((resolve, reject) => {
      connection.query(
        'UPDATE movies SET ? WHERE movie_id = ?',
        [setData, id],
        (error, result) => {
          !error
            ? resolve(result)
            : reject(new Error(error))
        }
      )
    })
  },

  deleteMovie: (id) => {
    return new Promise((resolve, reject) => {
      connection.query(
        'DELETE FROM movies WHERE movie_id = ?',
        id,
        (error, result) => {
          !error
            ? resolve(result)
            : reject(new Error(error))
        }
      )
    })
  }

}
