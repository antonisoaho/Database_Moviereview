const Movie = require('../models/Movie');
const Review = require('../models/Review');

exports.createMovie = async (req, res) => {
  const { title, director, releaseYear, genre } = req.body;
  try {
    const newMovie = new Movie({ title, director, releaseYear, genre });
    await newMovie.save();
    res.status(201).json(newMovie);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllMovies = async (req, res) => {
  try {
    const movies = await Movie.find();
    res.status(200).json(movies);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getMovieById = async (req, res) => {
  const { id } = req.params;
  try {
    const movie = await Movie.findById(id);
    if (!movie) return res.status(404).json({ error: 'Movie not found' });
    res.status(200).json(movie);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateMovie = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  try {
    const movie = await Movie.findByIdAndUpdate(id, updates, { new: true });
    if (!movie) return res.status(404).json({ error: 'Movie not found' });
    res.status(200).json(movie);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteMovie = async (req, res) => {
  const { id } = req.params;
  try {
    const movie = await Movie.findByIdAndDelete(id);
    if (!movie) return res.status(404).json({ error: 'Movie not found' });
    res.status(200).json({ message: 'Movie deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getReviewsByMovieId = async (req, res) => {
  const { id } = req.params;
  try {
    const reviews = await Review.find({ movieId: id }).populate(
      'userId',
      'username'
    );
    if (!reviews)
      return res.status(404).json({ error: 'No reviews found for this movie' });

    const averageRating =
      reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;

    res.status(200).json({ averageRating, reviews });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getReviewsOnAllMovies = async (req, res) => {
  try {
    const moviesWithRatings = await Movie.aggregate([
      {
        $lookup: {
          from: 'reviews',
          localField: '_id',
          foreignField: 'movieId',
          as: 'reviews',
        },
      },
      {
        $project: {
          title: 1,
          director: 1,
          releaseYear: 1,
          genre: 1,
          averageRating: { $avg: '$reviews.rating' },
        },
      },
    ]);

    res.json(moviesWithRatings);
  } catch (error) {
    console.error('Error fetching movies with ratings:', error);
    res.status(500).json({ error: 'Failed to fetch movies with ratings' });
  }
};
