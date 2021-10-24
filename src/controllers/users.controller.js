const Database = require('./../models/database');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require("dotenv").config();
class UsersController {
    static getAllUsers(req, res) {
        const database = new Database('users');
        database.find().toArray((err, results) => {
            if (err) {
                res.status(400).send('Database error');
            }
            if (results.length === 0) {
                res.status(400).send('Users not found');
            } else {
                res.send(results);
            }
        });
    }

    static getUserByEmail(req, res) {
        const database = new Database('users');

        database.findOne({
                email: req.params.email
            })
            .then(results => {
                if (results) {
                    delete results['password'];
                    delete results['token'];
                    res.send(results);

                } else {
                    res.status(404).send('User not found :(')
                }
            })
            .catch(err => {
                res.send(err)
            });
    }
    static createUser(req, res) {
        let newUser = {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        }
        const database = new Database('users');
        database.findOne({
                email: newUser.email
            }).then(result => {
                if (result !== null) {
                    res.status(403).send('User already exists');
                } else {
                    let encryptedPassword = bcrypt.hashSync(newUser.password, 10);
                    newUser.password = encryptedPassword;
                    const token = jwt.sign({
                            email: newUser.email
                        },
                        process.env.TOKEN_KEY, {
                            expiresIn: "24h",
                        }
                    );
                    newUser.token = token;
                    database.insertOne(newUser);
                    res.status(200).json(newUser);
                }
            })
            .catch(err => {res.send(err)});
    }

    static login(req,res) {
        let userData = {
            email: req.body.email
        }

        const database = new Database('users');
        database.findOne({
                email: userData.email
            })
            .then(result => {
                if(result && bcrypt.compareSync(req.body.password, result.password)){
                    const token = jwt.sign({
                        email: userData.email
                    },
                    process.env.TOKEN_KEY, {
                        expiresIn: "24h",
                    }
                );
                userData.token = token;
                database.updateOne({email: userData.email},
                    {
                        $set: {
                            token: userData.token
                    }
                });
                res.status(200).json(userData);
                }else{
                    res.status(401).send('Login failed')
                }
            })
            .catch(err => {res.status(401).send('Login failed')});
        }
}

module.exports = UsersController