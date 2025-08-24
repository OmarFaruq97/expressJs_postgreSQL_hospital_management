const pool = require("../config/database");

// POST: CRUD
exports.doctorCrud = async (req, res) => {
  try {
    const params = req.body;
    const { rows } = await pool.query(
      "SELECT public.fn_doctor_crud($1) as result",
      [params]
    );
    res.json(rows[0].result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: err.message, data: null });
  }
};

// GET ALL
exports.getAllDoctors = async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM t_doctors");
    res.json({ success: true, msg: "All doctors fetched", data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: err.message, data: null });
  }
};

// GET BY ID
exports.getDoctorById = async (req, res) => {
  try {
    const id = req.params.id;
    const { rows } = await pool.query("SELECT * FROM t_doctors WHERE id = $1", [
      id,
    ]);
    if (rows.length === 0)
      return res
        .status(404)
        .json({ success: false, msg: "Doctor not found", data: null });
    res.json({ success: true, msg: "Doctor fetched", data: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: err.message, data: null });
  }
};
