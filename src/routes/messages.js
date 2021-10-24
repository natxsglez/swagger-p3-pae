const { Db } = require('mongodb');
const MessagesController = require('../controllers/messages.controller');
const auth = require("./middlewares/login");
const router = require('express').Router();
const path = require('path');

/**
 * @swagger
 * /api/chats/messages/{chatName}:
 *  get:
 *    tags:
 *      - Messages
 *    summary: Retrieve a list with all messages from a chat.
 *    description: Retrieve a list with all the messages of a chat. Can be used to consult all the data from a specific chat.
 *    parameters:
 *      - in: path
 *        name: chatName
 *        description: The chat name
 *      - in: header
 *        name: x-auth
 *        description: The token to authenticate the user.
 *        example: "a$#FA564#$sfsgsfgb"
 *      - in: header
 *        name: email
 *        description: The user that says to be on the chat
 *        example: "john@email.com"
 *    responses:
 *      200:
 *        description: Success response.
 *        schema:
 *          type: array
 *          items:
 *            type: object
 *            properties:
 *              date:
 *                type: date
 *                description: The date when the message was posted.
 *                example: "2021-10-20T14:54:59.000Z"
 *              creator:
 *                type: string
 *                description: The email of the creator of the message.
 *                example: "nat@email.com"
 *              message:
 *                type: string
 *                description: The message.
 *                example: "Hi ARMY!"
 *      400:
 *        description: Error
 *        schema:
 *          type: string
 *          example: Error
 *      401:
 *        description: Unauthorized
 *        schema:
 *          type: string
 *          example: Not authorized
 *      403:
 *        description: Invalid Token
 *        schema:
 *          type: string
 *          example: Not a valid token
 *      404:
 *        description: Chat not found
 *        schema:
 *          type: string
 *          example: No se encontró el chat :(
 */
router.get('/:chatName', auth, MessagesController.getAllMessagesByChat);

/**
 * @swagger
 * /api/chats/messages/{chatName}:
 *  post:
 *    tags:
 *      - Messages
 *    summary: Send a message to a chat
 *    description: Sends all the necessary data to post a message in a chat, as long as the user is part of the chat
 *    parameters:
 *      - in: path
 *        name: chatName
 *        description: The chat name
 *      - in: header
 *        name: x-auth
 *        description: The token to authenticate the user.
 *        example: "a$#FA564#$sfsgsfgb"
 *      - in: body
 *        name: message
 *        description: The data to post the message
 *        schema:
 *          type: object
 *          required:
 *            - creator
 *            - message
 *          properties:
 *            creator:
 *              type: string
 *              example: "nat@email.com"
 *            message:
 *              type: string
 *              example: "Nice to meet you :D"
 *    responses:
 *      200:
 *        description: Success response.
 *        schema:
 *          type: string
 *          example: Message added
 *      400:
 *        description: Error
 *        schema:
 *          type: string
 *          example: Error
 *      401:
 *        description: Unauthorized
 *        schema:
 *          type: string
 *          example: Not authorized
 *      403:
 *        description: Invalid Token
 *        schema:
 *          type: string
 *          example: Not a valid token
 *      404:
 *        description: Chat not found
 *        schema:
 *          type: string
 *          example: No se encontró el chat :(
 */
router.post('/:chatName', auth, MessagesController.addMessage);

module.exports = router;