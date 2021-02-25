const express = require('express');
const { MongoClient } = require('mongodb');
const body_parser = require('body-parser');
require('dotenv').config();

const app = express();
app.use(express.static('public'));
app.use(body_parser.urlencoded({extended: false}));
app.use(body_parser.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT', 'POST', 'PATCH', 'DELETE', 'GET');
        return res.statusCode(200).json({});
    };
    next();
})


const uri = `${process.env.DATABASE_KEY}${process.env.DATABASE_HOST}`;
const port = 1402;

const calendar_buttons = 'calendar-buttons';
const user_information = 'user-information';


async function main() {
    const client = new MongoClient(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    try {    
        await client.connect()
        await listDatabases(client);
        await add_new_click(client);
        await add_user_location(client);
    } catch (error) {
        console.log(error);
    } finally {
        // await client.close();
    };
}

main();


async function listDatabases(client) {
    const databasesList = await client.db().admin().listDatabases();
    databasesList.databases.forEach(db => console.log(` - ${db.name}`));
}


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
})


app.listen(port, () => console.log(`Server is running... Port: ${port}`));


async function add_new_click(client) {    
    app.post('/calendar/:show', async (req, res) => {        
        const query = { name: req.params.show };
        const update = { $inc: { clicks: + 1 } }

        if (req.params.show.includes('apple')) {
            const apple = await client.db(calendar_buttons).collection('apple').updateOne(query, update);
            return apple;
        } else if (req.params.show.includes('google')) {
            const google = await client.db(calendar_buttons).collection('google').updateOne(query, update);
            return google;
        };
              
        try {
            res.status(200);  
        } catch (error) {
            res.status(500).send(error);
        };
    });
}


async function add_user_location(client) {
    app.post('/location', async (req, res) => {        
        const query_country = { country: req.body.country };
        const query_city = { city: req.body.city };
        const update = { $inc: { clicks: + 1 } };
        const options = { upsert: true }

        const country = await client.db(user_information).collection('country').updateOne(query_country, update, options);
        const city = await client.db(user_information).collection('city').updateOne(query_city, update, options);

        try {
            res.status(200);
        } catch (error) {
            res.status(500).send(error);
        };
    });
}