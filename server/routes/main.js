const express = require('express');
const router = express.Router();
const Movie = require('../models/movieModel');

//Routes

/*
    * Get/
    * Home
*/
router.get('', async (req,res) => {
    try {
        const locals = {
            title: "Nodejs Blog",
            description: "Simple Blog created with NodeJS, Express & MongoDb."
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

router.get('/home', (req,res) => {
    res.render('home',{
        currentRoute: '/home'
    });
});

router.get('/movie', async (req, res) => {
    try {
        const movie = await Movie.find();
        res.render('movie', { currentRoute: 'movie', movie  });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/movie-details/:id', async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        res.render('movie-details', {currentRoute: 'movie-details', movie });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
});

router.get('/top10', (req,res) => {
    res.render('top10',{
        currentRoute: '/top10'
    });
});

router.get('/people', (req,res) => {
    res.render('people',{
        currentRoute: '/people'
    });
});

module.exports = router;