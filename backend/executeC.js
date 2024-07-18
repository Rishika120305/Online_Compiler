const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");

const executeC = (filepath) => {
  const jobId = path.basename(filepath).split(".")[0];
  const outPath = path.join(__dirname, "outputs");
  const outFile = `${outPath}/${jobId}.out`;

  return new Promise((resolve, reject) => {
    exec(
      `gcc ${filepath} -o ${outFile} && ${outFile}`,
      (error, stdout, stderr) => {
        error && reject({ error, stderr });
        stderr && reject(stderr);
        resolve(stdout);
      }
    );
  });
};

module.exports = {
  executeC,
};
