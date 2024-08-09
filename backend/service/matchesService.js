const sql = require("../connectDB/connectDb.js");

const matches = function (match) {
    this.round = match.round;
    this.start_time = match.start_time;
    this.end_time = match.end_time;
    this.team_a = match.team_a;
    this.team_b = match.team_b;
    this.score_team_a = match.score_team_a;
    this.score_team_b = match.score_team_b;
};
try {
    matches.create = (newMatch, result) => {
        try {
            sql.query("INSERT INTO matches SET ?", newMatch, (err, res) => {
                if (err) {

                    // trả ra error
                    console.log("error: ", err);
                    return result(err, null);
                }

                // trả ra response
                console.log("created match: ", res);
                return result(null, res);
            });
        } catch (e) {
            console.error('Error:', e);
        }
    }

    matches.view = (user_id, result) => {
        try {
            sql.query(`
                SELECT matches.*,
                       teams_a.name                                      as team_a,
                       teams_b.name                                      as team_b,
                       matches.team_a                                    as team_a_id,
                       matches.team_b                                    as team_b_id,
                       DATE_FORMAT(matches.start_time, "%H:%i %d/%m/%Y") as start_time
                    ${(user_id !== null && user_id !== undefined && user_id !== 'undefined') ? `, bets.winner_pred, bets.total_score` : ''}

                FROM matches
                         LEFT join teams as teams_a on teams_a.id = matches.team_a
                         LEFT join teams as teams_b on teams_b.id = matches.team_b
                    ${(user_id !== null && user_id !== undefined && user_id !== 'undefined') ? `LEFT JOIN bets ON bets.match_id = matches.id AND bets.user_id = ${user_id}` : ''}
                WHERE matches.team_a <> 7
                ORDER BY matches.id ASC
            `, (err, res) => {
                if (err) {

                    // trả ra error
                    console.log("error: ", err);
                    return result(err, null);
                }

                // trả ra response
                console.log("match: ", res);
                return result(null, res);
            });
        } catch (e) {
            console.error('Error:', e);
        }
    }

    module.exports = matches;
} catch (e) {
    console.error('Error:', e);
}