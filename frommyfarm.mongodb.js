use('myFromyFarm');

db.getCollection('agentandfarmers').find().sort({ createdAt: -1 }).limit(5).pretty();
// find farmers by id
// find farmer by id
db.getCollection('agentandfarmers').find({ _id: ObjectId("yourFarmerIdHere") }).pretty();
db.getCollection('farmers').find({ _id: ObjectId("651aa48ebe69cd982505f3bb") });