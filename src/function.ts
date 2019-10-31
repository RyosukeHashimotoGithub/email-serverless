import * as AWS from 'aws-sdk';
import { SQSEvent, Context, SQSRecord } from 'aws-lambda';

const isJson = (str: string): boolean => {
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
}

const createParam = (messageId: String, msgDetail: any):
  AWS.DynamoDB.DocumentClient.PutItemInput => {
  const param: AWS.DynamoDB.DocumentClient.PutItemInput =
    msgDetail.notificationType === "Bounce"
      ? {
        TableName: "SESNotifications",
        Item: {
          SESMessageId: messageId,
          SnsPublishTime: msgDetail.bounce.timestamp,
          SESreportingMTA: msgDetail.bounce.reportingMTA,
          SESDestinationAddress: msgDetail.mail.destination.toString(),
          SESbounceSummary: msgDetail.mail,
          SESMessageType: msgDetail.notificationType
        },
      }
      : {
        TableName: "SESNotifications",
        Item: {
          SESMessageId: messageId,
          SnsPublishTime: msgDetail.complaint.timestamp,
          SESComplaintFeedbackType: msgDetail.complaint.complaintFeedbackType,
          SESFeedbackId: msgDetail.complaint.feedback,
          SESDestinationAddress: msgDetail.mail.destination.toString(),
          SESMessageType: msgDetail.notificationType
        },
      };

  return param;
}

const createParamsList = (records: SQSRecord[], context: Context):
  AWS.DynamoDB.DocumentClient.PutItemInput[] => {
  const params: AWS.DynamoDB.DocumentClient.PutItemInput[] =
    records.map((record: SQSRecord) => {
      const { messageId, body } = record;
      // bodyにはSNSのMessage内容が格納されている
      // https://docs.aws.amazon.com/ja_jp/ses/latest/DeveloperGuide/notification-examples.html
      const msgBody = isJson(body)
        ? JSON.parse(body)
        : context.fail('invalid bounce message.');
      const msgDetail = isJson(msgBody.Message)
        ? JSON.parse(msgBody.Message)
        : context.fail('message details not found.');
      msgDetail.notificationType === "Bounce"
        || msgDetail.notificationType === "Complaint"
        || context.fail('invalid notification type.');

      return createParam(messageId, msgDetail);
    });

  return params;
}

export default async (event: SQSEvent, context: Context) => {
  const dynamodb = new AWS.DynamoDB.DocumentClient();
  const paramsList: AWS.DynamoDB.DocumentClient.PutItemInput[] =
    createParamsList(event.Records, context);

  for (const params of paramsList) {
    try {
      await dynamodb.put(params).promise();
    } catch (err) {
      console.log(err.message)
    }
  }
}