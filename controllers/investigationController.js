const pool = require("../config/database");

// POST: CRUD using function
exports.investigationCrud = async (req, res) => {
  try {
    const params = req.body; // { action_mode, id, name, user }

    const { rows } = await pool.query(
      "SELECT public.fn_investigation_master_crud($1) as result",
      [params]
    );
    res.json(rows[0].result);

    // Send the JSON result
    res.json(rows[0].result);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      msg: err.message,
      data: null,
    });
  }
};

// GET ALL investigations
exports.getAllInvestigations = async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM t_investigation_master");
    res.json({ success: true, msg: "All investigations fetched", data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: err.message, data: null });
  }
};

// GET investigation by ID
exports.getInvestigationById = async (req, res) => {
  try {
    const id = req.params.id;
    const { rows } = await pool.query(
      "SELECT * FROM t_investigation_master WHERE id = $1",
      [id]
    );
    if (rows.length === 0)
      return res
        .status(404)
        .json({ success: false, msg: "Investigation not found", data: null });

    res.json({ success: true, msg: "Investigation fetched", data: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: err.message, data: null });
  }
};
