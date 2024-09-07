//Librerias
const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const BUCKET_NAME = process.env.S3_BUCKET;

// Funcion para listar archivos desde s3
const listarArchivosS3 = (req, res) => {
    const params = {
        Bucket: BUCKET_NAME
    };

    s3.listObjectsV2(params, (err, data) => {
        if (err) {
            return res.status(500).json({
                mensaje: 'Error al leer archivos en s3',
                error: err.message
            });
        }
        const files = data.Contents.map(file => file.Key);
        res.status(200).json({
            message: 'Archivos listados mostrados en S3',
            archivo: files
        });
    });
};

//Funcion de descargar archivo desde s3
const descargarArchivoS3 = (req, res) => {
    const nombreArchivo = req.params.nombreArchivo;
    const params = {
        Bucket: BUCKET_NAME,
        Key: nombreArchivo
    };

    s3.getObject(params, (err, data) => {
        if (err) {
            return res.status(500).json({
                message: 'Error al descargar archivos desde S3',
                error: err.message
            });
        }
        res.attachment(nombreArchivo);
        res.send(data.Body);
    });
};

// Función para subir archivo a s3
const subirArchivoS3 = (req, res) => {
    // Verifica si se está enviando algún archivo
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            message: 'No se ha cargado ningún archivo.'
        });
    }

    //Validar si hay archivo presente
    const archivo = req.files.archivo;
    if(!archivo) {
        return res.status(400).json({
            message: 'No se ha encontrado el archivo en la solicitud.'
        });
    }

    //Parametros s3
    const params = {
        Bucket: BUCKET_NAME,
        Key: archivo.name,
        Body: archivo.data,
    };

    //Process para subir a s3
    s3.upload(params, (err, data) => {
        if (err) {
            return res.status(500).json({
                message: 'Error al subir archivo a S3',
                error: err.message
            });
        }
        res.status(200).json({
            message: 'El archivo se cargo exitosamente a s3',
            data
        });
    });
};

//Exportar funciones
module.exports = {
    listarArchivosS3,
    descargarArchivoS3,
    subirArchivoS3
};