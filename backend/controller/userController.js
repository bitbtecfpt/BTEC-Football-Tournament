const moment = require('moment');
const model = require('../service/userService.js');
const e = require('express');

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
                    data: null,
                    message:
                        err.message || "Some error occurred while creating the user. " + err
                });
            else {return res.send({
                message: 'Thêm user thành công',
                data: data
            }); }
        });
    } catch (e) {
        console.error('Error:', e);
        return res.send('Oops! Something went wrong, check logs console for detail...');
    }
}

let infoUser = async (req, res) => {
    try {
        let user_code = req.query.user_code || req.params.user_code;
        if (!user_code || user_code === '' || user_code === 'undefined' || user_code === 'null' || user_code === null || user_code === undefined) {
            res.status(400).send({
                message: "Content can not be empty!"
            });
        }
        // lower case user_code
        user_code = user_code.toLowerCase();
        model.view(user_code, (err, data) => {
            if (err) {
                return res.status(500).send({
                    info: null,
                    message: err.message || "Lỗi khi lấy thông tin user: " + err
                });
            } else {
                if (data.length === 0) {
                    return res.status(404).send({
                        info: null,
                        message: 'Không tìm thấy user'
                    });
                }else{
                    data = data[0];
                }

                return res.json({
                    info: data,
                    message: 'Lấy thông tin user thành công'
                });
            }
        });
    } catch (e) {
        console.error('Error:', e);
        return res.status(500).send('Có lỗi xảy ra, vui lòng kiểm tra lại');
    }
};

module.exports = {
    //getHomepage,
    addUser,
    infoUser,
};
