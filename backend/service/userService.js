const sql = require("../connectDB/connectDb.js");

const user = function (user) {
    this.user_code = user.user_code;
    this.user_name = user.user_name;
    this.phone_number = user.phone_number;
};

user.create = (user, result) => {
    // Check if phone_number already exists
    try {
        sql.query("SELECT * FROM users WHERE phone_number = ? OR user_code = ?",
            [user.phone_number, user.user_code], (err, res) => {
                if (err || res.length) {
                    if (err) {
                        console.log("error: ", err);
                        result(err, null);
                    } else {
                        if (res[0].phone_number === user.phone_number && res[0].user_code === user.user_code) {
                            sql.query(`UPDATE users SET user_code = ?, user_name = ? WHERE phone_number = ?`, [user.user_code, user.user_name, user.phone_number], (err, res) => {
                                if (err) {
                                    console.log("error: ", err);
                                    return result(err, null);
                                }
                            });

                            sql.query(`UPDATE users SET phone_number = ?, user_name = ? WHERE user_code = ?`, [user.phone_number, user.user_name, user.user_code], (err, res) => {
                                if (err) {
                                    console.log("error: ", err);
                                    return result(err, null);
                                }
                            });
                        }
                        sql.query("SELECT * FROM users WHERE phone_number = ? OR user_code = ?", [user.phone_number, user.user_code], (err, res) => {
                            if (err) {
                                console.log("error: ", err);
                                result(err, null);
                            } else {
                                result(null, res);
                            }
                        });
                    }

                } else {
                    sql.query("INSERT INTO users SET ?", user, (err, res) => {
                        if (err) {
                            console.log("error: ", err);
                            result(err, null);
                        }
                        sql.query("SELECT * FROM users WHERE phone_number = ? OR user_code = ?", [user.phone_number, user.user_code], (err, res) => {
                            if (err) {
                                console.log("error: ", err);
                                result(err, null);
                            } else {
                                result(null, res);
                            }
                        });
                    });
                }
            });

    } catch (e) {
        console.error('Error:', e);
        return result('Có lỗi xảy ra', null);
    }

}

user.view = (user_code, result) => {
    sql.query(`SELECT * FROM users WHERE user_code = '${user_code}'`, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }
        result(null, res);
    });
}

module.exports = user;