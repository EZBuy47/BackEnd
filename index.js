const express= require ('express');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const app = express();
const cors = require('cors');
const bcrypt = require('bcrypt');
const MongoClient = require('mongodb').MongoClient;
const saltRounds=10;
app.use(cors());
app.use(express.json());
app.listen(3001,()=>{
    console.log("Welcome");
});



// CONEXION BASE DE DATOS
// ESPACIO CRUD DE USERS
MongoClient.connect('mongodb+srv://admin:admin@cluster0.bs9d2.mongodb.net/test?retryWrites=true&w=majority'
,{ useUnifiedTopology: true }).then(client=>{

    const db = client.db('ezbuy-database');
    const usersCollection = db.collection('users');
   
   

   
    /*Añade un usuario nuevo a la BD*/
    /*Falta ver como hacer datos unicos, pero no se como*/
     
    app.post('/newuser', (req, res) => {
        const userObject ={
        
            name: req.body.name,
            identification:req.body.identification,
            email:req.body.email,
            password:req.body.password,
            cellphone:req.body.cellphone,
            addedDate:req.body.addedDate,
            lastLoginDate:req.body.addedDate,
            role:req.body.role,
            speciality:req.body.speciality,
            state:req.body.state
           }
         ;
        bcrypt.hash(userObject.password,saltRounds,(err,hash) => {
            if(err){console.log(err)}
           userObject.password=hash;
           
           usersCollection.insertOne(userObject)
          .then(result => {
            console.log(result);
            console.log("Dato Añadido a mongo  ");
            res.send('Usuario Creado');
          })
          .catch(error => console.error(error))
})
        })
        
        /*Devuelve todos los usuarios creados*/
        app.get('/allusers', (req, res) => {
          db.collection("users").find({}).toArray(function(err, result) {
            if (err) throw err;
            res.send(result);
          });

           //Retorna un solo producto dada una id
        app.get('/usersbyid/:id', (req, res) => {
          const id=req.params.id;
          var ObjectId = require('mongodb').ObjectId; 
          var o_id = new ObjectId(id);
          db.collection('users').findOne({_id:o_id},function(err, result) {
            if (err) throw err;
            console.log(result);
            res.send(result);
          });
        })


       /*Actualiza usuarios*/
       app.put('/updateuser/:id',(req,res)=>{
        const id=req.params.id;
        var ObjectId = require('mongodb').ObjectId; 
        var o_id = new ObjectId(id);
        db.collection("users").findOneAndUpdate(
          {_id:o_id},
          {$set:{
            name:req.body.name,
            identification:req.body.identification,
            cellphone:req.body.cellphone,
            email:req.body.email,
            password:req.body.password,
            addedDate:req.body.addedDate,
            speciality:req.body.speciality,
            role:req.body.role,
            state:req.body.state,
            lastLoginDate:req.body.lastLoginDate
        }}).then(result =>{
          res.send('Update Exitoso');
          console.log("Update Exitoso");

        }).catch(error => console.log(error));
       });

       /*Borra un usuario*/
       app.delete('/deleteuser/:id',(req,res)=>{
        const id=req.params.id;
        var ObjectId = require('mongodb').ObjectId; 
        var o_id = new ObjectId(id);
        db.collection("users").findOneAndDelete({_id:o_id}
          ).then(result =>{
            res.send("Borrado Exitoso");
            console.log("Borrado");
          }).catch(error => console.log(error))
       }) 
  })
}).catch(console.error)



//CRUD PRODUCTOS
MongoClient.connect('mongodb+srv://admin:admin@cluster0.bs9d2.mongodb.net/test?retryWrites=true&w=majority'
,{ useUnifiedTopology: true }).then(client=>{
  const db = client.db('ezbuy-database');
  const productCollection = db.collection('products');
  
  //Creacion Productos
  app.post('/newproduct', (req, res) => {
    const userObject ={
    
        name: req.body.name,
        reference:req.body.reference,
        price:req.body.price,
        description:req.body.description,
        cuantity:req.body.cuantity,
        soldby:req.body.soldby,
        boughtby:req.body.boughtby,
        
        
       }
      productCollection.insertOne(userObject)
      .then(result => {
        console.log(result);
        console.log("Dato Añadido a mongo  ");
        res.send('Producto Creado');
      })
      .catch(error => console.error(error))

    })

       /*Devuelve todos los productos creados*/
        app.get('/allproducts', (req, res) => {
          db.collection('products').find({}).toArray(function(err, result) {
            if (err) throw err;
            res.send(result);
          });
        })
         //Retorna un solo producto dada una id
        app.get('/productbyid/:id', (req, res) => {
          const id=req.params.id;
          var ObjectId = require('mongodb').ObjectId; 
          var o_id = new ObjectId(id);
          db.collection('products').findOne({_id:o_id},function(err, result) {
            if (err) throw err;
            res.send(result);
          });
        })

        //Actualiza un productos
        app.put('/updateproduct/:id',(req,res)=>{
          const id=req.params.id;
          var ObjectId = require('mongodb').ObjectId; 
          var o_id = new ObjectId(id);
          db.collection("products").findOneAndUpdate(
            {_id:o_id},
            {$set:{
              name: req.body.name,
              reference:req.body.reference,
              price:req.body.price,
              description:req.body.description,
              cuantity:req.body.cuantity,
              soldby:req.body.soldby,
              boughtby:req.body.boughtby,
          }}).then(result =>{
            res.send('Update Exitoso');
            console.log("Update Exitoso");
  
          }).catch(error => console.log(error));
         });

         //Borra un producto
       app.delete('/deleteproduct/:id',(req,res)=>{
        const id=req.params.id;
        console.log(id);
        var ObjectId = require('mongodb').ObjectId; 
        var o_id = new ObjectId(id);
        db.collection("products").findOneAndDelete({_id:o_id}
          ).then(result =>{
            res.send("Borrado Exitoso");
            console.log("Borrado producto Exitoso");
          }).catch(error => console.log(error))
       }) 

  }).catch(console.error)













app.get("/api", (req, res) => {
    res.json({ message: "Conexion Back vs Front" });
  });

