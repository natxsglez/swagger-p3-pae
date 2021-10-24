const { Db } = require("mongodb");
const UsersController = require("../controllers/users.controller");
const auth = require("./middlewares/login");
const router = require("express").Router();
const path = require("path");

/**
 * @swagger
 * /api/users/:
 *  get:
 *    tags:
 *      - Users
 *    summary: Retrieve a list with all the users.
 *    description: Retrieve a list with all the users. Can be used to consult all the data from the users.
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
 *                description: The user ID.
 *                example: "ab15cd"
 *              name:
 *                type: string
 *                description: The user's name.
 *                example: "nat"
 *              email:
 *                type: string
 *                description: The user's email.
 *                example: "nat@example.com"
 *              password:
 *                type: string
 *                description: The user's cipher password.
 *                example: "a5df7sdfs5fs54$#sfv"
 *      400:
 *        description: Database error or Users not found.
 *        schema:
 *          type: string
 *          example: Database error
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
router.get("/", auth, UsersController.getAllUsers);

/**
 * @swagger
 * /api/users/{email}:
 *  get:
 *    tags:
 *      - Users
 *    summary: Retrieve the data from a user.
 *    description: Retrieve an object with the data of the user. The email is the filter that will look for an specific user data. You need to be logged to consult your data.
 *    parameters:
 *      - in: path
 *        name: email
 *        description: The user's email
 *      - in: header
 *        name: x-auth
 *        description: The token to authenticate the user.
 *        example: "a$#FA564#$sfsgsfgb"
 *    responses:
 *      200:
 *        description: Success response.
 *        schema:
 *          type: object
 *          properties:
 *            _id:
 *              type: string
 *              description: The user ID.
 *              example: "ab15cd"
 *            name:
 *              type: string
 *              description: The user's name.
 *              example: "nat"
 *            email:
 *              type: string
 *              description: The user's email.
 *              example: "nat@example.com"
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
 *        description: Invalid Token or User does not exist
 *        schema:
 *          type: string
 *          example: Not a valid token
 *      404:
 *        description: User could not be found on database.
 *        schema:
 *          type: string
 *          example: User not found :(
 */
router.get("/:email", auth, UsersController.getUserByEmail);

/**
 * @swagger
 * /api/users/newUser:
 *  post:
 *    tags:
 *      - Users
 *    summary: Add a new user to the Chat app.
 *    description: This is the signup of the API. The data that was sent is used to check if the new user can be registered.
 *    parameters:
 *      - in: body
 *        name: user
 *        description: The user to create
 *        schema:
 *          type: object
 *          required:
 *            - name
 *            - email
 *            - password
 *          properties:
 *            name:
 *              type: string
 *              example: "juan"
 *            email:
 *              type: string
 *              example: "juan@example.com"
 *            password:
 *              type: string
 *              example: "juan123"
 *    responses:
 *      200:
 *        description: Success response.
 *        schema:
 *          type: object
 *          properties:
 *            name:
 *              type: str
 *              description: The user's name.
 *              example: "nat"
 *            email:
 *              type: string
 *              description: The user's email.
 *              example: "nat@example.com"
 *            password:
 *              type: string
 *              description: The user's cipher password.
 *              example: "a5df7sdfs5fs54$#sfv"
 *            _id:
 *              type: string
 *              description: The user ID.
 *              example: "ab15cd"
 *            token:
 *              type: string
 *              description: The user's session token.
 *              example: "ab15cd@#$sfjsod"
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
 *        description: User is already registered.
 *        schema:
 *          type: string
 *          example: User already exists
 */
router.post("/newUser", UsersController.createUser);

/**
 * @swagger
 * /api/users/login:
 *  post:
 *    tags:
 *      - Users
 *    summary: User login.
 *    description: This is the endpoint to authenticate a user. Returns the token if the login was successful
 *    parameters:
 *      - in: body
 *        name: user
 *        description: The user data to login
 *        schema:
 *          type: object
 *          required:
 *            - email
 *            - password
 *          properties:
 *            email:
 *              type: string
 *              example: "juan@example.com"
 *            password:
 *              type: string
 *              example: "juan123"
 *    responses:
 *      200:
 *        description: Success response.
 *        schema:
 *          type: object
 *          properties:
 *            email:
 *              type: string
 *              description: The user's email.
 *              example: "nat@example.com"
 *            token:
 *              type: string
 *              description: The user's token.
 *              example: "iubfisUOGV6A87RFRGF8G4R5#$#$38GVGE87B"
 *      401:
 *        description: The login could not be completed
 *        schema:
 *          type: string
 *          example: Login failed
 *      400:
 *        description: Error
 *        schema:
 *          type: string
 *          example: Error
 */
router.post("/login", UsersController.login);

module.exports = router;
