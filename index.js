const express = require('express')
const bodyparser=require('body-parser')
const cors=require('cors')
const ObjectId=require('mongodb').ObjectID
const { MongoClient } = require('mongodb'); 
require('dotenv').config()


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hj3kx.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express()
app.use(express.json())
app.use(cors())
const port = 5000
const { ObjectID } = require('bson')

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const menscollection = client.db("Ecommerce").collection("mensprdct");
  const ladiescollection = client.db("Ecommerce").collection("ladiesprdct");
  const shoecollection = client.db("Ecommerce").collection("shoe");
  const mensproduct = client.db("Ecommerce").collection("mensprdct");
  const cart= client.db("Ecommerce").collection("addcart")
  const order= client.db("Ecommerce").collection("addorder")
  console.log("db connected")

  app.post('/add',(req,res)=>{
    const newevent=req.body;
    mensproduct.insertOne(newevent)
    .then(result=>{
      console.log("inserted count",result.insertedCount)
        res.send(result.insertedCount>0)
    })
  })

  app.get('/mensdata',(req,res)=>{
    menscollection.find()
    .toArray((err,items)=>{
      res.send(items)
    })
  })

  app.get("/ladiesdata",(req,res)=>{
    ladiescollection.find()
    .toArray((err,items)=>{
      res.send(items)
    })
  })

  app.get("/cart/:email",(req,res)=>{
    cart.find({email:req.params.email})
    .toArray((err,documents)=>{
      res.send(documents)
    })
  })


  app.delete('/delete/:id',(req,res)=>{
    //console.log(req.params.id)
    cart.deleteOne({_id: ObjectID(req.params.id)})
    .then(result=>{
       console.log(result)
       res.redirect('/')
    })
})

  app.get("/order/:email",(req,res)=>{
    order.find({email:req.params.email})
    .toArray((err,documents)=>{
      res.send(documents)
    })
  })

  app.get('/singleprdct/:id',(req,res)=>{
    cart.find({_id: ObjectID(req.params.id)})
    .toArray((err,items)=>{
      res.send(items[0])
    })
  })  
 
  app.post("/order",(req,res)=>{
      const item=req.body;
      cart.insertOne(item)
      .then(result=>{
        console.log("inserted count")
        res.send(result.insertedCount>0)
      })
  }) 

  app.post("/handleorder",(req,res)=>{
    const item=req.body;
   order.insertOne(item)
   .then(result=>{
     res.send(result.insertedCount>0)
   })
  })

  app.get("/shoedata",(req,res)=>{
    shoecollection.find()
    .toArray((err,items)=>{
      res.send(items)
    })
  })
});





app.listen(process.env.PORT || port)