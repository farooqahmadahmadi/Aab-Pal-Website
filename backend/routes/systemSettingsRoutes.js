const router = require('express').Router();
const controller = require('../controllers/systemSettingsController');

router.get('/', controller.getSettings);
router.put('/', controller.updateSetting);

module.exports = router;