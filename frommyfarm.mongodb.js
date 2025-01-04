try {
    use('supplierDAta');
    // create supplier collection
    db.getCollection("suppliers").drop();
    db.createCollection("suppliers");
    // create agentsupplierdetails collection
    db.getCollection("agentandsupplier").drop();
    db.createCollection("agentandsupplier");
    // create agentsupplierdetails collection
    db.getCollection("agentsupplierdetails").drop();
    db.createCollection("agentsupplierdetails");




    const agentandsupplier = {
        "_id": {
            "$oid": "6774092af91f4b04b9edf724"
        },
        "supplierAgent": {
            "$oid": "6578297ca6b5a7a8d3cb52b5"
        },
        "supplier": {
            "$oid": "6774092af91f4b04b9edf722"
        },
        "supplierAgentAccepted": true,
        "supplierAgentRejected": false,
        "createdAt": {
            "$date": "2024-12-31T15:09:30.428Z"
        },
        "updatedAt": {
            "$date": "2024-12-31T15:09:30.428Z"
        },
        "__v": 0,
        "status": "acquired"
    };

    const agentsupplierdetails = {
        "_id": {
            "$oid": "6774ff17de8d033337f18a9f"
        },
        "supplierAgent": {
            "$oid": "6774092af91f4b04b9edf722"
        },
        "category": "Other",
        "companyName": "",
        "governmentIssued": "",
        "createdAt": {
            "$date": "2025-01-01T08:38:47.315Z"
        },
        "updatedAt": {
            "$date": "2025-01-01T08:38:47.315Z"
        },
        "__v": 0
    }

    var supplier = {
        "firstName": "Brian",
        "surname": "Test",
        "companyName": "Brain Foods",
        "email": "briantest@example.test",
        "password": "$2b$10$NFcDA.dFT1DaQkTp8i9NJeo9rWx/qhRm.ouwyleWHf5WqghhEcK8a",
        "country": "Uganda",
        "currency": "UGX",
        "district": "Masaka",
        "subCounty": "Rettu",
        "location": {
            "longitude": 0,
            "latitude": 0
        },
        "meta": {
            "primaryPhoneNumber": "256779571619",
            "alternatePhoneNumber": "0788888800",
            "displayImg": null
        },
        "isSupplier": true,
        "isSupplierAgent": true,
        "rating": 5,
        "upracs": [],
        "downracs": [],
        "isSuspended": false,
        "isDeleted": false,
        "verified": false,
        "languages": [
            "English"
        ],
        "createdAt": {
            "$date": "2024-12-31T15:09:30.409Z"
        },
        "updatedAt": {
            "$date": "2025-01-03T05:19:01.462Z"
        },
        "__v": 0,
        "fcmToken": "cCPzUXymT3aIs-ivqGNc3X:APA91bFq-fXSBnR7D-Be82n_sLAfv_mSEteQIjG5pNWPUFR6Gky6Rj5naDdjqPxwR1OCc4dIfoHC_HbhOpGBs9ttaZZlyl_8RcnP-V8we7lMRHp6P1jTqh4"
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







} catch (error) {
    console.error(error);
    throw new Error(error);
}