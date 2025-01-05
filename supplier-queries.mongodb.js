try {

    use('supplierDB');


    // perform aggregation on supplier and get agents
    console.log("=================[start->perform aggregation on supplier and get agents]======================");
    db.getCollection("suppliers").aggregate([
        {
            $match: {
                isSupplierAgent: true
            }
        },
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
                as: "agentSupplierDetails"
            }
        },
    ]).forEach(printjson);

    console.log("=================[end->perform aggregation on supplier and get agents]======================");

    // perform aggregation on supplier agent group the agentandsupplier into status (count the status)
    console.log("=================[start->perform aggregation on supplier and get agents]======================");
    db.getCollection("suppliers").aggregate([
        {
            $match: {

                isSupplierAgent: true,

            }
        },
        {
            $lookup: {
                from: "agentandsupplier",
                localField: "_id",
                foreignField: "supplierAgent",
                as: "agentSupplierInfo"
            }
        },
        { $unwind: "$agentSupplierInfo", },
        {
            $lookup: {
                from: "agentsupplierdetails",
                localField: "_id",
                foreignField: "supplierAgent",
                as: "agentDetails"
            }
        },
        {
            $unwind: "$agentDetails"
        },
        {
            $group: {
                _id: {
                    supplierAgent: "$agentSupplierInfo.supplierAgent",
                    status: "$agentSupplierInfo.status",
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

    ]).forEach(printjson);
    console.log("=================[start->perform aggregation on supplier and get agents]======================");


    // perform aggregation on supplier agent group the agentandsupplier into status (count the status)
    console.log("=================[start->perform aggregation on supplier and get agents]======================");
    // apply pagination and skip logic
    db.getCollection("suppliers").aggregate([
        {
            $match: {

                isSupplierAgent: true,

            }
        },
        {
            $lookup: {
                from: "agentandsupplier",
                localField: "_id",
                foreignField: "supplierAgent",
                as: "agentSupplierInfo"
            }
        },
        { $unwind: "$agentSupplierInfo", },
        {
            $lookup: {
                from: "agentsupplierdetails",
                localField: "_id",
                foreignField: "supplierAgent",
                as: "agentDetails"
            }
        },
        {
            $unwind: "$agentDetails"
        },
        {
            $group: {
                _id: {
                    supplierAgent: "$agentSupplierInfo.supplierAgent",
                    status: "$agentSupplierInfo.status",
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

    ]).forEach(printjson);
    console.log("=================[end->perform aggregation on supplier and get agents]======================");


    const page = 1; // Current page number
    const pageSize = 10; // Number of documents per page

    const pipeline = [
        {
            $match: {
                isSupplierAgent: true,
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
                            categories: 1,
                            suppliers: 1, // Include other fields as needed
                        }
                    }
                ],
                totalCount: [
                    { $count: "count" }
                ]
            }
        }
    ];

    const result = db.getCollection("suppliers").aggregate(pipeline).toArray();
    const suppliersItem = result[0].data;
    const totalCount = result[0].totalCount[0] ? result[0].totalCount[0].count : 0;
    const hasNextPage = (page * pageSize) < totalCount;

    printjson({ suppliersItem, hasNextPage });










    // perform aggregation on supplier agent group the agentandsupplier into status (count the status)
    console.log("=================[start->perform aggregation on supplier and get agents]======================");
    // apply pagination and skip logic
    db.getCollection("suppliers").aggregate([
        {
            $match: {

                isSupplierAgent: true,

            }
        },
        {
            $facet: {
                data: [
                    {
                        $lookup: {
                            from: "agentandsupplier",
                            localField: "_id",
                            foreignField: "supplierAgent",
                            as: "agentSupplierInfo"
                        }
                    },
                    { $unwind: "$agentSupplierInfo", },
                    {
                        $lookup: {
                            from: "agentsupplierdetails",
                            localField: "_id",
                            foreignField: "supplierAgent",
                            as: "agentDetails"
                        }
                    },
                    {
                        $unwind: "$agentDetails"
                    },
                    {
                        $group: {
                            _id: {
                                supplierAgent: "$agentSupplierInfo.supplierAgent",
                                status: "$agentSupplierInfo.status",
                            },
                            freqCount: { $sum: 1 }
                        }
                    },
                    { $skip: (page - 1) * pageSize },
                    { $limit: pageSize },
                    {
                        $project: {
                            _id: 0,
                            supplierAgent: "$_id.supplierAgent",
                            status: "$_id.status",
                            freqCount: 1
                        }
                    }
                ]
            }
        }

    ]);

    const resultData = db.getCollection("suppliers").aggregate(pipeline).toArray();
    const suppliersData = resultData[0].data;
    const totalCountData = result[0].totalCount[0] ? result[0].totalCount[0].count : 0;
    const hasNextPageData = (page * pageSize) < totalCountData;

    printjson({ suppliersData, hasNextPageData });
    console.log("=================[end->perform aggregation on supplier and get agents]======================");


    // perform aggregation on supplier and get agents with (agentandsupplier status pending )
    console.log("=================[start->perform aggregation on supplier and get agents with (agentandsupplier status pending )]======================");

    const pageAgencyStatus = 1; // Current page number
    const pageSizeAgencyStatus = 10; // Number of documents per page

    const pipelineAgencyStatus = [



        {
            $lookup: {
                from: "agentandsupplier",
                localField: "_id",
                foreignField: "supplier",
                as: "agentDetails"
            }
        },
        {
            $unwind: "$agentDetails"
        },


        {
            $match: {

                "agentDetails.status": 'rejected',
                "agentDetails.supplierAgent": ObjectId('677a3bf17f57d711e4a33ef7')
            }

        },

        {
            $facet: {
                data: [
                    { $skip: (pageAgencyStatus - 1) * pageSizeAgencyStatus },
                    { $limit: pageSizeAgencyStatus },
                    {
                        $project: {
                            _id: 1,
                            firstName: 1,
                            email: 1,
                            "agentDetails.status": 1,
                            "agentDetails.supplierAgent": 1 // Include other fields as needed
                        }
                    }
                ],
                totalCount: [
                    { $count: "count" }
                ]
            }
        }
    ];

    const resultAgencyStatus = db.getCollection("suppliers").aggregate(pipelineAgencyStatus).toArray();
    const suppliersAgencyStatus = resultAgencyStatus[0].data;
    const totalCountAgencyStatus = resultAgencyStatus[0].totalCount[0] ? resultAgencyStatus[0].totalCount[0].count : 0;
    const hasNextPageAgencyStatus = (pageAgencyStatus * pageSizeAgencyStatus) < totalCountAgencyStatus;

    printjson({ suppliersAgencyStatus, hasNextPageAgencyStatus, totalCountAgencyStatus });

    console.log("=================[start->perform aggregation on supplier and get agents with (agentandsupplier status pending )]======================");



} catch (e) {
    console.error(e)
    console.error('Error in supplier-queries.mongodb.js')
}