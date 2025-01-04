try {
    use('supplierDAta');

    // create supplier collection

    const collections = ["suppliers", "agentsupplierdetails", "agentandsupplier"];

    for (let i = 0; i < collections.length; i++) {
        db.getCollection(collections[i]).drop();
        db.createCollection(collections[i]);
    }



    let suppliers = [];
    for (let i = 0; i < 458; i++) {
        suppliers.push({
            insertOne: {
                document: {
                    firstName: `Supplier${i}`,
                    surname: `LastName${i}`,
                    companyName: `Company${i}`,
                    email: `supplier${i}@example.com`,
                    password: `hashed_password_${i}`, // Use a hashing function in production
                    country: `Country${i % 5}`,
                    currency: "USD",
                    district: `District${i % 10}`,
                    subCounty: `SubCounty${i % 20}`,
                    location: {
                        longitude: Math.random() * 180 - 90,
                        latitude: Math.random() * 360 - 180
                    },
                    meta: {
                        primaryPhoneNumber: `+123456789${i}`,
                        alternatePhoneNumber: `+987654321${i}`
                    },
                    isSupplier: true,
                    isSupplierAgent: Math.random() > 0.5,
                    rating: Math.floor(Math.random() * 5) + 1,
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            }
        });
    }
    db.getCollection("suppliers").bulkWrite(suppliers);

    var cursorAgent = db.getCollection("suppliers").find({ isSupplierAgent: true });
    let agents = cursorAgent.toArray();

    var suppliersCursor = db.getCollection("suppliers").find({ isSupplierAgent: false });
    let suppliersList = suppliersCursor.toArray();

    let categories = ["Other", "Company", "Government"];
    // create agent supplier details
    for (let i = 0; i < agents.length + 50; i++) {

        const randomAgent = agents[Math.floor(Math.random() * agents.length)];

        const item = db.getCollection("agentsupplierdetails").findOne({
            supplierAgent: randomAgent._id,
        });
        if (item) {
            continue;
        } else {
            db.getCollection("agentsupplierdetails").insertOne({
                supplierAgent: randomAgent._id,
                category: categories[Math.floor(Math.random() * categories.length)],
                companyName: `Company ${i}`,
                governmentIssued: "",
                createdAt: new Date(),
                updatedAt: new Date()
            });
        }


    }


    // create agent and supplier linkage
    let statusGroups = ["acquired", "approved", "pending", "rejected"];
    for (let i = 0; i < 238; i++) {
        const randomAgent = agents[Math.floor(Math.random() * agents.length)];
        const randomSupplier = suppliersList[Math.floor(Math.random() * suppliersList.length)];

        const item = db.getCollection("agentandsupplier").findOne({
            supplierAgent: randomAgent._id,
            supplier: randomSupplier._id,
        });
        if (item) {
            continue;
        } else {

            db.getCollection("agentandsupplier").insertOne({
                supplierAgent: randomAgent._id,
                supplier: randomSupplier._id,
                status: statusGroups[Math.floor(Math.random() * statusGroups.length)],
                createdAt: new Date(),
                updatedAt: new Date()
            });
        }
    }


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


} catch (e) {
    console.error(e)
    console.error('Error in supplier-queries.mongodb.js')
}