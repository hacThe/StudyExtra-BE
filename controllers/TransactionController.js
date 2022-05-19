const User = require("../models/users");
const Transaction = require("../models/transaction");


class TransactionController {
    createDepositRequest = async (req, res) => {
       // const username = "tanthanh3"
       const username = res.locals.data.username
        const amount = req.body.amount
        const context = req.body.context

        try {
            const user = await User.findOne({ username: username }).exec();
            if (!user) return res.status(400).send(
                JSON.stringify({
                    message: "user not found"
                })
            )
            const balance = user.gem + amount;
            const transaction = new Transaction({
                username: username,
                amount: amount,
                balance: balance,
                status: "waiting",
                type: "deposit",
                context: context,
                note: "Nạp GEM vào tài khoản"
            })
            transaction.save().then((data) => {
                res.status(200).send(
                    JSON.stringify({
                        message: "Successfully",
                        data: data
                    })
                )
            })
            .catch((error)=>{
                res.status(400).send(error);
            })
        }
        catch (error) {
            res.status(400).send(error);
        }
    }

}

module.exports = new TransactionController();