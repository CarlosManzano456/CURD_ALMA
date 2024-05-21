class Rutas{
    constructor(app){
        this.con = new (require("./../BD/crud.js"))();
        this.agregarRutas(app, this.con);
    }

    agregarRutas(app, con){
        app.post('/agregarUsuario', (req, res) => {
            let nombre = req.body.nombre;
            let email = req.body.Email;
            let Password = req.body.Pass;
            let telefono = req.body.Telefono;
        
            // Primero, realizamos una consulta para verificar si el número de teléfono ya existe en la base de datos
            con.query('SELECT * FROM usuario WHERE urs_telefono = ?', [telefono], (err, resultados, campos) => {
                
                if (resultados.length > 0) {
                    return res.status(400).send(
                        '<h1>El número de teléfono ya está en uso</h1> <br><a href="/"><button>Regresar</button><a>' 
                     
                        
                        );
                }else{
                    // Si no se encuentran resultados, podemos proceder a insertar el usuario en la base de datos
                    con.query('INSERT INTO usuario (urs_nombre, urs_email, urs_contraseña, urs_telefono) VALUES (?, ?, ?, ?)', [nombre, email, Password, telefono], (err, respuesta, fields) => {
                        if (err) {
                            console.log('Error al insertar usuario:', err);
                            return res.status(500).send('Error interno del servidor');
                        }
                        res.redirect('/obtenerUsuario');
                    });
                }
        
                
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
    }
}

module.exports = Rutas;