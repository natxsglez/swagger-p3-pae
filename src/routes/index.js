const router = require('express').Router();
const usersRoutes = require('./users');
const chatsRoutes = require('./chats');
const messagesRoutes = require('./messages');

router.use('/users', usersRoutes);
router.use('/chats', chatsRoutes);
router.use('/chats/messages', messagesRoutes);

module.exports = router;