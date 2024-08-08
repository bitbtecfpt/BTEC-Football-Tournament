const sql = require("../connectDB/connectDb.js");

const bets = function (bet) {
    this.round = bet.round;
    this.user_id = bet.user_id;
    this.match_id = bet.match_id;
    this.winner_pred = bet.winner_pred;
};

bets.create = (newbet, result) => {
    sql.query("INSERT INTO bets SET ?", newbet, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        console.log("created bet: ", {id: res.insertId, ...newbet});
        result(null, {id: res.insertId, ...newbet});
    });
}

bets.view = (result) => {
    sql.query("SELECT * FROM bets", (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        console.log("bet: ", res);
        result(null, res);
    });
}

module.exports = bets;