const express = require('express');
const app = express();
const path = require('path');
const router = express.Router();
const Database = require('./src/models/database');
const apiRoutes = require('./src/routes');
const swaggerUI =  require('swagger-ui-express');
const swaggerJsDoc =  require('swagger-jsdoc');

const MongoClient = require('mongodb').MongoClient;

if(process.env.NODE_ENV === 'dev') {
    require('dotenv').config();
}

const port = process.env.PORT;

const swaggerOptions = {
    swaggerDefinition: {
        swagger: "2.0",
        info: {
            title: "Chat API",
            description: "Documentation for Chat API",
            version: "1.0.0",
            servers: ['http://localhost'+port],
            contact: {
                name: "NXSG",
                email: "nat@example.com"
            }
        }
    },
    apis: ['app.js', `./src/routes/*.js`]
}

let database;

app.use('/assets', express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.use(router);
app.use('/api', apiRoutes);

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/swagger-ui', swaggerUI.serve, swaggerUI.setup(swaggerDocs));

// Connect to MongoDB
MongoClient.connect(process.env.MONGO_URL, {
    useUnifiedTopology: true
}, function(err, client) {
    if(err) {
        console.log('Failed to connect to MongoDB');
    } else {
        console.log('Conexión a BD exitosa');

        database = client.db();

        Database.setDatabase(database);

        app.listen(port, () => {
            console.log('App is listening in port ' + port);
        });

    }
});