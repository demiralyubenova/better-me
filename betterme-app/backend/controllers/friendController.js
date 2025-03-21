const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

exports.getFriends = async (req, res) => {
    const { user_id } = req.query;

    // Намери всички приятели на потребителя
    const { data: friends, error } = await supabase.from('friends').select('friend_id').eq('user_id', user_id);

    if (error || !friends.length) return res.status(404).json({ message: "No friends found" });

    // Намери данните на всички приятели
    const friendIds = friends.map(f => f.friend_id);
    const { data: users, error: usersError } = await supabase.from('users').select('email').in('id', friendIds);

    if (usersError) return res.status(500).json({ message: "Error fetching data" });

    res.json(users);
}

// ➕ Добавяне на приятел
exports.addFriend = async (req, res) => {
    const { user_id, friend_email } = req.body;

    // Намери ID на приятеля
    const { data, error } = await supabase.auth.admin.listUsers();
    if (error) return res.status(500).json({ message: "Error fetching users", error });

    const friend = data.users.find(user => user.email === friend_email);
    if (!friend) return res.status(404).json({ message: "Friend not found" });

    // Добави в таблицата "friends"
    const { data: insertData, error: insertError } = await supabase.from('friends').insert([{ user_id, friend_id: friend.id }]);

    if (insertError) return res.status(500).json({ message: "Error adding friend", insertError });

    res.json({ message: "Friend added!" });
};

// 📊 Сравнение на доходите
exports.compareIncome = async (req, res) => {
    const { user_id } = req.query;

    // Намери всички приятели
    const { data: friends, error } = await supabase.from('friends').select('friend_id').eq('user_id', user_id);

    if (error || !friends.length) return res.status(404).json({ message: "No friends found" });

    // Намери приходите и разходите на всички приятели
    const friendIds = friends.map(f => f.friend_id);
    const { data: users, error: usersError } = await supabase.from('user_basic_info').select('income, expenses').in('id', friendIds);

    if (usersError) return res.status(500).json({ message: "Error fetching data" });

    // Изчисли "донътния доход" (income - expenses)
    const result = users.map(user => ({
        email: friends.find(f => f.friend_id === user.id).email,
        donut_income: user.income - user.expenses
    }));

    res.json(result);
};
