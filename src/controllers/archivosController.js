//Librerias
const fs = require('fs');
const path = require ('path');

//directorio de los archivos
const directorioArchivos = path.join(__dirname, '../assets');

// Funcion para listar archivos
const listarArchivos = (req, res) => {
    fs.readdir(directorioArchivos, (err, files) => {
        if (err) {
            return res.status(500).json({
                mensaje: 'Error al leer archivos',
                error: err.message
            });
        }
        res.status(200).json({
            message: 'Mostrando archivos listados',
            archivos: files
        });
    });
};

//Funcion de descargar archivo
const descargarArchivo = (req, res) => {
    const nombreArchivo = req.params.nombreArchivo;
    const rutaArchivo = path.join(directorioArchivos, nombreArchivo);

    if (fs.existsSync(rutaArchivo)) {
        res.download(rutaArchivo);
    } else {
        res.status(404).json({
            message: 'Archivo no encontrado',
        });
    }
};

// Función para subir archivo
const subirArchivo = (req, res) => {
    // Verifica si se está enviando algún archivo
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            message: 'No se ha cargado ningún archivo.'
        });
    }

    // Obtener la clave del archivo
    const archivoClave = Object.keys(req.files)[0];
    let archivo = req.files[archivoClave];

    // debugg
    console.log('Archivo recibido:', archivo);

    // Verifica que el archivo tenga un nombre
    if (!archivo || !archivo.name) {
        return res.status(400).json({
            message: 'No se pudo obtener el archivo correctamente.'
        });
    }

    //Asignar nombre al archivo subido
    const rutaTemporal = path.join(directorioArchivos, `TEMP_${archivo.name}`);

    // Mover el archivo al directorio de almacenamiento
    archivo.mv(rutaTemporal, (err) => {
        if (err) {
            console.error('Error al mover el archivo:', err);
            return res.status(500).json({
                message: 'Error al subir el archivo',
                error: err.message
            });
        }
        res.status(200).json({
            message: 'Archivo subido correctamente',
            rutaArchivo: rutaTemporal
        });
    });
};

//Exportar funciones
module.exports = {
    listarArchivos,
    descargarArchivo,
    subirArchivo
};