const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");

// Middleware
app.use(cors());
app.use(express.json()); //req.body

//Routes

//CREATE (Add price data??)

app.post("/gasInfo", async (req, res) => {
  try {
    const { date, name_address, gas_price, gas_type } = req.body;
    const newGasInfo = await pool.query(
      "INSERT INTO gasprices (date, name_address, gas_price, gas_type) VALUES($1, $2, $3, $4) RETURNING *;",
      [date, name_address, gas_price, gas_type]
    );

    res.json(newGasInfo);
  } catch (err) {
    console.error(err.message);
  }
});

// Get ALL gas prices

app.get("/gasInfo", async (req, res) => {
  try {
    const allGasInfo = await pool.query("SELECT * FROM gasprices");
    res.json(allGasInfo.rows);
  } catch (err) {
    console.error(err.message);
  }
});

// Get specific gas prices by id

app.get("/gasInfo/id/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const gasprice = await pool.query("SELECT * FROM gasprices WHERE id = $1", [
      id,
    ]);
    res.json(gasprice.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

// Get specific gas prices by DATE

app.get("/gasInfo/date/:date", async (req, res) => {
  try {
    const { date } = req.params;
    const gasprice = await pool.query(
      "SELECT * FROM gasprices WHERE date LIKE '%' || $1 || '%'",
      [date]
    );
    res.json(gasprice.rows);
  } catch (err) {
    console.error(err.message);
  }
});

// Get all gas prices by type

app.get("/gasInfo/type/:type", async (req, res) => {
  try {
    const { gas_type } = req.params;
    const gasprice = await pool.query(
      "SELECT * FROM gasprices WHERE gas_type LIKE '%' || $1 || '%'",
      [gas_type]
    );
    res.json(gasprice.rows);
  } catch (err) {
    console.error(err.message);
  }
});

// Update a gasPrice

app.put("/gasInfo/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name_address } = req.body;
    const updateAddress = await pool.query(
      "UPDATE gasprices SET name_address = $1 WHERE id = $2",
      [name_address, id]
    );

    res.json("Name/Address was updated");
  } catch (err) {
    console.error(err.message);
  }
});

// Delete a gas price

app.delete("/gasInfo/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleteGasPrice = await pool.query(
      "DELETE FROM gasprices WHERE id = $1",
      [id]
    );
    res.json("Gas Price was deleted!");
  } catch (err) {
    console.error(err.message);
  }
});

app.listen(5000, () => {
  console.log("Server has started on port 5000");
});
