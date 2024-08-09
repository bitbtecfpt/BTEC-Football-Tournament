// app.js (hoặc index.js, tùy thuộc vào cấu trúc dự án của bạn)
const express = require('express');
const cors = require("cors");
const bodyParser = require('body-parser');
const userController = require('./controller/userController.js');
const matchesController = require('./controller/matchesController.js');
const betsController = require('./controller/betsController.js');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;
const corsOptions = {
    origin: ["http://localhost:5500", "http://127.0.0.1:5500", "https://football.btecit.tech"]
};

app.use(cors(corsOptions));
app.set('view engine', 'ejs');
app.use(bodyParser.json({ extended: true }));

app.post('/info', userController.addUser);
app.get('/info', userController.infoUser);

app.get('/matches', matchesController.viewAllMatches);

app.post('/bets', betsController.addBet);
app.get('/bets', betsController.getBets);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
