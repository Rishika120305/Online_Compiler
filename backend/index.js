const express = require('express');
const app = express();
const { generateFile } = require('./generateFile');
const { executeC } = require("./executeC");
const { executeCpp } = require('./executeCpp');
const { executePy } = require('./executePy');
const { executeJava } = require("./executeJava");
const cors = require('cors');

//middlewares
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
    res.json({ online: 'compiler' });
});

app.post("/run", async (req, res) => {
    // const language = req.body.language;
    // const code = req.body.code;

    const { language, code } = req.body;
    if (code === undefined) {
        return res.status(404).json({ success: false, error: "Empty code!" });
    }
    try {
        const filePath = await generateFile(language, code);
        if (language === "cpp") {
            output = await executeCpp(filePath);
        } else if (language === "c") {
            output = await executeC(filePath);
        } else if (language === 'py') {
            output = await executePy(filePath);
        } else if (language === "java") {
            output = await executeJava(filepath);
        }
        else {
            return res.status(400).json({ success: false, error: "Unsupported language!" });
        }
        res.json({ filePath, output });
    } catch (error) {
        res.status(500).json({ error: error });
    }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}!`);
});
