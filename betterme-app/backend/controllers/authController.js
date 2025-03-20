const supabase = require('../utils/supabaseClient');

exports.signup = async (req, res) => {
  const { email, password } = req.body;
  email.trim()
  password.trim()
  const { data, error } = await supabase.auth.signUp({ email, password });
  
  if (error) return res.status(400).json({ error: error.message });
  res.json({ data });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  
  if (error) return res.status(400).json({ error: error.message });
  res.json({ data });
};