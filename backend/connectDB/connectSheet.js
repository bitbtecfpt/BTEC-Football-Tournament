//const { GoogleSpreadsheet } = require('google-spreadsheet');
const { google } = require('googleapis');
require('dotenv').config();
const fs = require('fs');


const PRIVATE_KEY = process.env.PRIVATE_KEY.replace(/\\n/g, '\n');
const CLIENT_EMAIL = process.env.CLIENT_EMAIL;
const SHEET_ID = process.env.SHEET_ID;

const serviceAccountAuth = new google.auth.JWT({
    email: CLIENT_EMAIL,
    key: PRIVATE_KEY,
    scopes: [
        'https://www.googleapis.com/auth/spreadsheets',
    ],
});

const sheets = google.sheets({ version: 'v4', auth: serviceAccountAuth });


async function connectToGoogleSheet() {
    try {
        await serviceAccountAuth.authorize();
        console.log('Successfully connected to Google Sheets');
    } catch (error) {
        console.error('Error connecting to Google Sheets:', error);
    }
}

// async function getSheetByTitle(title) {
//     try {
//         const doc = await sheets.spreadsheets.get({
//             spreadsheetId: SHEET_ID,
//         });
//         const sheet = doc.data.sheets.find(sheet => sheet.properties.title === title);
//         if (!sheet) {
//             throw new Error(`Sheet with title "${title}" not found`);
//         }
//         return sheet;
//     } catch (error) {
//         console.error('Error getting sheet:', error);
//     }
// }

async function getNextId(sheetTitle) {
    try {
        const data = await getSheetData(sheetTitle);
        const headers = data[0];
        const idIndex = headers.indexOf('id'); // Giả sử cột id có tên là 'id'
        if (idIndex === -1) {
            throw new Error(`Column "id" not found`);
        }
        const ids = data.slice(1).map(row => parseInt(row[idIndex], 10)).filter(Number.isInteger);
        return ids.length ? Math.max(...ids) + 1 : 1;
    } catch (error) {
        console.error('Error getting next id:', error);
        return null;
    }
}

async function appendRow(sheetTitle, values) {
    try {
        const data = await getSheetData(sheetTitle);
        const headers = data[0];
        const idIndex = headers.indexOf('id'); // Giả sử cột id có tên là 'id'

        if (sheetTitle !== 'predicted') {
            const nextId = await getNextId(sheetTitle);
            values[idIndex] = nextId.toString(); // Chuyển đổi giá trị id thành chuỗi
        }

        const rowExists = data.slice(1).some(row => row[idIndex] === values[idIndex]);
        if (rowExists) {
            throw new Error(`Row with id="${values[idIndex]}" already exists`);
        }

        const response = await sheets.spreadsheets.values.append({
            spreadsheetId: SHEET_ID,
            range: `${sheetTitle}`,
            valueInputOption: 'RAW',
            insertDataOption: 'INSERT_ROWS',
            requestBody: {
                values: [values],
            },
        });
    } catch (error) {
        console.error('Error appending data to Google Sheets:', error);
    }
}

// async function updateRow(sheetTitle, idValue, values) {
//     try {
//         const data = await getSheetData(sheetTitle);
//         const headers = data[0];
//         let idIndex = 0;
//
//         if(sheetTitle !== "user"){
//             idIndex = headers.indexOf('msv');
//         }
//         else{
//             idIndex = headers.indexOf('id');
//         }
//
//         if (idIndex === -1) {
//             throw new Error(`Column "id" not found`);
//         }
//         const rowIndex = data.findIndex(row => row[idIndex] === idValue);
//         if (rowIndex === -1) {
//             throw new Error(`Row with id="${idValue}" not found`);
//         }
//         const range = `${sheetTitle}!A${rowIndex + 1}:${String.fromCharCode(65 + values.length - 1)}${rowIndex + 1}`;
//         const response = await sheets.spreadsheets.values.update({
//             spreadsheetId: SHEET_ID,
//             range: range,
//             valueInputOption: 'RAW',
//             requestBody: {
//                 values: [values],
//             },
//         });
//         console.log('Data updated successfully:', response.data);
//     } catch (error) {
//         console.error('Error updating data in Google Sheets:', error);
//     }
// }
//
// async function deleteRow(sheetTitle, idValue) {
//     try {
//         const data = await getSheetData(sheetTitle);
//         const headers = data[0];
//         const idIndex = headers.indexOf('id');
//         if (idIndex === -1) {
//             throw new Error(`Column "id" not found`);
//         }
//         const rowIndex = data.findIndex(row => row[idIndex] === idValue);
//         if (rowIndex === -1) {
//             throw new Error(`Row with id="${idValue}" not found`);
//         }
//         const sheet = await getSheetByTitle(sheetTitle);
//         const sheetId = sheet.properties.sheetId;
//
//         const response = await sheets.spreadsheets.batchUpdate({
//             spreadsheetId: SHEET_ID,
//             requestBody: {
//                 requests: [
//                     {
//                         deleteDimension: {
//                             range: {
//                                 sheetId: sheetId,
//                                 dimension: 'ROWS',
//                                 startIndex: rowIndex,
//                                 endIndex: rowIndex + 1,
//                             },
//                         },
//                     },
//                 ],
//             },
//         });
//         console.log('Row deleted successfully:', response.data);
//     } catch (error) {
//         console.error('Error deleting row in Google Sheets:', error);
//     }
// }

async function getSheetData(sheetTitle) {
    try {
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SHEET_ID,
            range: sheetTitle,
        });
        return transformData(response.data.values);
    } catch (error) {
        console.error('Error getting sheet data:', error);
        return null;
    }
}

async function getSheetDataById(sheetTitle, id) {
    try {
        const data = await getSheetData(sheetTitle);
        const headers = data[0];
        let idIndex = 0;

        if(sheetTitle !== "user"){
            idIndex = headers.indexOf('msv');
        }
        else{
            idIndex = headers.indexOf('id');
        }

        if (idIndex === -1) {
            throw new Error(`Column "id" not found`);
        }
        const row = data.find(row => row[idIndex] === id);
        if (!row) {
            throw new Error(`Row with id="${id}" not found`);
        }
        return headers.reduce((obj, key, index) => {
            obj[key] = row[index];
            return obj;
        }, {});
    } catch (error) {
        console.error('Error getting row by ID:', error);
        return null;
    }
}

function transformData(data) {
    const [keys, ...rows] = data;
    return rows.map(row => {
        return keys.reduce((obj, key, index) => {
            obj[key] = row[index];
            return obj;
        }, {});
    });
}

module.exports = {
    connectToGoogleSheet,
    getSheetData,
    appendRow,
    // updateRow,
    // deleteRow,
    getSheetDataById,
    //getSheetByTitle,
};