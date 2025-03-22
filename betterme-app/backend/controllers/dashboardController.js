const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

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


exports.getFriendsAnalytics = async (req, res) => {
    const { user_id } = req.body;
    if (!user_id) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    console.log(user_id)
  
    try {
      const { data: friendships, error: friendshipError } = await supabase
        .from('friends')
        .select('*')
        .eq('user_id', user_id)
      console.log(friendships)
      if (friendshipError) {
        return res.status(400).json({ error: friendshipError.message });
      }
      
      if (!friendships || friendships.length === 0) {
        return res.json({ friends: [] });
      }
      
      const friendIds = friendships.map(friendship => friendship.friend_id);
      
      const { data: friendsData, error: friendsDataError } = await supabase
        .from('user_basic_info')
        .select('user_id, income, expenses')
        .in('user_id', friendIds);
      
      if (friendsDataError) {
        return res.status(400).json({ error: friendsDataError.message });
      }
      
      const { data: { users: usernamesData }, error: usernamesError } = await supabase.auth.admin.listUsers();
      
      if (usernamesError) {
        return res.status(400).json({ error: usernamesError.message });
      }


      const relevantUsers = usernamesData.filter(user => friendIds.includes(user.id));
      
      const getDisplayName = (email) => {
        return email ? email.split('@')[0] : 'Unknown User';
      };
      
      const friendsWithDetails = friendsData.map(friend => {
        const userInfo = relevantUsers.find(user => user.id === friend.user_id);
        return {
          ...friend,
          username: userInfo ? getDisplayName(userInfo.email) : 'Unknown User'
        };
      });
      
      return res.json({ friends: friendsWithDetails });
    } catch (error) {
      console.error('Error fetching friends financial data:', error);
      return res.status(500).json({ error: 'Server error' });
    }
    };