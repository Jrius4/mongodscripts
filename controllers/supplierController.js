const Supplier = require('../models/Supplier');
const mongoose = require('mongoose');

/**
 * Get agents with their supplier details.
 */
exports.getAgents = async (req, res) => {
    try {
        const agents = await Supplier.aggregate([
            { $match: { isSupplierAgent: true } },
            {
                $lookup: {
                    from: 'agentandsupplier',
                    localField: '_id',
                    foreignField: 'supplierAgent',
                    as: 'agentSupplierInfo'
                }
            },
            {
                $lookup: {
                    from: 'agentsupplierdetails',
                    localField: '_id',
                    foreignField: 'supplierAgent',
                    as: 'agentDetails'
                }
            },
            { $unwind: "$agentSupplierInfo" },
            { $unwind: "$agentDetails" },
            {
                $group: {
                    _id: {
                        supplierAgent: "$agentSupplierInfo.supplierAgent",
                        status: "$agentSupplierInfo.status"
                    },
                    freqCount: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    supplierAgent: "$_id.supplierAgent",
                    status: "$_id.status",
                    freqCount: 1
                }
            }
        ]);

        res.json(agents);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching agents', error });
    }
};

/**
 * Get agent status with pagination.
 */
exports.getAgentStatus = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;

    try {
        const agentStatus = await Supplier.aggregate([
            {
                $lookup: {
                    from: 'agentandsupplier',
                    localField: '_id',
                    foreignField: 'supplier',
                    as: 'agentDetails'
                }
            },
            { $unwind: "$agentDetails" },
            { $match: { "agentDetails.status": 'rejected' } },
            {
                $facet: {
                    data: [
                        { $skip: (page - 1) * pageSize },
                        { $limit: pageSize },
                        {
                            $project: {
                                _id: 1,
                                firstName: 1,
                                email: 1,
                                "agentDetails.status": 1,
                                "agentDetails.supplierAgent": 1
                            }
                        }
                    ],
                    totalCount: [{ $count: "count" }]
                }
            }
        ]);

        const totalCount = agentStatus[0]?.totalCount[0]?.count || 0;
        const hasNextPage = (page * pageSize) < totalCount;

        res.json({ data: agentStatus[0].data, totalCount, hasNextPage });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching agent status', error });
    }
};

/**
 * Get agent status with pagination and filter by supplierAgent and supplierId.
 */
exports.getAgentStatus = async (req, res) => {
    const supplierAgent = req.params.supplierAgent;
    const supplierId = req.query.supplierId;  // Assuming supplierId is passed as a query parameter
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;

    try {
        const agentStatus = await Supplier.aggregate([
            {
                $lookup: {
                    from: 'agentandsupplier',
                    localField: '_id',
                    foreignField: 'supplier',
                    as: 'agentDetails'
                }
            },
            { $unwind: "$agentDetails" },
            {
                $match: {
                    "agentDetails.supplierAgent": mongoose.Types.ObjectId(supplierAgent),
                    "agentDetails.supplier": mongoose.Types.ObjectId(supplierId) // Assuming supplierId is a valid ObjectId
                }
            },
            {
                $facet: {
                    data: [
                        { $skip: (page - 1) * pageSize },
                        { $limit: pageSize },
                        {
                            $project: {
                                _id: 1,
                                firstName: 1,
                                email: 1,
                                "agentDetails.status": 1,
                                "agentDetails.supplierAgent": 1
                            }
                        }
                    ],
                    totalCount: [{ $count: "count" }]
                }
            }
        ]);

        const totalCount = agentStatus[0]?.totalCount[0]?.count || 0;
        const hasNextPage = (page * pageSize) < totalCount;

        res.json({ data: agentStatus[0].data, totalCount, hasNextPage });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching agent status', error });
    }
};