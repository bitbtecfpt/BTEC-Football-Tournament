
const sql = require("../connectDB/connectDb.js");
const {groupBetData,categoryPoint,checkTime} = require('../logic/calculator.js');

const data = function (data) {
    this.score_team_a = data.score_team_a;
    this.score_team_b = data.score_team_b;
    this.winner_pred = data.winner_pred;
    this.total_score = data.total_score;
    this.user_code = data.user_code;
    this.bet_id = data.bet_id;
}
const bets = function (bet) {
    this.total_score = bet.total_score;
    this.user_id = bet.user_id;
    this.match_id = bet.match_id;
    this.winner_pred = bet.winner_pred;
};
try {
    bets.create = (newbet, result) => {
        try {

            // kiểm tra xem đã cược chưa
            sql.query(`SELECT bets.*,
                              matches.start_time as start_time
                       FROM bets
                                left join matches on bets.match_id = matches.id
                       WHERE user_id = ?
                         AND match_id = ?`,
                [newbet.user_id, newbet.match_id], (err, res) => {
                    if (err || res.length) {
                        // error
                        if (err) {

                            console.log("error: ", err);
                            return result(err, null);
                        } else {
                            if(!checkTime(res[0].start_time)){
                                return result(null, { message: "đã hết thời gian cược"});
                            }
                            sql.query(`UPDATE bets
                                       SET winner_pred = ?,
                                           total_score = ?
                                       WHERE user_id = ?
                                         AND match_id = ?`,
                                [newbet.winner_pred, newbet.total_score, newbet.user_id, newbet.match_id],
                                (err, res) => {
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
                            return result(null, { message: "đã cược thành công"});
                        });
                    }
                });
        } catch (e) {
            console.error('Error:', e);
        }

    }

    bets.view = (result) => {
        try {
            let dataBets = [];
            sql.query(`SELECT bets.id              as bet_id,
                          matches.score_team_a as score_team_a,
                          matches.score_team_b as score_team_b,
                          users.user_code      as user_code,
                          bets.winner_pred     as winner_pred,
                          bets.total_score     as total_score
                   FROM bets
                            left join matches on bets.match_id = matches.id
                            left join users on bets.user_id = users.id`, (err, res) => {
                if (err) {
                    console.log("error: ", err);
                    return result(null, err);
                }
                if (res.length) {
                    dataBets = res.map(row => new data({
                        score_team_a: row.score_team_a,
                        score_team_b: row.score_team_b,
                        winner_pred: row.winner_pred,
                        total_score: row.total_score,
                        user_code: row.user_code,
                        bet_id: row.bet_id
                    }))
                }

                //lặp qua từng dòng dữ liệu trong dataBets
                let allPoint = categoryPoint(dataBets);
                
                return result(null, {list:groupBetData(allPoint)});
            });
        } catch (e) {
            console.error('Error:', e);
        }
    }

    module.exports = bets;
} catch (e) {
    console.error('Error:', e);
}
