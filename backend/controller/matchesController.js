const model = require('../service/matchesService.js');

let viewAllMatches = async (req, res) => {
    try {
        let user_id = req.query.user_id || req.params.user_id;
        model.view(user_id, (err, data) => {
            if (err)
                return res.status(500).send({
                    message:
                        err.message || "Some error occurred while retrieving matches."
                });
            else return res.send(data);
        });
    } catch (e) {
        console.error('Error:');
        return res.send('Oops! Something went wrong, check logs console for detail...');
    }
}

module.exports = {
    viewAllMatches,
    // addMatch,
};
