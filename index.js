const express = require('express')
const app = express();
require('dotenv').config();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')

const routerApiVer1 = require("./api/v1/router/index.router");

const database = require("./config/database")
const port = process.env.PORT

database.connect();

// parse application/json
app.use(bodyParser.json());

app.use(cookieParser());

routerApiVer1(app);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})