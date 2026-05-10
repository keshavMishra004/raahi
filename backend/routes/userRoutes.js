const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const userCtrl = require('../controllers/userController');

router.get('/me', auth, userCtrl.getMe);
router.put('/me', auth, userCtrl.updateMe);

module.exports = router;
