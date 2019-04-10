const scraper = require("sunat-ruc-scraper2");
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const PORT = process.env.PORT || 3000;
const ENV = process.env.NODE_ENV || 'dev';


let app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

if (ENV === 'dev') {
  app.use(morgan('dev'));
}

let router = express.Router();

function apiRouter() {
  router.get('/rucs', (req, res, next) => {
    let rucs = req.query.q;
    scraper.getInformation(rucs, (err, data) => {
      cbInfo(err, data, res, next);
    });
  });
  router.get('/rucs/:ruc', (req, res, next) => {
    let ruc = req.params.ruc;
    scraper.getInformation(ruc, (err, data) => {
      cbInfo(err, data, res, next);
    });
  });

  return router;
}

function cbInfo(err, data, res, next) {
  if (err) {
    next(err);
  } else {
    res.status(200).json(data);
  }
}

app.use('/api', apiRouter());

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message,
    stack: err.stack
  });
});

app.all('*', (req, res) => {
  res.status(404).json({ message: 'Servicio no encontrado' });
});

app.listen(PORT, () => {
  console.log(`App listening at ${PORT}`);
});