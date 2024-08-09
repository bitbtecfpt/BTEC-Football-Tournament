const sql = require("../connectDB/connectDb.js");

const bets = function (bet) {
    this.round = bet.round;
    this.user_id = bet.user_id;
    this.match_id = bet.match_id;
    this.winner_pred = bet.winner_pred;
};
try {
    bets.create = (newbet, result) => {
        try{
            sql.query("INSERT INTO bets SET ?", newbet, (err, res) => {
                if (err) {
                    console.log("error: ", err);
                    result(err, null);
                }
                console.log("created bet: ", res);
                return result(null, res);
            });
        }catch (e) {
            console.error('Error:', e);
        }

    }

    bets.view = (result) => {
        try {
            sql.query("SELECT * FROM bets", (err, res) => {
                if (err) {
                    console.log("error: ", err);
                    return result(null, err);
                }

                console.log("bet: ", res);
                return result(null, res);
            });
        }
        catch (e) {
            console.error('Error:', e);
        }
    }

    module.exports = bets;
}
catch (e) {
    console.error('Error:', e);
}
