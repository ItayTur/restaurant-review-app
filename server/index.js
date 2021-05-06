const app = require('./server.js');
const dotenv = require('dotenv');
const mongodb = require('mongodb');

dotenv.config();

const port = process.env.PORT || 8000;

const { MongoClient } = mongodb;

MongoClient.connect(
    process.env.RESTREVIEWS_DB_URI,
    {
        poolSize: 50,
        wtimeout: 2500,
        useNewUrlParser: true,
    }
).catch(err => {
    console.error(err.stack);
    process.exit(1);
}).then(async client => {
    app.listen(port, () => {
        console.log(`listening on port ${port}`);
    })
});