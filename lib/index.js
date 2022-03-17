'use strict';

/**
 * Module dependencies
 */

/* eslint-disable no-unused-vars */
// Public node modules.
const _ = require('lodash');
const AWS = require('aws-sdk');
const trimParam = str => (typeof str === 'string' ? str.trim() : undefined);

module.exports = {
  init(config) {
    // configure AWS S3 bucket connection
    AWS.config.update({
      accessKeyId: trimParam(config.accessKeyId),
      secretAccessKey: trimParam(config.secretAccessKey)
    });
    
    const S3 = new AWS.S3({
      apiVersion: '2006-03-01',
      endpoint: new AWS.Endpoint(trimParam(config.endpoint)),
      params: {
        Bucket: trimParam(config.bucket),
      },

    });

    const upload = (file, customParams = {}) =>
      new Promise((resolve, reject) => {
        // upload file on S3 bucket
        const path = file.path ? `${file.path}/` : '';
        S3.upload(
          {
            Key: `${path}${file.hash}${file.ext}`,
            Body: file.stream || Buffer.from(file.buffer, 'binary'),
            ACL: 'public-read',
            ContentType: file.mime
            //...customParams,
          },
          (err, data) => {
            if (err) {
              return reject(err);
            }

            // set the bucket file url
            file.url = data.Location;

            resolve();
          }
        );
      });

    return {
      uploadStream(file, customParams = {}) {
        console.log("UploadStream")
        console.log(customParams)
        return upload(file, customParams);
      },
      upload(file, customParams = {}) {
        console.log("Upload")
        console.log(customParams)
        return upload(file, customParams);
      },
      delete(file, customParams = {}) {
        console.log("Delete")
        console.log(customParams)
        return new Promise((resolve, reject) => {
          // delete file on S3 bucket
          const path = file.path ? `${file.path}/` : '';
          S3.deleteObject(
            {
              Key: `${path}${file.hash}${file.ext}`,
              ...customParams,
            },
            (err, data) => {
              if (err) {
                return reject(err);
              }

              resolve();
            }
          );
        });
      },
    };
  },
};
