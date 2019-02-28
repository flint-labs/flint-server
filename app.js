const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const logger = require('./config').getLogger('Server');

const app = express();
const port = process.env.PORT || 3000;

// connect To DB
const models = require('./src/models').sequelize;

models
  .sync()
  .then(() => {
    logger.info('✓ DB connection success.');
  })
  .catch(() => {
    logger.error('✗ DB connection error. Please make sure DB is running.');
    process.exit();
  });

app.set('jwt-secret', process.env.JWT_SECRET);
app.use(helmet());
app.use(morgan('dev'));
// nested된 object도 다 parsing해준다.
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/api', require('./src/route/api'));
app.use('/oauth', require('./src/route/oauth'));

app.get('/', (req, res) => {
  res.status(200).send('Success');
});

app.listen(port, () => {
  logger.info(`The server is listening on port ${port}`);
});
