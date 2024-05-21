require('dotenv').config()
const bodyParser = require("body-parser");
const express = require("express");
const path = require("path");
require('dotenv').config();
const app = express();
const puerto = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended:true
}));

app.use(express.static('public')); 
app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, "views"));

new (require("./js/rutas/rutas.js"))(app);

app.listen(puerto,()=>{
    console.log('servidor escuchando en el puerto '+puerto+'');
    console.log("http://localhost:"+puerto+"/");
});