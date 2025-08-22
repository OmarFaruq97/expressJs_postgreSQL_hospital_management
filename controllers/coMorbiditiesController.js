const pool = require("../config/database");

const coMorbiditiesCRUD = async (req, res) => {
  try {
    const { action_mode, id, name, user } = req.body;

    const params = {
      action_mode,
      id: id || null,
      name: name || null,
      user: user || null,
    };

    const result = await pool.query("CALL proc_co_morbidities_crud($1, NULL)", [
      JSON.stringify(params),
    ]);

    if (action_mode === "insert") {
      const insertedData = await pool.query(
        "SELECT * FROM t_co_morbidities WHERE id = (SELECT MAX(id) FROM t_co_morbidities)"
      );
      res.json({
        status: "success",
        message: "Record inserted successfully",
        data: insertedData.rows[0],
      });
    } else {
      res.json({
        status: "success",
        message: `Record ${action_mode}d successfully`,
      });
    }
  } catch (error) {
    console.error("Error in co-morbidities CRUD:", error);
    res.status(500).json({ status: "error", message: error.message });
  }
};

const getCoMorbidities = async (req, res) => {
  try {
    const { status } = req.query;
    let query = "SELECT * FROM t_co_morbidities";
    let params = [];

    if (status !== undefined) {
      query += " WHERE status = $1 ORDER BY name";
      params = [status];
    } else {
      query += " ORDER BY name";
    }

    const result = await pool.query(query, params);
    res.json({ status: "success", data: result.rows });
  } catch (error) {
    console.error("Error fetching co-morbidities:", error);
    res.status(500).json({ status: "error", message: error.message });
  }
};

const getCoMorbidityById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "SELECT * FROM t_co_morbidities WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ status: "error", message: "Record not found" });
    }

    res.json({ status: "success", data: result.rows[0] });
  } catch (error) {
    console.error("Error fetching co-morbidity:", error);
    res.status(500).json({ status: "error", message: error.message });
  }
};

module.exports = {
  coMorbiditiesCRUD,
  getCoMorbidities,
  getCoMorbidityById,
};
