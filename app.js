const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const app = express();
const tasksRoutes = require('./routes/tasks');

app.use(morgan('combined'));
app.use(bodyParser.json());

app.use('/tasks', tasksRoutes);

app.get('/', (req, res, next) => {
  res.send('Hello JS');
});

app.use((err, req, res, next) => {
  const { message } = err;
  res.json({ status: 'ERROR', message });
});

app.listen(8080, () => console.log('Listening on port 8080'));
