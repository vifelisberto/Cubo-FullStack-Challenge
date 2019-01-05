console.log('start!');

const AWS = require('aws-sdk');
const docCliente = new AWS.DynamoDB.DocumentClient({ region: 'sa-west-1' });

exports.handle = function (e, ctx, callback) {
    var params = {
        Item: {
            Id: 1,
            message: "I love yout website!"
        },
        TableName: 'guestbook'
    };

    docCliente.put(params, function (err, data) {
        if (err) {
            callback(err, null);
        }
        else {
            callback(null, data);
        }
    });
}