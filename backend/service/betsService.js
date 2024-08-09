const sql = require("../connectDB/connectDb.js");

const bets = function (bet) {
    this.total_score = bet.total_score;
    this.user_id = bet.user_id;
    this.match_id = bet.match_id;
    this.winner_pred = bet.winner_pred;
};
try {
    bets.create = (newbet, result) => {
        try {
            sql.query("SELECT * FROM bets WHERE user_id = ? AND match_id = ?",
                [newbet.user_id, newbet.match_id], (err, res) => {
                    if (err || res.length) {
                        // error
                        if (err) {

                            console.log("error: ", err);
                            return result(err, null);
                        } else {
                            sql.query(`UPDATE bets
                                       SET winner_pred = ?,
                                           total_score = ?
                                       WHERE user_id = ?
                                         AND match_id = ?`,
                                [newbet.winner_pred, newbet.total_score, newbet.user_id, newbet.match_id], (err, res) => {
                                    if (err) {

                                        console.log("error: ", err);
                                        return result(err, null);
                                    }
                                    return result(null, { message: "đã cược thành công"});
                                });
                        }
                    } else {
                        sql.query("INSERT INTO bets SET ?", newbet, (err, res) => {
                            if (err) {
                                console.log("error: ", err);
                                return result(err, null);
                            }
                            console.log("created bet: ", res);
                            return result(null, "đã cược thành công");
                        });
                    }
                });
        } catch (e) {
            console.error('Error:', e);
        }

    }

    bets.view = (result) => {
        try {
            sql.query("SELECT * FROM bets", (err, res) => {
                if (err) {
                    console.log("error: ", err);
                    return result(err, null);
                }

                console.log("bet: ", res);
                return result(null, res);
            });
        } catch (e) {
            console.error('Error:', e);
        }
    }

    module.exports = bets;
} catch (e) {
    console.error('Error:', e);
}
