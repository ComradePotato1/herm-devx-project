const express = require("express");
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const axios = require("axios");
const mysql = require('mysql2');
const cors = require('cors');

const DetectLanguage = require('detectlanguage');
const detectlanguage = new DetectLanguage('d7ad1a34552516bcaa28a67b7d860e83');

const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'gpj050304*',
    database: 'devx',
    port: 3306
});

detectlanguage.languages().then(function (langlist) {
    lang = JSON.parse(JSON.stringify(langlist));
});

db.query("CREATE DATABASE IF NOT EXISTS devx ", (err, result) => { });
db.query("USE devx ", (err, result) => { });
db.query("CREATE TABLE IF NOT EXISTS history ( hist_id INT AUTO_INCREMENT PRIMARY KEY, input VARCHAR(255), lang VARCHAR(255) ) ", (err, result) => {});

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
const route = express.Router();
const port = process.env.PORT || 5001; app.use('/v1', route);


app.listen(port, () => {    
  console.log(`Server listening on port ${port}`);
});

route.get('/analyze/:text', async (req, res) => {
    const text = req.params.text;

    try {
        detectlanguage.detect(text).then(function (analysis) {
            analysis = JSON.stringify(analysis)
            const result = JSON.parse(analysis)
            if (result[0].isReliable) {
                for (let i = 0; i < result.length; i++) {
                    for (let j = 0; j < lang.length; j++) {
                        if (result[i].language == lang[j].code) {
                            result[i].language = lang[j].name;
                        }
                    }
                }
            } else {
                result[0].language = "Unreliable result"
            }

            const query = 'INSERT INTO history (input, lang) VALUES (?, ?)';

            db.query(query, [text, result[0].language], (err, result) => {
                if (err) {
                    return res.status(500).send('Error adding data to the database.');
                }
            });


            res.json(result);
        });
    } catch (error) {
        res.status(404).send({ error: "No response from server" });
    }
});

route.get('/history', (req, res) => {
  //const { email, password } = req.body;

  const query = 'SELECT * FROM history';
  
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).send('Error accessing database');
    }
    res.status(200).send(results);
    
    
  });
});

route.post('/remove', (req, res) => {
    const query = 'DELETE FROM history WHERE hist_id > -1';

    db.query(query, (err, result) => {
        if (err) {
            return res.status(500).send('Error accessing database');
        }
        res.status(200).send('success!');
    });
})


db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err.message);
    } else {
        console.log('Connected to the MySQL database.');
    }
});

route.get('/pokemon/:name', async (req, res) => {
  const pokemonName = req.params.name.toLowerCase();

  try {
    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
    
    const pokemonData = {
      name: response.data.name,
      id: response.data.id,
      height: response.data.height,
      weight: response.data.weight,
    };
    console.log(response)
    res.json(pokemonData);
  } catch (error) {
    res.status(404).send({ error: "Pokémon not found!" });
  }
});



route.post('/add-user', (req, res) => {
    const { email, password } = req.body;

    const query = 'INSERT INTO users (user_email, user_password) VALUES (?, ?)';

    db.query(query, [email, password], (err, result) => {
        if (err) {
            return res.status(500).send('Error adding user to the database.');
        }
        res.status(200).send('User added successfully.');
    });
});


route.post('/verify-user', (req, res) => {
  const { email, password } = req.body;

  const query = 'SELECT * FROM users WHERE user_email = ? AND user_password = ?';
  
  db.query(query, [email, password], (err, results) => {
    if (err) {
      return res.status(500).send('Error verifying user credentials.');
    }

    if (results.length > 0) {
      res.status(200).send('User verified successfully.');
    } else {
      res.status(401).send('Invalid email or password.');
    }
  });
});

