const express = require('express');
const app = express();
const morgan = require('morgan');
// const bodyParser = require('body-parser');

const favsongsRoutes = require('./api/routes/favsongsRoute');

app.use(morgan('dev'));
// app.use(bodyParser.urlencoded({extended: false}));
// app.use(bodyParser.json());

// Add headers to the response
app.use((req,res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  if (req.method === 'OPTION') {
    res.header(
      'Access-Control-Allow-Methods',
      'GET, POST'
    );
    return res.status(200).json({});
  }
  next();
})

app.use('/favsongs', favsongsRoutes);

// Error handle
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status(404);
  next(err);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    err: {
      message: err.message
    }
  });
});


module.exports = app;