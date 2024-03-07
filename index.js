const User = require('./films')
const express = require('express')
const mongoose = require('mongoose')
const app = express(); 

app.use(express.json())


mongoose
  .connect("mongodb://127.0.0.1:27017/UclixDataBase", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("connected via mongodb");
  })
  .catch((err) => console.log(err));

  app.post("/fims", async (req, res) => {
    const { name, genre } = req.body;
    try {
      const newFilm = new Film({
        name,
        genre,
      });
  
      newUser.save();
      res.json(newFilm);
    } catch (error) {
      res.status(500).json(error);
    }
  });

app.get("/", (req, res) => {
  res.send("Uclix");
});

app.listen(3000);
