// app.js (hoặc index.js, tùy thuộc vào cấu trúc dự án của bạn)
const express = require('express');
const app = express();
const controller = require('./controller/crudController');

app.set('view engine', 'ejs');

app.get('/', controller.getHomepage);
app.get('/add-data', controller.addData);
app.get('/update-data', controller.updateData);
app.get('/delete-data', controller.deleteData);
app.get('/get-data', controller.getGoogleSheet);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
