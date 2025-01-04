// db.getCollection('agentandfarmers').find().sort({ createdAt: -1 }).limit(5).pretty();
// // find farmers by id
// // find farmer by id
// db.getCollection('agentandfarmers').find({ _id: ObjectId("yourFarmerIdHere") }).pretty();
// db.getCollection('farmers').find({ _id: ObjectId("651aa48ebe69cd982505f3bb") });

// perform aggregation on supplier and get agents
// db.getCollection("suppliers").aggregate([
//     {
//         $match: {
//             isSupplierAgent: true
//         }
//     },
//     {
//         $lookup: {
//             from: "agentandsuppliers",
//             localField: "_id",
//             foreignField: "supplierAgent",
//             as: "agentSupplierInfo"
//         }
//     },
//     {
//         $unwind: "$agentSupplierInfo"
//     },
//     {
//         $lookup: {
//             from: "agentsupplierdetails",
//             localField: "agentSupplierInfo.supplierAgent",
//             foreignField: "supplierAgent",
//             as: "agentInfo"
//         }
//     },
//     {
//         $unwind: "$agentInfo"
//     },
//     // {
//     //     $group: {
//     //         _id: {
//     //             status: "$agentSupplierInfo.status",
//     //             supplierAgent: "$agentSupplierInfo.supplierAgent",
//     //             supplierId: "$agentSupplierInfo.supplier",

//     //         },
//     //         noInCategory: { $sum: 1 },
//     //     }
//     // },
//     {
//         $group: {
//             _id: {
//                 supplierAgent: "$agentSupplierInfo.supplierAgent",
//                 // supplierId: "$_id.supplierId",
//                 // status: "$_id.status"
//             },
//             categories: {
//                 $push: {
//                     status: "$agentSupplierInfo.status",
//                     noInCategory: { $sum: 1 },
//                 }
//             }
//         }
//     },

//     {
//         $project: {
//             _id: 1,
//             categories: 1,
//             // agentInfo: 1,
//             // agentSupplierInfo: 1,
//         }
//     }
// ]).forEach(printjson);


// perform aggregation on supplier and get agents

// {
//     "_id": {
//         "$oid": "6774092af91f4b04b9edf724"
//     },
//     "supplierAgent": {
//         "$oid": "6578297ca6b5a7a8d3cb52b5"
//     },
//     "supplier": {
//         "$oid": "6774092af91f4b04b9edf722"
//     },
//     "supplierAgentAccepted": true,
//         "supplierAgentRejected": false,
//             "createdAt": {
//         "$date": "2024-12-31T15:09:30.428Z"
//     },
//     "updatedAt": {
//         "$date": "2024-12-31T15:09:30.428Z"
//     },
//     "__v": 0,
//         "status": "acquired"
// }

// db.getCollection('agentandsuppliers').aggregate([
//     {
//         $group: {
//             _id: { status: "$status" },
//             noInCategory: { $sum: 1 },
//         }
//     }
// ]).forEach(printjson);