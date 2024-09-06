//librerias
const fs = require('fs');
const path = require('path');

//Ruta de los archivos
const directorioArchivos = path.join(__dirname, '../assets');

//Funcion para listar archivos locales
const listarArchivos = (req, res) => {
    fs.readdir(directorioArchivos, (err, files) => {
        if (err) {
            return res.status(500).json({
                message: 'Error al leer archivos',
                error: err.message
            });
        }
        res.status(200).json({
            message: 'Mostrando Archivos listados localmente',
            archivos: files
        });
    });
};

//Funcion para descargar archivos locales
const descargarArchivo = (req, res) => {
    const nombreArchivo = req.params.nombreArchivo;
    const rutaArchivo = path.join(directorioArchivos, nombreArchivo);

    if (fs.existsSync(rutaArchivo)) {
        res.download(rutaArchivo);
    } else {
        return res.status(404).json({
            message: 'El archivo no existe o no encontrado',
            error: err.message
        });
    }
};

//Funcion para subir archivos localmente
const subirArchivo = (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            message: 'No se ha cargado ningun archivo',
        });
    }

    const archivoClave = Object.keys(req.files)[0];
    const archivo = req.files[archivoClave];
    const rutaTemporal = path.join(directorioArchivos, `TEMP_${archivo.name}`);

    archivo.mv(rutaTemporal, (err) => {
        if (err) {
            return res.status(500).json({
                message: 'Error al subir archivo',
                error: err.message
            });
        }
        res.status(200).json({
            message: 'Archivo subido localmente',
            rutaArchivo: rutaTemporal
        });
    });
};

module.exports= {
    listarArchivos,
    descargarArchivo,
    subirArchivo
};