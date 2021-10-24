const Database = require('./../models/database');
const path = require('path');

class ChatsController {
    static createInvite(chatName, url){
        let newUrl = url.substring(0, url.length - 7) + `invite/${chatName}`;
        return newUrl;
    }

    static getAllChats(req, res) {
        const database = new Database('chats');
        database.find().toArray((err, results) => {
            if (err) {
                res.status(400).send('database error');
            }
            if (results.length === 0) {
                res.status(404).send('chats not found');
            } else {
                res.send(results);
            }
        });
    }

    static getChatByName(req, res) {
        const database = new Database('chats');

        database.findOne({
                chatName: req.params.chatName
            })
            .then((results) => {
                    if (results) {
                        res.send(results);

                    } else {
                        res.status(404).send('No se encontró el chat');
                        return;
                    }
                })
            .catch(err => {res.status(400).send('Ups! :c')});
    }
    static createChat(req,res){
        let newChat = {
            chatName: req.body.chatName,
            owner: req.body.owner,
            users: [req.body.owner]
        }
        const database = new Database('chats');
        database.findOne({
            chatName: newChat.chatName
        }).then(result => {
            if(result !== null){
                res.status(403).send('Chat already exists');
            }else{
                let url = req.protocol + '://' + req.get('host') + req.originalUrl
                newChat.invite = ChatsController.createInvite(newChat.chatName, url);
                database.insertOne(newChat);
                res.status(200).send('Chat created: ' + newChat.invite);
            }
        })
        .catch(err => {res.status(400).send('Upsi! :c')});
    }

    static addUserToChat(req,res){
        const database = new Database('chats');
        database.findOne({
                chatName: req.params.chatName
            })
            .then(results => {
                if (results.users.find(e => e === req.body.userName) === undefined) {
                    results.users.push(req.body.userName);
                    database.updateOne({chatName: req.params.chatName},
                        {
                            $set: {
                                users: results.users
                        }
                    });
                    res.send(results);
                } else {
                    res.status(418).send('User already added to chat');
                    return;
                }
            })
            .catch(err => {res.send(err)});}

    static getInviteLink(req,res) {
        const database = new Database('chats');
        database.findOne({
                chatName: req.params.chatName
            })
            .then(results => {
                if(results && results.owner === req.body.user){
                    res.status(200).send(results.invite);
                }else{
                    res.status(418).send(`Not authorized or couldn't find the chat`);
                }
            })
    }
}

module.exports = ChatsController