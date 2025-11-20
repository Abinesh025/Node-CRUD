const express = require("express");
const app = express();
const extn = require("express-handlebars");
const path = require("path");
const server = require("./database/server");


app.engine("hbs",extn.engine({layoutsDir:"views",defaultLayout:false,extname:"hbs"}));

app.use(express.urlencoded());

app.use(express.static(path.join(__dirname,"public")))

app.set("view engine","hbs");

app.get("/",async(req,res,next)=>{

    let message = ""

    switch (req.query.status){
        case "1":
            message="Data is Added SuccessFully";
            break;
        case "2":
            message="Data is Updated SuccessFully";
            break;
        case "3":
            message="Data is deleted SuccessFully";
            break;
        default:
            break;
    }

    let dataBase =await server.getData();
    const store = dataBase.collection("csbs");
    const statement = store.find({});
    const value = await statement.toArray();

    let std_id,std_details,delete_id;
       if(req.query.std_id){
        std_id=req.query.std_id;
        std_details=await store.findOne({_id: new server.objID(req.query.std_id)});
    }
       if(req.query.delete_id){
        delete_id=req.query.delete_id;
        await store.deleteOne({_id: new server.objID(req.query.delete_id)});

        res.redirect("/?status=3")
    }
    res.render("details",{
        value,
        std_id,std_details,
        message
    });
});

app.post("/add-details",async(req,res,next)=>{

    let dataBase =await server.getData();
    const store = dataBase.collection("csbs");
    const det = {name:req.body.name,reg:req.body.reg,dept:req.body.dept}
    await store.insertOne(det);

     res.redirect("/?status=1")
})
app.post("/update-details/:std_id",async(req,res,next)=>{

    let dataBase =await server.getData();
    const store = dataBase.collection("csbs");
    const det = {name:req.body.name,reg:req.body.reg,dept:req.body.dept}
    const std_id = req.params.std_id
    await store.updateOne({_id: new server.objID(std_id)},{$set:det})

     res.redirect("/?status=2");
})

app.listen(4000,()=>{
    console.log("Server Works");
})