const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const admin = require('../middlewares/admin');
const ctrl = require('../controllers/bookingController');

router.get('/user', auth, ctrl.listForUser);
router.put('/:id/status', auth, admin, ctrl.updateStatus);

module.exports = router;
