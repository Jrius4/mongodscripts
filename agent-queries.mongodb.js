try {
    use('supplierDB');

    const page = 1; // Current page number
    const pageSize = 10; // Number of documents per page
    const supplierAgentId = ObjectId('677a3bf17f57d711e4a33ef7');
    const statusFilter = 'rejected';

    /**
     * Function to paginate results
     * @param {number} page - Current page number
     * @param {number} pageSize - Number of documents per page
     * @returns {Array} - Pagination stages
     */
    const paginate = (page, pageSize) => ([
        { $skip: (page - 1) * pageSize },
        { $limit: pageSize }
    ]);

    /**
     * Aggregation pipeline to fetch supplier agents and their relationships
     */

    console.log("=========================[start->Aggregation pipeline to fetch supplier agents and their relationships]===================================");
    const pipeline = [
        { $match: { isSupplierAgent: true } },
        {
            $lookup: {
                from: "agentandsupplier",
                localField: "_id",
                foreignField: "supplierAgent",
                as: "agentSupplierInfo"
            }
        },
        {
            $lookup: {
                from: "agentsupplierdetails",
                localField: "_id",
                foreignField: "supplierAgent",
                as: "agentDetails"
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
        },
        ...paginate(page, pageSize)
    ];

    // Execute the aggregation pipeline
    const result = db.getCollection("suppliers").aggregate(pipeline).toArray();

    // Handle results
    const totalCount = db.getCollection("suppliers").aggregate([
        { $match: { isSupplierAgent: true } },
        { $count: "count" }
    ]).toArray()[0]?.count || 0;

    const hasNextPage = (page * pageSize) < totalCount;

    printjson({ result, hasNextPage });

    console.log("=========================[end->Aggregation pipeline to fetch supplier agents and their relationships]===================================");

    // Query suppliers with a specific agent status
    console.log("=========================[end->Query suppliers with a specific agent status]===================================");

    const agentStatusPipeline = [
        {
            $lookup: {
                from: "agentandsupplier",
                localField: "_id",
                foreignField: "supplier",
                as: "agentDetails"
            }
        },
        { $unwind: "$agentDetails" },
        { $match: { "agentDetails.status": statusFilter, "agentDetails.supplierAgent": supplierAgentId } },
        {
            $facet: {
                data: paginate(page, pageSize),
                totalCount: [{ $count: "count" }]
            }
        }
    ];

    const agentStatusResult = db.getCollection("suppliers").aggregate(agentStatusPipeline).toArray();
    const suppliersAgencyStatus = agentStatusResult[0]?.data || [];
    const totalCountAgencyStatus = agentStatusResult[0]?.totalCount[0]?.count || 0;
    const hasNextPageAgencyStatus = (page * pageSize) < totalCountAgencyStatus;

    printjson({ suppliersAgencyStatus, hasNextPageAgencyStatus, totalCountAgencyStatus });
    console.log("=========================[end->Query suppliers with a specific agent status]===================================");
} catch (e) {
    console.error('Error executing query:', e);
}
