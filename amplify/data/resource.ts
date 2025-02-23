import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  Project: a
    .model({
      id: a.id().required(),
      name: a.string().required(),
      description: a.string(),
      children: a.string().required(), // JSON string
    })
    .identifier(['id'])
    .authorization((allow) => [allow.authenticated()]),
  Document: a
    .model({
      projectId: a.id().required(),
      path: a.string().required(),
      content: a.string(), // JSON string
    })
    .identifier(['projectId', 'path'])
    .authorization((allow) => [allow.authenticated()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
  },
});
