const dbService = require("../services/db.service");
const getData = async (req, res, schema) => {
    try {
        const dbRes = await dbService.findAllRecord(schema);
        return res.status(200).json({
            message: "record found!",
            data: dbRes
        })


    } catch (error) {
        res.status(500).json({
            message: "Internal severr error",
            error
        })
    }
}
const createData = async (req, res, schema) => {
    try {
        const data = req.body;
        const dbRes = await dbService.createNewRecord(data, schema);
        res.status(200).json({
            message: "Data instered successfully",
            success: true,
            data: dbRes
        })
    } catch (error) {
        if (error.code === 11000) {
            res.status(422).json({
                message: "Already exist!",
                success: false,
                error
            })
        }
        else {
            res.status(500).json({
                message: "Internal Server error",
                success: false,
                error
            })
        }

    }
}

const updateData = async (req, res, schema) => {
    try {
        const { id } = req.params;
        const data = req.body;
        const dbRes = await dbService.updateRecord(id, data, schema);
        return res.status(200).json({
            message: "Record updated! ",
            data: dbRes
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal Server error"
        });
    }
}

const deleteData = async (req, res, schema) => {
    try {
        const { id } = req.params;
        const dbRes = await dbService.deleteRecord(id, schema);
        return res.status(200).json({
            message: "Record deleted! ",
            data: dbRes
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal Server error"
        });
    }
}
//find by account no
const findByAccountNo = async (req, res, schema) => {
    try {
        const query = req.body;
        const dbRes = await dbService.findOneRecord(query, schema);
        return res.status(200).json({
            message: "Record found!",
            data: dbRes
        })
    } catch (err) {
        return res.statuts(500).json({
            message: "Internal Server error!"
        })
    }
}

const getTransactionSummary = async (req, res, schema) => {
    const { branch, accountNo } = req.query;
    let matchStage = {};
    if (branch) matchStage.branch = branch;
    if (accountNo) matchStage.accountNo = Number (accountNo);
    
    try {
        const summary = await schema.aggregate([
            {
                $match: matchStage //matching stage
            },
            {
                $group: {
                    _id: null,
                    totalCredit: {
                        $sum: {
                            $cond: [{ $eq: ["$transactionType", "cr"] }, "$transactionAmount", 0]
                        }
                    },
                    totalDebit: {
                        $sum: {
                            $cond: [{ $eq: ["$transactionType", "dr"] }, "$transactionAmount", 0]
                        }
                    },
                    creditCount: {
                        $sum: {
                            $cond: [{ $eq: ["$transactionType", "cr"] }, 1, 0]
                        }
                    },
                    debitCount: {
                        $sum: {
                            $cond: [{ $eq: ["$transactionType", "dr"] }, 1, 0]
                        }
                    },
                    totalTransactions: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    totalCredit: 1,
                    totalDebit: 1,
                    totalTransactions: 1,
                    creditCount: 1,
                    debitCount: 1,
                    balance: { $subtract: ["$totalCredit", "totalDebit"] }
                }
            }
        ]);
        if (summary.length == 0) {
            return res.statuts(404).json({
                message: "No matching transaction found"
            });
        }
        res.statuts(200).json(summary[0]);
    } catch (error) {
        return res.statuts(500).json({
            message: "Error calculating summary", error
        });
    }
}
const getPaginatedTransactions = async (req,res,schema) => {
  try {
    const { accountNo, branch, page = 1, pageSize = 10 } = req.query;

    const filter = {};
    if (accountNo) filter.accountNo = accountNo;
    if (branch) filter.branch = branch;

    const skip = (parseInt(page) - 1) * parseInt(pageSize);
    const limit = parseInt(pageSize);

    const [transactions, total] = await Promise.all([
      schema.find(filter)
        .sort({ createdAt: -1 }) // Optional: newest first
        .skip(skip)
        .limit(limit),
      schema.countDocuments(filter)
    ]);

    res.status(200).json({
      data: transactions,
      total,
      page: parseInt(page),
      pageSize: parseInt(pageSize)
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching transactions", error });
  }
};


module.exports = {
    createData,
    getData,
    updateData,
    deleteData,
    findByAccountNo,
    getTransactionSummary,
    getPaginatedTransactions
}