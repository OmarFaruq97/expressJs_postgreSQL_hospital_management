const pool = require("../config/database");

const clinicalDiagnosisCRUD = async (req, res) => {
  try {
    const { action_mode, id, name, user } = req.body;

    const params = {
      action_mode,
      id: id || null,
      name: name || null,
      user: user || null,
    };

    const result = await pool.query(
      "CALL proc_clinical_diagnosis_crud($1, NULL)",
      [JSON.stringify(params)]
    );

    // For procedures that don't return data directly, we need to handle the output
    if (action_mode === "insert") {
      // For insert, we can get the inserted data
      const insertedData = await pool.query(
        "SELECT * FROM t_clinical_diagnosis WHERE id = (SELECT MAX(id) FROM t_clinical_diagnosis)"
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
    console.error("Error in clinical diagnosis CRUD:", error);
    res.status(500).json({ status: "error", message: error.message });
  }
};

const getClinicalDiagnoses = async (req, res) => {
  try {
    const { status } = req.query;
    let query = "SELECT * FROM t_clinical_diagnosis";
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
    console.error("Error fetching clinical diagnoses:", error);
    res.status(500).json({ status: "error", message: error.message });
  }
};

const getClinicalDiagnosisById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "SELECT * FROM t_clinical_diagnosis WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ status: "error", message: "Record not found" });
    }

    res.json({ status: "success", data: result.rows[0] });
  } catch (error) {
    console.error("Error fetching clinical diagnosis:", error);
    res.status(500).json({ status: "error", message: error.message });
  }
};

module.exports = {
  clinicalDiagnosisCRUD,
  getClinicalDiagnoses,
  getClinicalDiagnosisById,
};
