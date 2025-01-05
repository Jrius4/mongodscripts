try {
    use('supplierDB');

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

    console.log("Supplier data seeded successfully");
} catch (e) {
    console.error(e)
}