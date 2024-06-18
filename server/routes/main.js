const express = require("express");
const router = express.Router();
const Movie = require('../models/movieModel');
const Reviews = require('../models/reviews');

//Routes

/*
 * Get/
 * Home
 */
router.get('', async (req,res) => {
  try {
      const locals = {
          title: "Uclix",
          description: "Our uclix movie web site."
      }
 
      const perPage = 5;
      const page = req.query.page || 1;

      const data = await Movie.aggregate([{ $sort:{createsAt: -1}}])
      .skip((perPage * page) - perPage)
      .limit(perPage)
      .exec();

      const count = await Movie.countDocuments();
      const nextPage = parseInt(page) + 1 ;
      const hasNextPage = nextPage <= Math.ceil(count / perPage);

      res.render('index', {
          locals,
          data,
          current: page,
          nextPage: hasNextPage ? nextPage : null,
          currentRoute: '/'
      });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
  }
});

router.get("/home", (req, res) => {
  res.render("home", {
    currentRoute: "/home",
  });
});

router.get("/categorie", (req, res) => {
  res.render("categorie", {
    currentRoute: "/categorie",
  });
});

router.get("/movie", async (req, res) => {
  try {
    const movie = await Movie.find().select('name image tag'); 
    res.render("movie", { currentRoute: "movie", movies: movie });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get('/movie-details/:id', async (req, res) => {
  try {
      const movie = await Movie.findById(req.params.id);
      const reviews = await Reviews.find({ movie: req.params.id });
      res.render('movie-details', { currentRoute: 'movie-details', movie, reviews });
  } catch (error) {
      console.error(error);
      res.status(500).send('Internal server error');
  }
});

router.post('/movie-details/:id', async (req, res) => {
  try {
      const review = new Reviews({
          ...req.body,
          movie: req.params.id
      });
      await review.save();
      res.redirect(`/movie-details/${req.params.id}`);
  } catch (error) {
      console.error(error);
      res.status(500).send('Internal server error');
  }
});

router.get('/top10', async (req, res) => {
  try {
    const topMovies = await Reviews.aggregate([
      { $lookup: { from: 'movies', localField: 'movie', foreignField: '_id', as: 'movie' } },
      { $unwind: "$movie" },
      { $group: { 
          _id: "$movie._id", 
          avgRating: { $avg: "$rating" }, 
          name: { $first: "$movie.name" }, 
          imageUrl: { $first: "$movie.image" } 
      }},
      { $sort: { avgRating: -1 } },
      { $limit: 10 }
    ]);

    res.render('top10', {
        movies: topMovies,
        currentRoute: '/top10'
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

router.get("/tags/:tag", async (req, res) => {
  try {
    const movies = await Movie.find({ tag: req.params.tag });
    res.render("movie", { movies, currentRoute: req.path }); // Pass 'movies' and 'currentRoute' to your template
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get('/people', (req,res) => {
    res.render('people',{
        currentRoute: '/people'
    });
});

// POST route for submitting a review
router.post('/reviews', async (req, res) => {
    const { title, description, rating } = req.body;
    const newReview = new Reviews({
        title,
        description,
        rating
    });

    try {
        const savedReview = await newReview.save();
        res.json(savedReview);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET route for retrieving all reviews
router.get('/reviews', async (req, res) => {
    try {
        const reviews = await Reviews.find();
        res.render('reviews', {currentRoute: 'reviews', reviews });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
