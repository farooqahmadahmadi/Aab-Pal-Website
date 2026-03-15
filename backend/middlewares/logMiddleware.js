const logService = require("../services/logService");

module.exports = async (req, res, next) => {

    const oldSend = res.send;

    res.send = async function (data) {

        try {

            const actionMap = {
                POST: "CREATE",
                PUT: "UPDATE",
                DELETE: "DELETE"
            };

            const action = actionMap[req.method];

            if (action && req.user) {
                await logService.createLog({
                    user_id: req.user.user_id,
                    action: action,
                    reference_table: req.baseUrl.replace("/api/", ""),
                    reference_record_id: req.params.id || null,
                    old_value: null,
                    new_value: req.body
                });

            }

        } catch (error) {
            console.error("Auto Log Error:", error);
        }

        oldSend.apply(res, arguments);
    };

    next();
};