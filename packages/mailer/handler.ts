import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import * as sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const ping: APIGatewayProxyHandler = async (event, _context) => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message:
          'Go Serverless Webpack (Typescript) v1.0! Your function executed successfully!',
        input: event
      },
      null,
      2
    )
  };
};

export const send: APIGatewayProxyHandler = async (event, _context) => {
  const { body: requestBody } = event;

  const {
    dynamicTemplateData,
    from = {
      name: 'No Reply',
      email: 'noreply@mailer.micros.tinkerhub.dev'
    },
    subject,
    templateId,
    to
  } = JSON.parse(requestBody);

  const [
    { body: responseBody, statusCode: responseStatusCode }
  ] = await sgMail.send({
    dynamicTemplateData,
    from,
    subject,
    templateId,
    to
  });

  return {
    body: responseBody,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    statusCode: responseStatusCode
  };
};
