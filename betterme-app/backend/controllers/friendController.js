const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

exports.getFriends = async (req, res) => {
    const { userId } = req.body;
    const { data: friends, error } = await supabase.from('friends').select('*').eq('user_id', userId);

    if (error || !friends.length) return res.status(404).json({ message: "No friends found" });

 
    const friendIds = friends.map(f => f.friend_id);
    // Get user data from auth.users table
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    if (authError) return res.status(500).json({ message: "Error fetching auth users" });

    const usersWithEmails = friendIds.map(id => {
        const authUser = authUsers.users.find(user => user.id === id);
        return { email: authUser?.email };
    });

    users = usersWithEmails;

    res.json(users);
}

exports.addFriend = async (req, res) => {
    const { userId, email } = req.body;

    const { data, error } = await supabase.auth.admin.listUsers();
    if (error) return res.status(500).json({ message: "Error fetching users", error });

    const friend = data.users.find(user => user.email === email);
    if (!friend) return res.status(404).json({ message: "Friend not found" });

    const { data: insertData, error: insertError } = await supabase.from('friends').insert([{ user_id: userId, friend_id: friend.id }]);

    if (insertError) return res.status(500).json({ message: "Error adding friend", insertError });

    res.json({ message: "Friend added!" });
};

exports.compareIncome = async (req, res) => {
    const { user_id } = req.query;

    const { data: friends, error } = await supabase.from('friends').select('friend_id').eq('user_id', user_id);

    if (error || !friends.length) return res.status(404).json({ message: "No friends found" });

    const friendIds = friends.map(f => f.friend_id);
    const { data: users, error: usersError } = await supabase.from('user_basic_info').select('income, expenses').in('id', friendIds);

    if (usersError) return res.status(500).json({ message: "Error fetching data" });

    const result = users.map(user => ({
        email: friends.find(f => f.friend_id === user.id).email,
        donut_income: user.income - user.expenses
    }));

    res.json(result);
};

