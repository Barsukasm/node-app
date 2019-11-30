const express = require('express');
const { validate } = require('jsonschema');
const db = require('../db/db');
const shortid = require('shortid');

const router = express.Router();

router.get('/', (req, res, next) => {
  try {
    const tasks = db.get('tasks');
    res.json({ status: 'OK', data: tasks });
  } catch (error) {
    throw new Error(error);
  }
});

router.get('/:id', (req, res, next) => {
  const { id } = req.params;
  try {
    const tasks = db.get('tasks');
    const data = tasks.find((task) => String(task.id) === id);
    res.json({ status: 'OK', data });
  } catch (error) {
    throw new Error(error);
  }
});

router.post('/', (req, res, next) => {
  const { body } = req;
  const taskSchema = {
    type: 'object',
    properties: {
      title: { type: 'string' }
    },
    required: ['title'],
    additionalProperties: false
  };
  const validationResult = validate(body, taskSchema);
  if (!validationResult.valid) {
    // Выдача ошибки
    return next(new Error('INVALID_JSON_OR_API_FORMAT'));
  }
  const newTask = {
    id: shortid.generate(),
    title: body.title,
    completed: false
  };
  try {
    while (
      db
        .get('tasks')
        .find({ id: newTask.id })
        .value() !== undefined
    ) {
      newTask.id = shortid.generate();
    }
    db.get('tasks')
      .push(newTask)
      .write();
  } catch (error) {
    throw new Error(error);
  }
  res.json({ status: 'OK', data: newTask });
});

module.exports = router;
