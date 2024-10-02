const express = require('express');
const { registerUser, loginUser, bookmarks } = require('../controllers/userController');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/bookmarks', authMiddleware, bookmarks);


module.exports = router;
