const express= require ('express');

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
MongoClient.connect('mongodb+srv://admin:admin@cluster0.bs9d2.mongodb.net/test?retryWrites=true&w=majority'
,{ useUnifiedTopology: true }).then(client=>{

    console.log('Bienvenido a database mongo');
    const db = client.db('ezbuy-database');
    const usersCollection = db.collection('users');
   
    
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
            speciality:req.body.speciality
           }
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

        app.get('/allusers', (req, res) => {
          db.collection("users").find({}).toArray(function(err, result) {
            if (err) throw err;
            console.log(result);
            res.send(result);
          });
          })

      


}).catch(console.error)









/*Registro de Usuarios*/ 
/*app.post('/newuser',(req,res)=>{
    const sqlCommand = 'INSERT INTO users (name,identification,email,password) VALUES (?,?,?,?)'
    const userObject ={
        
     name: req.body.name,
     identification:req.body.identification,
     email:req.body.email,
     password:req.body.password
     
    }
    bcrypt.hash(userObject.password,saltRounds,(err,hash) => {
        if(err){console.log(err)}
        con.query(sqlCommand,[userObject.name,userObject.identification,userObject.email,hash],err =>{
            if(err) throw err;
            res.send('Usuario Creado');
        });
   
    })
    
});*/




app.get("/api", (req, res) => {
    res.json({ message: "Conexion Back vs Front" });
  });

