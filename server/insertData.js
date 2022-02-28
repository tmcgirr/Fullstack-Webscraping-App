//////////////////////////////////////////////////////
// Node insertData.js will read tempGasInfo123.json and insert to db
const fs = require("fs");
const axios = require("axios");

///////////////////////////////////////////////////////

process.setMaxListeners(0);

const dir = "./tempData/";
// list all files in the directory
fs.readdir(dir, (err, files) => {
  if (err) {
    throw err;
  }
  files.forEach((file) => {
    const readStream = fs.createReadStream(dir + file, "utf8");
    readStream
      .on("data", function (chunk) {
        // console.log(chunk);
        let chunkString = JSON.parse(chunk);

        if (
          // Maybe exclude all blank/NA data??? (Instead of just gasprice)
          chunkString["gas_price"] !== "N/A" &&
          chunkString["gas_price"] !== "/A" &&
          chunkString["gas_price"] !== ""
        ) {
          // console.log(chunkString["gas_price"]);
          insertData(chunk);
        }
      })
      .on("end", function () {
        console.log(">> Stream is finished");
      });
  });
});

//////////////////////////////////////////////////////////////
// Read File method

// const readFiles = (dirname, onFileContent, onError) => {
//   fs.readdir(dirname, function (err, filenames) {
//     if (err) {
//       onError(err);
//       return;
//     }
//     filenames.forEach(function (filename) {
//       fs.readFile(dirname + filename, "utf-8", function (err, content) {
//         if (err) {
//           onError(err);
//           return;
//         }
//         onFileContent(filename, content);
//       });
//     });
//   });
// };

/////////////////////////////////////////////////////////
const insertData = (data) => {
  try {
    const config = {
      method: "post",
      url: "http://localhost:5000/gasInfo",
      headers: {
        "Content-Type": "application/json",
      },
      data: `${data}`,
    };

    axios(config).catch(function (error) {
      console.log(error);
    });
  } catch (e) {
    console.log("Error: ", e.stack);
  }
};

// const task = cron.schedule(
//   "0 * * * *",
//   () => {
//     insertAllGas();
//   },
//   {
//     scheduled: true,
//   }
// );

// task.start();
