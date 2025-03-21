const supabase = require('../utils/supabaseClient');

exports.getDashboard = async (req, res) => {
    const { user_id } = req.body;
    
    let { data, error } = await supabase
        .from('user_basic_info')
        .select("*")
        .eq('user_id', user_id);

    if (error) return res.status(400).json({ error: error.message });
    res.json({ data });
};

exports.getTransactions = async (req, res) => {
    const { user_id } = req.body;
    
    let { data, error } = await supabase
        .from('transactions')
        .select("*")
        .eq('user_id', user_id);

    if (error) return res.status(400).json({ error: error.message });
    res.json({ data });
};

exports.addTransaction = async (req, res) => {
    const { user_id, category, type, amount } = req.body;

    const { data, error } = await supabase
        .from('transactions')
        .insert([{ user_id, category, type, amount }]);

    if (error) return res.status(400).json({ error: error.message });
    res.json({ message: "Transaction added successfully", data });
};
