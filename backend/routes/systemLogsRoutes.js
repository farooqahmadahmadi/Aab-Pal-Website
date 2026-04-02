const express = require('express');
const router = express.Router();
const controller = require('../controllers/systemLogsController');

router.get('/', controller.getLogs);
router.delete('/:id', controller.deleteLog);

module.exports = router;
