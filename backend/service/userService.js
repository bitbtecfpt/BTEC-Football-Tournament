const sql = require("../connectDB/connectDb.js");

const user = function (user) {
    this.user_code = user.user_code;
    this.user_name = user.user_name;
    this.phone_number = user.phone_number;
};

user.create = (newUser, result) => {
    // Check if phone_number already exists
    try{
        sql.query("SELECT * FROM users WHERE phone_number = ?", [newUser.phone_number], (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(err, null);
                return;
            }

            if (res.length) {
                // Phone number already exists
                result({kind: "phone_number_exists"}, null);
                return;
            }
        });
        sql.query("INSERT INTO users SET ?", newUser, (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(err, null);
                return;
            }

            console.log("created user: ", {id: res.insertId, ...newUser});
            result(null, {id: res.insertId, ...newUser});
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