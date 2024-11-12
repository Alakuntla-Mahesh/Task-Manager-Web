const express = require("express");
const path = require("path");

const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const cors = require('cors');


const app = express();
app.use(cors());

app.options('*', cors());
app.use(express.json());
const dbPath = path.join(__dirname, "dataBase.db");

let db = null;

const initializeDBAndServer = async () => {
    try {
        db = await open({
            filename: dbPath,
            driver: sqlite3.Database,
        });
        app.listen(3100, () => {
            console.log("Server Running at http://localhost:3100/");
        });
    } catch (e) {
        console.log(`DB Error: ${e.message}`);
        process.exit(1);
    }
};

initializeDBAndServer();

app.get("/", async (request, response) => {
    const getNameQuery = `
          SELECT
            *
          FROM
            Tasks
         `;
    const nameArray = await db.all(getNameQuery);
    response.send(nameArray);
});

app.post('/task', async (request, response) => {
    const data = request.body;
    const { task, status } = data;

    try {

        const checkQuery = `SELECT task FROM Tasks WHERE task = '${task}'`;
        const dbUser = await db.get(checkQuery);

        if (dbUser === undefined) {

            const insertTask = `
          INSERT INTO Tasks (task, status) VALUES (?, ?)
        `;
            await db.run(insertTask, [task, status]);

            response.status(201).json({ message: 'Data inserted successfully' });
        } else {

            response.status(400).json({ message: "Task already exists" });
        }
    } catch (error) {

        console.error("Error inserting task:", error.message);
        response.status(500).json({ error: "Failed to insert task" });
    }
});


app.delete('/task/:id', async (req, res) => {
    const { id } = req.params;

    const deleteItemQuery = `delete from Tasks where id=${id}`;
    await db.run(deleteItemQuery);
    res.status(200)
    res.json({ message: "item is successfully deleted" })

});

app.put('/task/:id', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const updateQuery = `UPDATE Tasks SET status = ${status} WHERE  id = ${id};`
    await db.run(updateQuery)

    res.status(200)
    res.json({ message: "item is status successfully updated" })
})