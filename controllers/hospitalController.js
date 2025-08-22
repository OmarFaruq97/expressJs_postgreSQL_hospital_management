const pool = require("../config/database");

// POST: CRUD using function
exports.hospitalCrud = async (req, res) => {
  try {
    const params = req.body; // { action_mode, id, name, user, etc. }

    const { rows } = await pool.query(
      "SELECT public.fn_hospital_crud($1) as result",
      [params]
    );
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

// GET ALL
exports.getAllHospitals = async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM t_hospitals");
    res.json({ success: true, msg: "All hospitals fetched", data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: err.message, data: null });
  }
};

// GET BY ID
exports.getHospitalById = async (req, res) => {
  try {
    const id = req.params.id;
    const { rows } = await pool.query(
      "SELECT * FROM t_hospitals WHERE id = $1",
      [id]
    );
    if (rows.length === 0)
      return res
        .status(404)
        .json({ success: false, msg: "Hospital not found", data: null });

    res.json({ success: true, msg: "Hospital fetched", data: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: err.message, data: null });
  }
};
