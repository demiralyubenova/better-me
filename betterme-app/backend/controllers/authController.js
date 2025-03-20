const supabase = require('../utils/supabaseClient');

exports.signup = async (req, res) => {
  const { email, password } = req.body;

  const trimmedEmail = email.trim();
  const trimmedPassword = password.trim();

  if (trimmedPassword.length < 7) {
    return res.status(400).json({ error: "Password must be at least 7 characters long." });
  }
  if (!/[a-zA-Z]/.test(trimmedPassword) || !/\d/.test(trimmedPassword)) {
    return res.status(400).json({ error: "Password must contain at least one letter and one number." });
  }

  const { data, error } = await supabase.auth.signUp({ email: trimmedEmail, password: trimmedPassword });

  if (error) return res.status(400).json({ error: error.message });
  res.json({ data });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) return res.status(400).json({ error: error.message });
  res.json({ data });
};
