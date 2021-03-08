require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const path = require('path');
const camelize = require('camelize');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/', express.static(path.join(__dirname, '../public')));

// your API calls

// example API call
app.get('/rovers', async (req, res) => {
  try {
    const { rover } = req.query;
    const response = await fetch(
      `https://api.nasa.gov/mars-photos/api/v1/manifests/${rover}?api_key=${process.env.API_KEY}`
    );
    const data = camelize(await response.json());
    res.send({ ...data });
  } catch (e) {}
});

app.get('/images', async (req, res) => {
  try {
    const { rover, page } = req.query;
    const response = await fetch(
      `https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos?sol=1000&page=${page}&api_key=${process.env.API_KEY}`
    ).then(res => res.json());
    res.send({ data: response });
  } catch (err) {
    console.log('error:', err);
  }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
