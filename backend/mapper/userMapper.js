// const {SHEET_ID, sheets} = require('../connectDB/connectSheet.js');
//
// async function appendRow(sheetTitle, values) {
//     try {
//         const response = await sheets.spreadsheets.values.append({
//             spreadsheetId: SHEET_ID,
//             range: `${sheetTitle}`,
//             valueInputOption: 'RAW',
//             insertDataOption: 'INSERT_ROWS',
//             requestBody: {
//                 values: [values],
//             },
//         });
//         console.log('Data appended successfully:', response.data);
//     } catch (error) {
//         console.error('Error appending data to Google Sheets:', error);
//     }
// }
//
// module.exports = {
//     appendRow,
// };