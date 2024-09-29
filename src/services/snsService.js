const AWS = require('aws-sdk');

// Configuración de AWS SNS
const sns = new AWS.SNS();

class SNSService {
    async sendNotification(topicArn, message) {
        const params = {
            Message: message,
            TopicArn: topicArn,
        };

        try {
            const data = await sns.publish(params).promise();
            return data.MessageId;
        } catch (error) {
            console.error('Error al enviar notificación:', error);
            throw error;
        }
    }
}

// Exportar una instancia del servicio
module.exports = new SNSService();