const express = require("express");
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require('uuid');
const client = require("./client");
const path = require("path");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
    client.getAll(null, (err, data) => {
        if (!err) {
            res.json(data);
        } else {
            console.error(err);
            res.status(500).send({
                msg: "There was some issue"
            });
        }
    });
});

app.get('/:id', (req, res) => {
    client.get({ id: req.params.id }, (err, data) => {
        if (!err) {
            res.json(data);
        } else {
            console.error(err);
            res.status(500).send({
                msg: "There was some issue"
            });
        }
    });
});

app.post("/create", (req, res) => {
    let newCve = {
        id: uuidv4(),
        title: req.body.title,
        severity: req.body.severity,
        platform: req.body.platform
    };

    client.insert(newCve, (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send({
                msg: "There was some issue"
            });
        } else {
            console.log("cve created successfully", data);
            res.redirect("/");
        }
    });
});

app.patch("/update/:id", (req, res) => {
    const updateCve = { 
        id: req.params.id, // Fetch ID from params
        title: req.body.title, 
        severity: req.body.severity, 
        platform: req.body.platform
    };

    client.update(updateCve, (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send({
                msg: "There was some issue"
            });
        } else {
            if (!data) {
                console.log("Your ID isn't available");
                res.json("Your ID isn't available");
                return;
            }
            console.log("cve updated successfully", data);
            res.json(data);
        }
    });
});

app.delete("/delete/:id", (req, res) => {
    const getId = req.params.id;
    client.remove({ id: getId }, (err, _) => {
        if (err) {
            console.error(err);
            res.status(500).send({
                msg: "There was some issue"
            });
        } else {
            console.log("cve removed successfully");
            res.json('ID ' + getId + ' deleted successfully');
        }
    });
});

// Start Express server
const PORT = process.env.PORT || 2709;
app.listen(PORT, () => {
    console.log("Server running at port %d", PORT);
});
