## Installation

It's required to install this package with a different alias so that it belongs to the @strapi scope.

```bash
# npm
npm i @strapi/provider-upload-aws-s3@npm:@oss4u/provider-upload-aws-s3

# or yarn
yarn add @strapi/provider-upload-aws-s3@npm:@oss4u/provider-upload-aws-s3

```

## Configurations

Your configuration is passed down to the provider. (e.g: `new AWS.S3(config)`). You can see the complete list of options [here](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#constructor-property)

See the [using a provider](https://docs.strapi.io/developer-docs/latest/plugins/upload.html#using-a-provider) documentation for information on installing and using a provider. And see the [environment variables](https://docs.strapi.io/developer-docs/latest/setup-deployment-guides/configurations/optional/environment.html#environment-variables) for setting and using environment variables in your configs.

### Provider Configuration

`./config/plugins.js`

```js
module.exports = ({ env }) => ({
  // ...
  upload: {
    config: {
      provider: 's3',
      providerOptions: {
        accessKeyId: env('AWS_ACCESS_KEY_ID'),
        secretAccessKey: env('AWS_ACCESS_SECRET'),
        endpoint: env('AWS_ENDPOINT'),
        params: {
          Bucket: env('AWS_BUCKET'),
        },
      },
    },
  },
  // ...
});
```

### Security Middleware Configuration

Due to the default settings in the Strapi Security Middleware you will need to modify the `contentSecurityPolicy` settings to properly see thumbnail previews in the Media Library. You should replace `strapi::security` string with the object bellow instead as explained in the [middleware configuration](https://docs.strapi.io/developer-docs/latest/setup-deployment-guides/configurations/required/middlewares.html#loading-order) documentation.

`./config/middlewares.js`

```js
module.exports = ({ env }) => [
  // ...
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': ["'self'", 'https:'],
          'img-src': ["'self'", 'data:', 'blob:', `${env('AWS_BUCKET')}.${env('AWS_ENDPOINT')}` ],
          'media-src': ["'self'", 'data:', 'blob:', `${env('AWS_BUCKET')}.${env('AWS_ENDPOINT')}` ],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
  // ...
];
```

## Required AWS Policy Actions

These are the minimum amount of permissions needed for this provider to work.

```json
"Action": [
  "s3:PutObject",
  "s3:GetObject",
  "s3:ListBucket",
  "s3:DeleteObject",
  "s3:PutObjectAcl"
],
```
