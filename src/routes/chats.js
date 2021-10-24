const { Db } = require('mongodb');
const ChatsController = require('../controllers/chats.controller');
const auth = require("./middlewares/login");
const router = require('express').Router();
const path = require('path');

/**
 * @swagger
 * /api/chats/:
 *  get:
 *    tags:
 *      - Chats
 *    summary: Retrieve a list with all the chats with its properties.
 *    description: Retrieve a list with all the chats. It works while the user is logged in.
 *    parameters:
 *      - in: header
 *        name: x-auth
 *        description: The token to authenticate the user.
 *        example: "a$#FA564#$sfsgsfgb"
 *    responses:
 *      200:
 *        description: Success response.
 *        schema:
 *          type: array
 *          items:
 *            type: object
 *            properties:
 *              _id:
 *                type: string
 *                description: Chat ID
 *                example: "61702c514aa058c81995e125"
 *              chatName:
 *                type: string
 *                description: The name of the chat
 *                example: "bts"
 *              users:
 *                type: array
 *                description: The users that are allowed to post messages in the chat
 *                items:
 *                  type: string
 *                  example: "nat@email.com"
 *              invite:
 *                type: string
 *                description: The invite link generated in the creation of the chat.
 *                example: "http://localhost:3001/api/chats/invite/bts"
 *              owner:
 *                type: string
 *                example: "john@email.com"
 *              messages:
 *                type: object
 *                properties:
 *                  date:
 *                    type: date
 *                    description: The date when the message was posted.
 *                    example: "2021-10-20T14:54:59.000Z"
 *                  creator:
 *                    type: string
 *                    description: The email of the creator of the message.
 *                    example: "nat@email.com"
 *                  message:
 *                     type: string
 *                     description: The message.
 *                     example: "Hi ARMY!"
 *      404:
 *        description: Chats not found
 *        schema:
 *          type: string
 *          example: Chats not found :(
 *      400:
 *       description: Error
 *       schema:
 *          type: string
 *          example: Database error :(
 *      401:
 *        description: Unauthorized
 *        schema:
 *          type: string
 *          example: Not authorized
 *      403:
 *        description: Invalid Token or Chat already exists
 *        schema:
 *          type: string
 *          example: Not a valid token
 */
router.get('/', auth, ChatsController.getAllChats);

/**
 * @swagger
 * /api/chats/{chatName}:
 *  get:
 *    tags:
 *      - Chats
 *    summary: Retrieve a object with a specific chat.
 *    description: Retrieve a object with a specific chat. It works while the user is logged in.
 *    parameters:
 *      - in: header
 *        name: x-auth
 *        description: The token to authenticate the user.
 *        example: "a$#FA564#$sfsgsfgb"
 *      - in: path
 *        name: chatName
 *        description: The chat you are looking for
 *    responses:
 *      200:
 *        description: Success response.
 *        schema:
 *          type: object
 *          properties:
 *            _id:
 *              type: string
 *              description: Chat ID
 *              example: "61702c514aa058c81995e125"
 *            chatName:
 *              type: string
 *              description: The name of the chat
 *              example: "bts"
 *            users:
 *              type: array
 *              description: The users that are allowed to post messages in the chat
 *              items:
 *                type: string
 *                example: "nat@email.com"
 *            invite:
 *              type: string
 *              description: The invite link generated in the creation of the chat.
 *              example: "http://localhost:3001/api/chats/invite/bts"
 *            owner:
 *              type: string
 *              example: "john@email.com"
 *            messages:
 *               type: object
 *               properties:
 *                date:
 *                  type: date
 *                  description: The date when the message was posted.
 *                  example: "2021-10-20T14:54:59.000Z"
 *                creator:
 *                  type: string
 *                  description: The email of the creator of the message.
 *                  example: "nat@email.com"
 *                message:
 *                   type: string
 *                   description: The message.
 *                   example: "Hi ARMY!"
 *      404:
 *        description: Chats not found
 *        schema:
 *          type: string
 *          example: Chats not found :(
 *      400:
 *       description: Error
 *       schema:
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
 */
router.get('/:chatName', auth, ChatsController.getChatByName);

/**
 * @swagger
 * /api/chats/newChat:
 *  post:
 *    tags:
 *      - Chats
 *    summary: Create a new chat
 *    description: Sends all the necessary data to create a new chat, as long as the user is logged in
 *    parameters:
 *      - in: header
 *        name: x-auth
 *        description: The token to authenticate the user.
 *        example: "a$#FA564#$sfsgsfgb"
 *      - in: body
 *        name: newChat
 *        description: The data to create the chat
 *        schema:
 *          type: object
 *          required:
 *            - chatName
 *            - owner
 *            - userName
 *          properties:
 *            chatName:
 *              type: string
 *              example: "bts"
 *            owner:
 *              type: string
 *              example: "nat@email.com"
 *    responses:
 *      200:
 *        description: Success response.
 *        schema:
 *          type: string
 *          example: "Chat created: {{invite link to chat}}"
 *      400:
 *       description: Error
 *       schema:
 *          type: string
 *          example: Error
 *      401:
 *        description: Unauthorized
 *        schema:
 *          type: string
 *          example: Not authorized
 *      403:
 *        description: Invalid Token or Chat already exists
 *        schema:
 *          type: string
 *          example: Not a valid token
 */
router.post('/newChat', auth, ChatsController.createChat);

/**
 * @swagger
 * /api/chats/invite/{chatName}:
 *  get:
 *    tags:
 *      - Chats
 *    summary: Get the invite link of a chat.
 *    description: Retrieve the invite link of a specific chat
 *    parameters:
 *      - in: path
 *        name: chatName
 *        description: The chat name
 *      - in: header
 *        name: x-auth
 *        description: The token to authenticate the user.
 *        example: "a$#FA564#$sfsgsfgb"
 *    responses:
 *      200:
 *        description: Success response.
 *        schema:
 *          type: string
 *          example: "http://localhost:3001/api/chats/invite/bts"
 *      418:
 *        description: Chat not found or not authorized. Deliberately used an error that's not the right one to keep positive while doing this homework :D
 *        schema:
 *          type: string
 *          example: Not authorized or could not find the chat
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
 *        description: Invalid Token or Chat already exists
 *        schema:
 *          type: string
 *          example: Not a valid token
 */
router.get('/invite/:chatName', auth, ChatsController.getInviteLink);

/**
 * @swagger
 * /api/chats/invite/{chatName}:
 *  post:
 *    tags:
 *      - Chats
 *    summary: Add a new user to the chat
 *    description: Post a new user in the array of users in a chat
 *    parameters:
 *      - in: path
 *        name: chatName
 *        description: The chat name
 *      - in: header
 *        name: x-auth
 *        description: The token to authenticate the user.
 *        example: "a$#FA564#$sfsgsfgb"
 *      - in: body
 *        name: user
 *        description: The user to be added to the chat
 *        schema:
 *          type: object
 *          required:
 *            - userName
 *          properties:
 *            userName:
 *              type: string
 *              example: "nat@email.com"
 *    responses:
 *      200:
 *        description: Success response.
 *        schema:
 *          type: object
 *          properties:
 *            _id:
 *              type: string
 *              description: Chat ID
 *              example: "61702c514aa058c81995e125"
 *            chatName:
 *              type: string
 *              description: The name of the chat
 *              example: "bts"
 *            users:
 *              type: array
 *              description: The users that are allowed to post messages in the chat
 *              items:
 *                type: string
 *                example: "nat@email.com"
 *            invite:
 *              type: string
 *              description: The invite link generated in the creation of the chat.
 *              example: "http://localhost:3001/api/chats/invite/bts"
 *            owner:
 *              type: string
 *              example: "john@email.com"
 *            messages:
 *               type: object
 *               properties:
 *                date:
 *                  type: date
 *                  description: The date when the message was posted.
 *                  example: "2021-10-20T14:54:59.000Z"
 *                creator:
 *                  type: string
 *                  description: The email of the creator of the message.
 *                  example: "nat@email.com"
 *                message:
 *                   type: string
 *                   description: The message.
 *                   example: "Hi ARMY!"
 *      418:
 *        description: User was in the chat
 *        schema:
 *          type: string
 *          example: User already added to the chat
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
 *        description: Invalid Token or Chat already exists
 *        schema:
 *          type: string
 *          example: Not a valid token
 */
router.post('/invite/:chatName', auth, ChatsController.addUserToChat);

module.exports = router;