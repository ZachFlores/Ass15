const express = require("express");
const app = express();
const fs = require('fs');
const multer = require('multer');
const Joi = require('joi');
const cors = require('cors');

app.use(express.static("public"));
app.use(express.json());
app.use(cors());

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
});

const upload = multer({ storage: storage }).single('itemImage');

const craftsSchema = Joi.object({
    itemName: Joi.string().required(),
    itemDescription: Joi.string().required(),
    supply: Joi.array().items(Joi.string()).required()
});

app.get("/api/crafts", async (req, res) => {
    try {
        const data = await fs.promises.readFile('crafts.json', 'utf8');
        const crafts = JSON.parse(data);
        res.json(crafts);
    } catch (err) {
        console.error("Error reading crafts.json:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.post("/api/addItem", (req, res) => {
    upload(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(500).json({ error: "File upload error" });
        } else if (err) {
            return res.status(500).json({ error: "File upload error" });
        }

        const { error } = craftsSchema.validate(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        }

        const crafts = JSON.parse(fs.readFileSync('crafts.json', 'utf8'));
        const newItem = {
            name: req.body.itemName,
            description: req.body.itemDescription,
            image: req.file.filename,
            supplies: req.body.supply
        };
        crafts.push(newItem);

        try {
            await fs.promises.writeFile('crafts.json', JSON.stringify(crafts));
            res.status(200).send("Item added successfully");
        } catch (err) {
            console.error("Error writing to crafts.json:", err);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });
});

app.listen(3000, () => {
    console.log("Listening on port 3000");
});
