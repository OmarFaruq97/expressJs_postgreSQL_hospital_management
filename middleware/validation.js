const validateClinicalDiagnosis = (req, res, next) => {
  const { action_mode, name, user, id } = req.body;
  
  if (!action_mode) {
    return res.status(400).json({ status: 'error', message: 'action_mode is required' });
  }

  if (action_mode === 'insert' && (!name || !user)) {
    return res.status(400).json({ status: 'error', message: 'name and user are required for insert' });
  }

  if ((action_mode === 'update' || action_mode === 'deactivate') && (!id || !user)) {
    return res.status(400).json({ status: 'error', message: 'id and user are required for ' + action_mode });
  }

  if (action_mode === 'update' && !name) {
    return res.status(400).json({ status: 'error', message: 'name is required for update' });
  }

  if (action_mode === 'delete' && !id) {
    return res.status(400).json({ status: 'error', message: 'id is required for delete' });
  }

  next();
};

const validateCoMorbidities = (req, res, next) => {
  const { action_mode, name, user, id } = req.body;
  
  if (!action_mode) {
    return res.status(400).json({ status: 'error', message: 'action_mode is required' });
  }

  if (action_mode === 'insert' && (!name || !user)) {
    return res.status(400).json({ status: 'error', message: 'name and user are required for insert' });
  }

  if ((action_mode === 'update' || action_mode === 'deactivate') && (!id || !user)) {
    return res.status(400).json({ status: 'error', message: 'id and user are required for ' + action_mode });
  }

  if (action_mode === 'update' && !name) {
    return res.status(400).json({ status: 'error', message: 'name is required for update' });
  }

  if (action_mode === 'delete' && !id) {
    return res.status(400).json({ status: 'error', message: 'id is required for delete' });
  }

  next();
};

module.exports = { validateClinicalDiagnosis, validateCoMorbidities };