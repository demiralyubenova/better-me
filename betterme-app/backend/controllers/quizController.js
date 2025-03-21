const supabase = require('../utils/supabaseClient');

exports.finishquiz = async (req, res) => {
    const { userId, xp } = req.body;
    try {
        const { data: existingUser, error: fetchError } = await supabase
            .from('user_level')
            .select('*')
            .eq('user_id', userId)
            .single();
        
        if (fetchError && fetchError.code !== 'PGRST116') {
            return res.status(400).json({ error: fetchError.message });
        }

        let result;

        if (existingUser) {
            const newXp = existingUser.xp + xp;

            result = await supabase
                .from('user_level')
                .update({ xp: newXp })
                .eq('user_id', userId)
                .select();

            return res.json({ 
                message: "Updated XP for existing user", 
                data: result.data,
                previousXp: existingUser.xp,
                newXp
            });
        } else {
            result = await supabase
                .from('user_level')
                .insert([{ user_id: userId, xp: xp }])
                .select();
            return res.json({ 
                message: "Created new user XP record", 
                data: result.data 
            });
        }
    } catch (error) {
        console.error("Error processing XP update:", error);
        return res.status(500).json({ error: "Server error processing XP update" });
    }
};