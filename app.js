const fs = require('fs');
const querystring = require('querystring');
const express = require('express');
const app = express();
const puerto = process.env.PORT || "5000";

app.listen(puerto, () => {
    console.log(`Listening to requests on http://localhost:${puerto}`);
});

const connection = require('./bd');

app.use(express.static('./public'));
app.get("/", (req, res) => {
    res.sendFile("index.html");
});

app.post("/autenticar", async(req, res) => {
    let correo = req.body.correo;
    let password = req.body.password;
    let passwordHash = await bcryptjs.hash(password, 8);
    if (correo && password) {
        connection.query('SELECT * FROM musuario WHERE user = ?', [user], async(error, results) => {
            if (results.length == 0 || !(await bcryptjs.compare(password, results[0].password))) {
                res.send('usuario y/o contasena incorrectas');
            } else {
                res.send('Login correcto');
            }
        });
    }
});

const mime = {
    'html': 'text/html',
    'css': 'text/css',
    'jpg': 'image/jpg',
    'ico': 'image/x-icon'
};

function encaminar(req, res, camino) {
    switch (camino) {
        case 'public/menu.html':
            {
                Agregar(res);
                break;
            }
        case 'public/editarproducto.html':
            {
                editar(req, res);
                break;
            }
        case 'public/portavasos.html':
            {
                consultar(res);
                break;
            }
        case 'public/cuenta.html':
            {
                consultarcuenta(req, res);
                break;
            }
        case 'public/modificarcuenta.html':
            {
                editarcuenta(req, res);
                break;
            }
        case 'public/registro.html':
            {
                app.post('/registro.html', async(req, res) => {
                    const nombre = req.body.nombre;
                    const fecnac = req.body.fecha;
                    const correo = req.body.correo;
                    const contra = req.body.contra;
                    let passwordHash = await bcryptjs.hash(contra, 8);
                    connection.query('insert into musuario set ?', { nom_usu: nombre, fecnac_usu: fecnac, correo_usu: correo, contra_usu: contra });
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.write(`<!doctype html><html><head></head><body>
                                Se actualizo el articulo<br><a href="portavasos.html">Retornar</a></body></html>`);
                    res.end();
                });
                break;
            }
        default:
            {
                fs.stat(camino, error => {
                    if (!error) {
                        fs.readFile(camino, (error, contenido) => {
                            if (error) {
                                respuesta.writeHead(500, { 'Content-Type': 'text/plain' });
                                respuesta.write('Error interno');
                                respuesta.end();
                            } else {
                                const vec = camino.split('.');
                                const extension = vec[vec.length - 1];
                                const mimearchivo = mime[extension];
                                respuesta.writeHead(200, { 'Content-Type': mimearchivo });
                                respuesta.write(contenido);
                                respuesta.end();
                            }
                        });
                    } else {
                        respuesta.writeHead(404, { 'Content-Type': 'text/html' });
                        respuesta.write('<!doctype html><html><head></head><body>Recurso inexistente</body></html>');
                        respuesta.end();
                    }
                });
            }
    }
}

function Agregar(req, res) {
    let info = '';
    req.on('data', datosparciales => {
        info += datosparciales;
    });
    req.on('end', () => {
        const formulario = querystring.parse(info);
        conexion.query('insert into dcompra set ?', { sabor: formulario['sabor'], precio: formulario['precio'], tamano: formulario['tamano'] }, (error, resultado) => {
            if (error) {
                console.log(error);
                return;
            }
        });
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(`<!doctype html><html><head></head><body>
                Se agrego el articulo<br><a href="portavasos.html">Retornar</a></body></html>`);
        res.end();
    });
}

function editar(req, res) {
    let info = '';
    req.on('data', datosparciales => {
        info += datosparciales;
    });
    req.on('end', () => {
        const formulario = querystring.parse(info);
        conexion.query('update dcompra set ?', { cantidad: formulario['cantidad'], tamano: formulario['tamano'] }, (error, resultado) => {
            if (error) {
                console.log(error);
                return;
            }
        });
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(`<!doctype html><html><head></head><body>
                Se actualizo el articulo<br><a href="portavasos.html">Retornar</a></body></html>`);
        res.end();
    });
}

function editar(req, res) {
    let info = '';
    req.on('data', datosparciales => {
        info += datosparciales;
    });
    req.on('end', () => {
        const formulario = querystring.parse(info);
        conexion.query('update dcompra set ?', { cantidad: formulario['cantidad'], tamano: formulario['tamano'] }, (error, resultado) => {
            if (error) {
                console.log(error);
                return;
            }
        });
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(`<!doctype html><html><head></head><body>
                Se actualizo el articulo<br><a href="portavasos.html">Retornar</a></body></html>`);
        res.end();
    });
}

function consultar(res) {
    conexion.query('select * from dcompra', (error, filas) => {
        if (error) {
            console.log('error en la consulta');
            return;
        }
        res.writeHead(200, { 'Content-Type': 'text/html' });
        let datos = '';
        for (let f = 0; f < filas.length; f++) {
            datos += 'Producto:' + filas[f].sabor + '<br>';
            datos += 'Precio:' + filas[f].precio + '<br>';
            datos += 'Tamano:' + filas[f].tamano + '<hr>';
            datos += 'Cantidad:' + filas[f].cantidad + '<hr>';
        }
        res.write('<!doctype html><html><head></head><body>');
        res.write(datos);
        res.write('<a href="menu.html">Retornar</a>');
        res.write('</body></html>');
        res.end();
    });
}

function consultarcuenta(res) {
    conexion.query('select * from musuario where correo_usu = ?', correo, (error, filas) => {
        if (error) {
            console.log('error en la consulta');
            return;
        }
        res.writeHead(200, { 'Content-Type': 'text/html' });
        let datos = '';
        for (let f = 0; f < filas.length; f++) {
            datos += 'Nombre:' + filas[f].nombre + '<br>';
            datos += 'Correo electronico:' + filas[f].correo + '<br>';
            datos += 'Fecha de nacimiento:' + filas[f].fecnac + '<hr>';
        }
        res.write('<!doctype html><html><head></head><body>');
        res.write(datos);
        res.write('<a href="menu.html">Retornar</a>');
        res.write('</body></html>');
        res.end();
    });
}

function editarcuenta(req, res) {
    let info = '';
    req.on('data', datosparciales => {
        info += datosparciales;
    });
    req.on('end', () => {
        const formulario = querystring.parse(info);
        conexion.query('update musuario set ?', { nom_usu: formulario['nombre2'], fecnac_usu: formulario['fecha2'], correo_usu: formulario['correo2'] }, (error, resultado) => {
            if (error) {
                console.log(error);
                return;
            }
        });
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(`<!doctype html><html><head></head><body>
                Se actualizo el articulo<br><a href="portavasos.html">Retornar</a></body></html>`);
        res.end();
    });
}