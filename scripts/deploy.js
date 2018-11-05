const fs = require('fs');
const zlib = require('zlib');
const path = require('path');

const AWS = require('aws-sdk');
const mime = require('mime-types');

const config = {
  s3BucketName: '',
  profile: '',
  folderPath: '../build'
};

// initialise S3 client

const credentials = new AWS.SharedIniFileCredentials({ profile: config.profile });
const s3 = new AWS.S3({ signatureVersion: 'v4', credentials });

// resolve full folder path
const distFolderPath = path.join(__dirname, config.folderPath);

const readDir = (folder) => {
  fs.readdir(folder, (err, files) => {
    if (!files || files.length === 0) {
      console.log(`provided folder '${folder}' is empty or does not exist.`);
      return;
    }

    // for each file in the directory
    for (const fileName of files) {
      const filePath = path.join(folder, fileName);
      const relativePath = filePath.replace(`${distFolderPath}/`, '');

      fs.lstat(filePath, (error, stats) => {
        if (error) { return console.log(error); }

        if (stats.isFile()) {
          fs.readFile(filePath, (error, fileContent) => {
            if (error) { return console.log(error); }

            const mimeType = mime.lookup(fileName);

            zlib.gzip(fileContent, (error, result) => {
              if (error) { return console.log(error); }

              s3.putObject({
                Bucket: config.s3BucketName,
                Key: relativePath,
                Body: result,
                ContentType: `${mimeType}`,
                ContentEncoding: 'gzip'
              }, (error) => {
                if (error) { return console.log(error); }
                console.log(`Successfully uploaded '${fileName}' with MIME type '${mimeType}'!`);
              });
            });
          });
        } else if (stats.isDirectory()) {
          readDir(filePath);
        }
      });
    }
  });
};

readDir(distFolderPath);
