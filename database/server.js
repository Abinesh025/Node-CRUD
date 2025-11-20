const mongoDb = require("mongodb");
const client = mongoDb.MongoClient;
const objID = mongoDb.ObjectId

let dataBase;

async function getData(){

    const server = await client.connect("mongodb://127.0.0.1:27017");
    dataBase = server.db("egs");    

    if(!dataBase){  
        console.log("DataBase is Not Connected");
    }else{
        console.log("DataBase is Connected");
    }

    return dataBase;

};

module.exports = {getData,objID};