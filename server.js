const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const Movie = require("./models/movieModel");
const connectDb = require("./db/connection");
const PORT = 3000;

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

app.use(bodyParser.urlencoded({ extended: true }));

// Connect to MongoDB before starting the server
connectDb().then(() => {
    // Routes and server setup inside this callback function

    app.get('/', (req, res) => {
        res.render('homepage');
    });

    app.get("/addMovie", async (req, res) => {
        res.render("movie");
    });

    app.post("/addMovie", async (req, res) => {
        try {
            const movieData = req.body;
            const movie = new Movie(movieData);
            await movie.save();
            res.send("Movie added successfully");
        } catch (error) {
            res.status(500).send(error.message);
        }
    });

    app.get("/movies", async (req, res) => {
        try {
            const movies = await Movie.find();
            res.json(movies);
        } catch (error) {
            console.error("Error fetching movies:", error.message);
            res.status(500).send("Error fetching movies");
        }
    });

    app.get("/movies/:id", async (req, res) => {
        try {
            const movie = await Movie.findById(req.params.id);
            res.render("movieDetail", { movie: movie });
        } catch (error) {
            console.error("Error fetching movie:", error.message);
            res.status(500).send("Error fetching movie");
        }
    });

    app.listen(PORT, () => {
        console.log(`Listening on ${PORT}`);
    });

}).catch(error => {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1); // Exit the process if unable to connect to MongoDB
});
