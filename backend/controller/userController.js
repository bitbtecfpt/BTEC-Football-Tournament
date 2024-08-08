const moment = require('moment');
const model = require('../service/userService.js');

let addUser = async (req, res) => {
    try {
        if (!req.body) {
            res.status(400).send({
                message: "Content can not be empty!"
            });
        }

        // Create a Tutorial
        const user = new model({
            user_code: req.body.user_code,
            user_name: req.body.user_name,
            phone_number: req.body.phone_number,
        });

        // Save Tutorial in the database
        model.create(user, (err, data) => {
            if (err)
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while creating the user."
                });
            else {return res.send('Writing data succeeds!')}
        });
    } catch (e) {
        console.error('Error:', e);
        return res.send('Oops! Something went wrong, check logs console for detail...');
    }
}

let infoUser = async (req, res) => {
    try {
        model.view((err, data) => {
            if (err) {
                return res.status(500).send({
                    message: err.message || "Some error occurred while retrieving users."
                });
            } else {
                return res.json(data);
            }
        });
    } catch (e) {
        console.error('Error:', e);
        return res.status(500).send('Oops! Something went wrong, check logs console for detail...');
    }
};

module.exports = {
    //getHomepage,
    addUser,
    infoUser,
};
