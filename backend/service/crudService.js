// service.js
const { appendRow, updateRow, deleteRow, getSheetByTitle } = require('../connectDB/connectSheet.js');

async function addRowToSheet(sheetTitle, row) {
    try {
        await appendRow(sheetTitle, row);
    } catch (error) {
        console.error('Error adding row to Google Sheet:', error);
    }
}

async function updateRowInSheet(sheetTitle, idValue, values) {
    try {
        await updateRow(sheetTitle, idValue, values);
    } catch (error) {
        console.error('Error updating row in Google Sheet:', error);
    }
}

async function deleteRowInSheet(sheetTitle, idValue) {
    try {
        await deleteRow(sheetTitle, idValue);
    } catch (error) {
        console.error('Error deleting row in Google Sheet:', error);
    }
}

module.exports = {
    addRowToSheet,
    updateRowInSheet,
    deleteRowInSheet,
};
