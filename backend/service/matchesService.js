const sql = require("../connectDB/connectDb.js");

const matches = function (match) {
    this.round = match.round;
    this.start_time = match.start_time;
    this.end_time = match.end_time;
    this.team_a = match.team_a;
    this.team_b = match.team_b;
    this.score_team_a = match.score_team_a;
    this.score_team_b = match.score_team_b;
    this.created_at = match.created_at;
    this.updated_at = match.updated_at;
};

matches.create = (newMatch, result) => {
    sql.query("INSERT INTO matches SET ?", newMatch, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        console.log("created match: ", {id: res.insertId, ...newMatch});
        result(null, {id: res.insertId, ...newMatch});
    });
}

matches.view = (result) => {
    sql.query("SELECT * FROM matches", (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        console.log("match: ", res);
        result(null, res);
    });
}