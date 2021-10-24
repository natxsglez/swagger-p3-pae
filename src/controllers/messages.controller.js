const Database = require('./../models/database');
const path = require('path');

class MessagesController {
    static getAllMessagesByChat(req, res){
        const database = new Database('chats');

        database.findOne({
            chatName: req.params.chatName
        })
        .then((results) => {
            if(results && results.users.find(e => e === req.headers.email)){
                res.status(200).send(results.messages);
            }else{
                res.status(404).send('No se encontró el chat');
            }
        })
        .catch(err => {res.send(err)});
    }

    static addMessage(req,res) {
        const database = new Database('chats');
        const message = {
            date: new Date(),
            creator: req.body.creator,
            message: req.body.message
        }

        database.findOne({
            chatName: req.params.chatName
        })
        .then((results) => {
            if(results && results.users.find(e => e === req.body.creator)){
                results.messages.push(message);
                database.updateOne({chatName: req.params.chatName},
                    {
                        $set: {
                            messages: results.messages
                    }
                });
                res.status(200).send('Message added successfully');
            }else{
                res.status(404).send('No se encontró el chat');
            }
        })
        .catch(err => {res.send(err)});
    }
}

module.exports = MessagesController;