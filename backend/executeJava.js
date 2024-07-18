const { exec } = require("child_process");
const path = require("path");

const executeJava = (filepath) => {
  const jobId = path.basename(filepath).split(".")[0];
  const outPath = path.join(__dirname, "outputs");
  const outFile = `${outPath}/${jobId}.out`;

  return new Promise((resolve, reject) => {
    exec(
      `javac ${filepath} && java -cp ${outPath} ${jobId}`,
      (error, stdout, stderr) => {
        if (error) {
          reject({ error, stderr });
        } else {
          resolve(stdout);
        }
      }
    );
  });
};

module.exports = {
  executeJava,
};
