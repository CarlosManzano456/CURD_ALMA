require('dotenv').config();
const express = require("express");
const mysql = require("mysql2");

const path = require("path");

var app = express();


app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, "views"));


var bodyParser = require("body-parser");

const con = mysql.createConnection({
  host: process.env.MYSQLHOST,
  port: process.env.MYSQLPORT,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE
});

//es solo uun toast 
con.connect(function(err) {
  if (err) {
      console.error('Error de conexión:', err);
      return;
  }
  console.log('Conectado a la base de datos MySQL');
});

con.connect();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended:true
}));

app.use(express.static('public')); 


///CRUD


app.post('/agregarUsuario',(req,res)=>{

    let nombre=req.body.nombre;
    let email=req.body.Email;
    let Password=req.body.Pass;
    let telefono=req.body.Telefono;


    con.query('INSERT INTO usuario (urs_nombre, urs_email, urs_contraseña, urs_telefono) VALUES (?, ?, ?, ?)', [nombre, email, Password, telefono], (err, respuesta, fields) => {
        if(err)return console.log('ERROR: ', err);
        res.redirect('/obtenerUsuario');

    });
});

app.get('/EliminarUsuario/:id', (req, res) => {
  let id = req.params.id; 
  
  con.query('DELETE FROM usuario WHERE urs_id = ?', [id], (err, respuesta, fields) => {
    if (err) return console.log('ERROR: ', err);
    res.redirect(req.get('referer'));
  });
});



app.get('/EditarInterfaz/:id', (req, res) => {
  let idEditar = req.params.id; 
  con.query('SELECT * FROM usuario WHERE urs_id = ?', [idEditar], (err, usuarios, fields) => {
    if (err) return console.log('ERROR: ', err);
    res.render("editar.ejs", { data: usuarios[0] });
  });
});

app.post('/EditarUsuario/:id',(req,res)=>{

    let idUpdate = req.params.id; 
    let NuevoUsuario = req.body;
    
    con.query('UPDATE usuario SET urs_nombre = ?, urs_email = ?, urs_telefono = ? WHERE urs_id = ?', [NuevoUsuario.nombre, NuevoUsuario.email, NuevoUsuario.telefono, idUpdate], 
    (err, respuesta, fields) => {
      if(err)return console.log('ERROR: ', err);
      res.redirect('/obtenerUsuario');
    });
        
  });


app.get('/obtenerUsuario',(req,res)=>{
    con.query('select * from usuario', (err, usuarios, fields)=>{
        if(err)return console.log('ERROR: ', err);
        res.render("crudsito.ejs", {data: usuarios});


    });
});



app.listen(3000,()=>{

    console.log('servidor escuchando en el puerto 8080');

});