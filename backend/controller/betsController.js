const model = require('../service/betsService.js');

let getBets = async (req, res) => {
    try {
        model.view((err, data) => {
            if (err)
                return res.status(500).send({
                    message:
                        err.message || "Some error occurred while retrieving bets."
                });
            else {
                console.log(data);
                return res.send(data);
            } 
            
        });
    } catch (e) {
        console.error('Error:', e);
        return res.send('Oops! Something went wrong, check logs console for detail...');
    }
}

let addBet = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).send({
                message: "Content can not be empty!"
            });
        }
        const bet = {
            user_id: req.body.user_id,
            match_id: req.body.match_id,
            winner_pred: req.body.winner_pred,
            total_score: req.body.total_score
        };
        model.create(bet, (err, data) => {
            if (err)
                return res.status(500).send({
                    message:
                        err.message || "Some error occurred while creating the bet."
                });
            else return res.send(data);
        });
    } catch (e) {
        console.error('Error:', e);
        return res.send('Oops! Something went wrong, check logs console for detail...');
    }
}

module.exports = {
    getBets,
    addBet,
};