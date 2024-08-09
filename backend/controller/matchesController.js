const moment = require('moment');
const model = require('../service/matchesService.js');

let viewAllMatches = async (req, res) => {
    try {
        let user_id = req.query.user_id || req.params.user_id;
        model.view(user_id, (err, data) => {
            if (err)
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while retrieving matches."
                });
            else res.send(data);
        });
    } catch (e) {
        console.error('Error:');
        return res.send('Oops! Something went wrong, check logs console for detail...');
    }
}

// let addMatch = async (req, res) => {
//     try {
//         if (!req.body) {
//             res.status(400).send({
//                 message: "Content can not be empty!"
//             });
//         }
//
//         const match = {
//             round: req.body.round,
//             start_time: req.body.start_time,
//             end_time: req.body.end_time,
//             team_a: req.body.team_a,
//             team_b: req.body.team_b,
//             score_team_a: req.body.score_team_a,
//             score_team_b: req.body.score_team_b,
//             created_at: moment().format('YYYY-MM-DD HH:mm:ss')
//         };
//
//         model.create(match, (err, data) => {
//             if (err)
//                 res.status(500).send({
//                     message:
//                         err.message || "Some error occurred while creating the match."
//                 });
//             else res.send(data);
//         });
//     } catch (e) {
//         console.error('Error:', e);
//         return res.send('Oops! Something went wrong, check logs console for detail...');
//     }
// }

module.exports = {
    viewAllMatches,
    // addMatch,
};
