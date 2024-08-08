const moment = require('moment');
const { addRowToSheet,updateRowInSheet,deleteRowInSheet} = require('../service/crudService.js');
const { connectToGoogleSheet, getSheetData, getSheetDataById } = require('../connectDB/connectSheet.js');

// Kết nối với Google Sheets khi khởi động ứng dụng
connectToGoogleSheet().then(r => console.log(r));

let getHomepage = async (req, res) => {
    return res.render("homepage.ejs");
};

let addData = async (req, res) => {
    try {

        // Thêm dữ liệu vào sheet có tên "Sheet1"
        await addRowToSheet("user", ['BH00626', 'do duc thang', '0321456789']);

        return res.send('Writing data to Google Sheet succeeds!');
    } catch (e) {
        console.error('Error:', e);
        return res.send('Oops! Something went wrong, check logs console for detail...');
    }
}
let updateData = async (req, res) => {
    try {
        await updateRowInSheet("user", "BH00625", ['BH00666', 'truong van diep', '03214567543']);
        return res.send('Updating data in Google Sheets succeeds!');
    } catch (e) {
        console.error('Error:', e);
        return res.send('Oops! Something went wrong, check logs console for detail...');
    }
};

let deleteData = async (req, res) => {
    try {
        await deleteRowInSheet("user", "BH00666");
        return res.send('Deleting row from Google Sheets succeeds!');
    } catch (e) {
        console.error('Error:', e);
        return res.send('Oops! Something went wrong, check logs console for detail...');
    }
};

let getGoogleSheet = async (req, res) => {
    try {
        const data = await getSheetData("user");
        return res.json(data);
    } catch (e) {
        console.error('Error:', e);
        return res.send('Oops! Something went wrong, check logs console for detail...');
    }
};

let getRowByIdEndpoint = async (req, res) => {
    try {
        //const { sheetTitle, idValue } = req.params;
        const data = await getSheetDataById("user", "BH00625");
        return res.json(data);
    } catch (e) {
        console.error('Error:', e);
        return res.send('Oops! Something went wrong, check logs console for detail...');
    }
};

module.exports = {
    getHomepage,
    addData,
    updateData,
    deleteData,
    getGoogleSheet,
    getRowByIdEndpoint,
};
