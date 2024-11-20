const OpenAI = require("openai");
const express = require("express");
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const axios = require("axios");
const mysql = require('mysql2');
const cors = require('cors');


const openai = new OpenAI();


const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
const route = express.Router();
const port = process.env.PORT || 5001;app.use('/v1', route);
app.listen(port, () => {    
  console.log(`Server listening on port ${port}`);
});

route.get('/simple-get', (req, res) => {
  res.send("here");
});

route.get('/dynamic-get/:text', (req, res) => {
  res.send(req.params.text);
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

    res.json(pokemonData);
  } catch (error) {
    res.status(404).send({ error: "Pokémon not found!" });
  }
});

route.post('/analyze', async (req, res) => {
    const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            { role: "system", content: "You are a helpful assistant." },
            {
                role: "user",
                content: "Write a haiku about recursion in programming.",
            },
        ],
    });

    res.json(completion);
});

const db = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'password',
  database: 'devx',
  port: 3306
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.message);
  } else {
    console.log('Connected to the MySQL database.');
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




const http = require('https');

const options = {
	method: 'POST',
	hostname: 'plagiarism-checker-and-auto-citation-generator-multi-lingual.p.rapidapi.com',
	port: null,
	path: '/plagiarism',
	headers: {
		'x-rapidapi-key': '6d6740424dmsh5b8992841a83e8fp1e3020jsn38ee107f4b3d',
		'x-rapidapi-host': 'plagiarism-checker-and-auto-citation-generator-multi-lingual.p.rapidapi.com',
		'Content-Type': 'application/json'
	}
};

const req = http.request(options, function (res) {
	const chunks = [];

	res.on('data', function (chunk) {
		chunks.push(chunk);
	});

	res.on('end', function () {
		const body = Buffer.concat(chunks);
		console.log(body.toString());
	});
});

req.write(JSON.stringify({
  text: 'This is a test with a minimum of 40 characters to check plagiarism for.',
  language: 'en',
  includeCitations: false,
  scrapeSources: false
}));
req.end();