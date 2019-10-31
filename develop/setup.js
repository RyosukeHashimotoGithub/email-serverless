"use strict";
exports.__esModule = true;
var fs = require("fs");
var messageId = function () {
    var chars = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".split("");
    for (var i = 0, len = chars.length; i < len; i++) {
        switch (chars[i]) {
            case "x":
                chars[i] = Math.floor(Math.random() * 16).toString(16);
                break;
            case "y":
                chars[i] = (Math.floor(Math.random() * 4) + 8).toString(16);
                break;
        }
    }
    return chars.join("");
};
var timestamp = function () {
    var now = new Date();
    return now.toISOString();
};
var email = function () {
    var random = Math.random().toString(36).slice(-8);
    return random + "@example.com";
};
var snsMsg = function () {
    var msg = {
        "notificationType": "Bounce",
        "bounce": {
            "bounceType": "Permanent",
            "bounceSubType": "General",
            "bouncedRecipients": [{
                    "emailAddress": email(),
                    "action": "failed",
                    "status": "5.1.1",
                    "diagnosticCode": "smtp; 550 5.1.1 user unknown"
                }],
            "timestamp": timestamp(),
            "feedbackId": "0101016e10c55df6-83525715-35be-4595-bbab-6fc47e8cce85-000000",
            "remoteMtaIp": "12.34.56.78",
            "reportingMTA": "dsn; a27-20.smtp-out.us-west-2.amazonses.com"
        },
        "mail": {
            "timestamp": timestamp(),
            "source": "local@example.com",
            "sourceArn": "arn:aws:sns:us-east-1:123456789012:ExampleTopic/local@example.com",
            "sourceIp": "12.34.56.78",
            "sendingAccountId": "1234567890",
            "messageId": messageId(),
            "destination": [
                email()
            ]
        }
    };
    return JSON.stringify(msg);
};
var message = function () {
    var msg = {
        "Type": "Notification",
        "MessageId": messageId(),
        "TopicArn": "arn:aws:sns:us-east-1:123456789012:ExampleTopic",
        "Message": snsMsg(),
        "Timestamp": timestamp(),
        "SignatureVersion": "1",
        "Signature": "EXAMPLE",
        "SigningCertUrl": "EXAMPLE",
        "UnsubscribeUrl": "EXAMPLE"
    };
    return JSON.stringify(msg);
};
var record = function () {
    return {
        "messageId": messageId(),
        "receiptHandle": "MessageReceiptHandle",
        "body": message(),
        "Timestamp": timestamp(),
        "attributes": {
            "ApproximateReceiveCount": "1",
            "SentTimestamp": Date.now(),
            "SenderId": "123456789012",
            "ApproximateFirstReceiveTimestamp": Date.now()
        },
        "messageAttributes": {},
        "md5OfBody": "7b270e59b47ff90a553787216d55d91d",
        "eventSource": "aws:sqs",
        "eventSourceARN": "arn:aws:sqs:us-east-1:123456789012:MyQueue",
        "awsRegion": "us-east-1"
    };
};
exports["default"] = (function () {
    console.log('setup start');
    var records = [];
    for (var i = 0; i < 10; i++) {
        records.push(record());
    }
    fs.writeFile('event.json', JSON.stringify({
        Records: records
    }), function (err) {
        err
            ? console.log('setup err')
            : console.log('setup success!');
    });
})();
