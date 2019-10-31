import { SQSEvent, Context, Callback } from 'aws-lambda';
import saveRecords from './function';
import configure from './config';

configure();

export const handler = async (
  event: SQSEvent,
  context: Context,
  callback: Callback
) => {
  await saveRecords(event, context);

  return {
    'statusCode': 200,
    'body': JSON.stringify({
      message: 'success'
    })
  }
}