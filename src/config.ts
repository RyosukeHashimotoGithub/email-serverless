import * as AWS from 'aws-sdk';
// import dotenv from 'dotenv';

export default (): void => {
  // TODO: 何故かdotenvが読み込めない(;_;)
  // dotenv.config({ debug: true });
  // AWS.config.update(
  //   {
  //     endpoint: "http://host.docker.internal:8000",
  //     region: "us-west-2",
  //     accessKeyId: 'local',
  //     secretAccessKey: 'local'
  //   },
  //   true
  // );
  AWS.config.update(
    {
      endpoint: process.env.ENDPOINT,
      region: process.env.REGION,
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    },
    true
  );

  console.log(
    "ENVIRONMENT VARIABLES\n" +
    JSON.stringify(process.env, null, 2)
  );
};