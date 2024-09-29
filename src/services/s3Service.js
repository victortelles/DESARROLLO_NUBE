const AWS = require('aws-sdk');

const s3 = new AWS.S3();

class S3Service {
    async uploadFile(bucketName, key, body) {
        const params = {
            Bucket: bucketName,
            Key: key,
            Body: body,
        };

        try {
            const data = await s3.upload(params).promise();
            return data.Location; // URL del archivo subido
        } catch (error) {
            console.error('Error al subir archivo a S3:', error);
            throw error;
        }
    }

    async getFile(bucketName, key) {
        const params = {
            Bucket: bucketName,
            Key: key,
        };

        try {
            const data = await s3.getObject(params).promise();
            return data.Body; // Contenido del archivo
        } catch (error) {
            console.error('Error al obtener archivo de S3:', error);
            throw error;
        }
    }
}

// Exportar una instancia del servicio
module.exports = new S3Service();