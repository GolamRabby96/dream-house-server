const express = require("express");
const app = express();
require("dotenv").config();
const bodyParser = require("body-parser");
const cors = require("cors");
const MongoClient = require("mongodb").MongoClient;
const port = 5000;
// middleware
app.use(bodyParser.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.y25ks.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

client.connect((err) => {
	const dreamCollections = client.db("dream").collection("products");
	const orderCollections = client.db("dream").collection("Orderproducts");
     console.log('your dreams is comes true');

     app.post('/addProduct',(req, res) => {
          const product = req.body;
          dreamCollections.insertOne(product)
          .then( result => {
               res.send(result.insertedCount);
          })
          .then( err =>{
               console.log(err);
          })
     })

     app.post('/addUserProduct',(req, res) => {
          const product = req.body;
          orderCollections.insertOne(product)
          .then( result => {
               res.send(result.insertedCount);
          })
          .then( err =>{
               console.log(err);
          })

     })


     app.get('/products',(req, res) => {
          dreamCollections.find({})
          .toArray((err, documents) =>{
               res.send(documents);
          })
     })

     app.get('/buynow/:key',(req, res) => {
          dreamCollections.find({key: req.params.key})
          .toArray((err, documents) =>{
               res.send(documents);
          })
     })

     app.get('/userProduct/:email',(req, res) => {
          // const usermail = req.body;
          const email = req.params.email;
          orderCollections.aggregate([{$match:{userEmail:email}}])
          .toArray((err, documents) =>{
               res.send(documents);
               // console.log(documents)
               // console.log(err)
          })

     })

     app.get('/allProduct',(req, res)=>{
          dreamCollections.find({})
          .toArray((err, documents) =>{
               res.send(documents);
          })
     })

     app.delete('/deleteProduct/:key',(req, res)=>{
          dreamCollections.deleteOne({key: req.params.key})
          .then(result =>{
               res.send(result);
          })
     })
});

app.get("/", (req, res) => {
	res.send("Hello World!");
});

app.listen(process.env.PORT || port)
