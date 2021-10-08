const express= require ('express');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const app = express();
const cors = require('cors');
const bcrypt = require('bcrypt');
const MongoClient = require('mongodb').MongoClient;
const saltRounds=10;
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const findOrCreate = require("mongoose-findorcreate");
app.use(cors());
app.use(express.json());
app.listen(3001,()=>{
    console.log("Welcome");
});
require("dotenv").config();

app.use(session({
  secret: "Our little secret.",
  saveUninitialized: true,
  resave: false,
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000
}));
app.use(passport.initialize());
app.use(passport.session());

mongoose.connect('mongodb+srv://admin:admin@cluster0.bs9d2.mongodb.net/ezbuy-database?retryWrites=true&w=majority', {
   useNewUrlParser: true, useUnifiedTopology: true });


const userSchema = new mongoose.Schema ({
  username: String,
  name: String,
  googleId: String,
  secret: String,
  name: String,
  identification:Number,
  email:String,
  cellphone:Number,
  addedDate:String,
  lastLoginDate:String,
  role:String,
  speciality:String,
  state:String,
  alreadyRegistered:{type:Boolean, default:false}
});
userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);
const User = new mongoose.model("User", userSchema);


passport.use(User.createStrategy());
passport.serializeUser(function(user, done) {
  done(null, user.id);
});
passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});
passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3001/auth/google/callback",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ googleId: profile.id, username: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));


app.get("/auth/google",
  passport.authenticate("google", { scope: ["profile"] })
);

var currentUserId="";

function setCurrentUserId(word){
 currentUserId=word;
 console.log("PRE TESTING:"+currentUserId);
}

app.get("/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "http://localhost:3000" }),
  function(req, res) {
    // Successful authentication, redirect secrets.
    setCurrentUserId(req.user._id);
      /*if(!req.user.alreadyRegistered)res.redirect(`http://localhost:3000/Register/${req.user._id}`);*/
       res.redirect(`http://localhost:3000/DashBoard/${req.user._id}`);
      
    console.log("Exito")
  });


 app.get('/currentuserid',(req,res)=>{
   res.send(currentUserId);
})

  app.get("/logout", function(req, res){
    req.session.destroy(null);
    res.clearCookie(this.cookie, { path: '/' });
    req.logout();
    req.logOut();
    setCurrentUserId("");
    res.send("log out");
    console.log("asdas");
    
  })

  app.put('/register/:id',(req,res)=>{
        const id=req.params.id;
        var ObjectId = require('mongodb').ObjectId; 
        var o_id = new ObjectId(id);
        User.findOneAndUpdate({_id:o_id}, 
          {$set:{
          name:req.body.name,
          identification:req.body.identification,
          cellphone:req.body.cellphone,
          email:req.body.email,
          addedDate:req.body.addedDate,
          speciality:req.body.speciality,
          role:req.body.role,
          state:req.body.state,
          lastLoginDate:req.body.lastLoginDate,
          alreadyRegistered:true
      }}).then(result =>{
        res.send('Update Exitoso');
        console.log("Registro Exitoso");
        console.log(result)
      }).catch(error => console.log(error));
    
     
  })
   
  app.get('/usersbyid/:id', (req, res) => {
    const id=req.params.id;
    var ObjectId = require('mongodb').ObjectId; 
    var o_id = new ObjectId(id);
    User.findOne({_id:o_id},function(err, result) {
      if (err) throw err;
      res.send(result);
    });
  })
   









// CONEXION BASE DE DATOS
// ESPACIO CRUD DE USERS
MongoClient.connect('mongodb+srv://admin:admin@cluster0.bs9d2.mongodb.net/test?retryWrites=true&w=majority'
,{ useUnifiedTopology: true }).then(client=>{

    const db = client.db('ezbuy-database');
    const usersCollection = db.collection('users');
   
   

   
    /*Añade un usuario nuevo a la BD*/
    /*Falta ver como hacer datos unicos, pero no se como*/
     
        
        /*Devuelve todos los usuarios creados*/
        app.get('/allusers', (req, res) => {
          db.collection("users").find({}).toArray(function(err, result) {
            if (err) throw err;
            res.send(result);
          });

           //Retorna un solo producto dada una id
       


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
        soldby:req.body.soldby
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
        //Muestra todos los productos creados por un usuario
        app.get('/myproducts/:id',(req,res)=>{
          userID=req.params.id;
          db.collection('products').find({soldby:userID}).toArray(function(err, result) {
            if (err) throw err;
            res.send(result);
          });
        })

        app.get('/allotherproducts/:id',(req,res)=>{
          userID=req.params.id;
          db.collection('products').find({soldby:{$ne:userID}}).toArray(function(err, result) {
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
              soldby:req.body.soldby
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


//CRUD Ventas
MongoClient.connect('mongodb+srv://admin:admin@cluster0.bs9d2.mongodb.net/test?retryWrites=true&w=majority'
,{ useUnifiedTopology: true }).then(client=>{
  const db = client.db('ezbuy-database');
  const salesCollection = db.collection('sales');
   //Creacion Ventas
  app.post('/newsale', (req, res) => {
    const userObject ={
    
        productname: req.body.name,
        productreference:req.body.reference,
        productprice:req.body.price,
        soldby:req.body.soldby,
        boughtby:req.body.boughtby,
        solddate:req.body.solddate,
        state:req.body.state
       }
      salesCollection.insertOne(userObject)
      .then(result => {
        console.log(result);
        console.log("Dato Añadido a mongo  ");
        res.send('Venta Creada');
      })
      .catch(error => console.error(error))

    })

    //Todas Las Ventas
    app.get('/allsales', (req, res) => {
      db.collection('sales').find({}).toArray(function(err, result) {
        if (err) throw err;
        res.send(result);
      });
    });

    //Compras por un usuario
    app.get('/mybuys/:id',(req,res)=>{
      id=req.params.id;
      db.collection('sales').find({boughtby:id}).toArray(function(err,result){
        if(err) throw err;
        res.send(result);
      })
    })
    
    //Ventas por un usuario
    app.get('/mysales/:id',(req,res)=>{
      id=req.params.id;
      db.collection('sales').find({soldby:id}).toArray(function(err,result){
        if(err) throw err;
        res.send(result);
      })
    })
  }).catch(console.error)










app.get("/api", (req, res) => {
    res.json({ message: "Conexion Back vs Front" });
  });

