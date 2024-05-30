const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController');
const { authenticate, authorize } = require('../middlewares/auth');

router
  .post('/', [authenticate, authorize('admin')], movieController.createMovie)
  .get('/', movieController.getAllMovies)
  .get('/ratings', movieController.getReviewsOnAllMovies)
  .get('/:id', movieController.getMovieById)
  .get('/:id/reviews', movieController.getReviewsByMovieId)
  .put('/:id', [authenticate, authorize('admin')], movieController.updateMovie)
  .delete(
    '/:id',
    [authenticate, authorize('admin')],
    movieController.deleteMovie
  );

module.exports = router;
