const sql = require("../connectDB/connectDb.js");

const user = function (user) {
    this.user_code = user.user_code;
    this.user_name = user.user_name;
    this.phone_number = user.phone_number;
};

user.create = (user, result) => {
    // Check if phone_number already exists
    try{
        sql.query("SELECT * FROM users WHERE phone_number = ? OR user_code = ?",
            [user.phone_number, user.user_code], (err, res) => {
                if (err || res.length) {
                    if (err) {
                        console.log("error: ", err);
                        result(err, null);
                    } else {
                        result({ kind: "phone_number_or_user_code_exists" }, null);
                    }
                    process.exit(1);
                }
            });
        sql.query("INSERT INTO users SET ?", user, (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(err, null);
                process.exit(1);
            }

            console.log("created user: ", {id: res.insertId, ...user});
            result(null, {id: res.insertId, ...user});
        });
    }catch (e) {
        console.error('Error:', e);
        return res.send('Oops! Something went wrong, check logs console for detail...');
    }

}

user.view = (result) => {
    sql.query("SELECT * FROM users", (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        console.log("user: ", res);
        result(null, res);
    });
}

module.exports = user;