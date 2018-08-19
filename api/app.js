const express = require('express');
var bodyParser = require('body-parser');
const uuidv4 = require('uuid/v4');

const app = express();

app.use(bodyParser.json());
app.use(function(_, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.post('/data/_search', function(req, res, next) {
  const { size, search_after } = req.body;
  const resultOfRequestToElasticSearch = makeFakeDataArray(size, search_after);
  res.json(resultOfRequestToElasticSearch);
});

app.listen(3000, function() {
  console.log('Listening on http://localhost:3000');
});

function makeFakeDataArray(size, [search_after = -1]) {
  return [...Array(size)].map((_, i) => makeFakeData(search_after + 1 + i));
}

function makeFakeData(sort) {
  return {
    id: uuidv4(),
    body: 'All work and no play makes Jack a dull boy.',
    sort: [sort]
  };
}
