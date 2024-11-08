const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const { authenticateToken } = require('../middlewares/auth');

router.post('/signup', UserController.signup);
router.post('/signin', UserController.signin);
router.get('/profile', authenticateToken, UserController.getProfile);

module.exports = router; 