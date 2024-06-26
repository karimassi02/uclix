const express = require("express");
const router = express.Router();
const Post = require("../models/movieModel");
const PostPeople = require("../models/peopleModel");
const User = require("../models/User");
const Movie = require("../models/movieModel");
const People = require("../models/peopleModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const adminLayout = "../views/layouts/admin";
const jwtSecret = process.env.JWT_SECRET;

const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
  }
};

router.get("/admin", async (req, res) => {
  try {
    const locals = {
      title: "Admin",
      description: "Simple Blog created",
    };

    res.render("admin/index", { locals, layout: adminLayout });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

router.post("/admin", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username: username });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid Password!" });
    }

    const token = jwt.sign({ userId: user._id }, jwtSecret);
    res.cookie("token", token, { httpOnly: true });

    res.redirect("/dashboard");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

router.get("/dashboard", authMiddleware, async (req, res) => {
  try {
    const locals = {
      title: "Dashboard",
      description: "Simple blog",
    };
    const data = await Post.find();
    const datapeople = await PostPeople.find();
    res.render("admin/dashboard", {
      locals,
      data,
      datapeople,
      layout: adminLayout,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

router.get("/add-movie", authMiddleware, async (req, res) => {
  try {
    const locals = {
      title: "Add Movie",
      description: "Add a new movie",
    };
    const data = await Post.find();
    res.render("admin/add-movie", { locals, layout: adminLayout });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

router.post("/add-movie", authMiddleware, async (req, res) => {
  try {
    const {
      name,
      date,
      language,
      duration,
      studio,
      people,
      reviews,
      category,
      tag,
      image,
      description,
    } = req.body;
    const newMovie = new Movie({
      name,
      date,
      language,
      duration,
      studio,
      category,
      tag,
      image,
      people,
      reviews,
      description,
    });
    await newMovie.save();
    res.redirect("/dashboard");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

router.get("/edit-movie/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const movie = await Movie.findById(id);
    if (!movie) {
      res.status(404).send("Movie not found");
    } else {
      res.render("admin/edit-movie", { currentRoute: "edit-movie", movie });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
});
router.put("/edit-movie/:id", (req, res) => {
  const id = req.params.id;
  const updatedMovie = req.body;

  Movie.findByIdAndUpdate(id, updatedMovie, { new: true })
    .then((movie) => {
      res.redirect("/dashboard");
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error occurred while updating movie");
    });
});

router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const user = await User.create({ username, password: hashedPassword });
      res.status(201).json({ message: "User Created", user });
    } catch (error) {
      if (error.code === 11000) {
        res.status(409).json({ message: "User already in use" });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  } catch (error) {
    console.log(error);
  }
});

router.delete("/delete-movie/:id", authMiddleware, async (req, res) => {
  try {
    await Movie.deleteOne({ _id: req.params.id });
    res.redirect("/dashboard");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

// People

router.get("/add-people", authMiddleware, async (req, res) => {
  try {
    const locals = {
      title: "Add people",
      description: "Add a new people",
    };
    const data = await PostPeople.find();
    res.render("admin/add-people", { locals, layout: adminLayout });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

router.post("/add-people", authMiddleware, async (req, res) => {
  try {
    const { familyname, firstname, birthday, role, tag, image } = req.body;
    const newPeople = new People({
      familyname,
      firstname,
      birthday,
      role,
      tag,
      image,
    });
    await newPeople.save();
    res.redirect("/dashboard");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

router.get("/edit-people/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const people = await People.findById(id);
    if (!people) {
      res.status(404).send("people not found");
    } else {
      res.render("admin/edit-people", { currentRoute: "edit-people", people });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
});
router.put("/edit-people/:id", (req, res) => {
  const id = req.params.id;
  const updatedpeople = req.body;

  People.findByIdAndUpdate(id, updatedpeople, { new: true })
    .then((people) => {
      res.redirect("/dashboard");
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error occurred while updating people");
    });
});

router.delete("/delete-people/:id", authMiddleware, async (req, res) => {
  try {
    await People.deleteOne({ _id: req.params.id });
    res.redirect("/dashboard");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/");
});

module.exports = router;
