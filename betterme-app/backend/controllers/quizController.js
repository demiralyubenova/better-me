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

exports.finishlesson = async (req, res) => {
    {
        const { userId, lessonId } = req.body;

        try {
          const { data: existingCompletion, error: checkError } = await supabase
            .from('completed_lessons')
            .select('*')
            .eq('user_id', userId)
            .eq('lesson_id', lessonId)
            .single();
          
          if (checkError && checkError.code !== 'PGRST116') {
            return res.status(400).json({ error: checkError.message });
          }
          
          if (existingCompletion) {
            return res.json({ success: true, message: 'Lesson was already completed' });
          }
          
          const { error: insertError } = await supabase
            .from('completed_lessons')
            .insert([{ 
              user_id: userId, 
              lesson_id: lessonId,
            }]);
            
          if (insertError) {
            return res.status(400).json({ error: insertError.message });
          }
          
          // Update the user's XP
          const { data: userData, error: fetchError } = await supabase
            .from('user_level')
            .select('*')
            .eq('user_id', userId)
            .single();
            
          if (fetchError && fetchError.code !== 'PGRST116') {
            return res.status(400).json({ error: fetchError.message });
          }
          
          let xpUpdateResult;
          
          if (userData) {
            // User exists, update XP
            xpUpdateResult = await supabase
              .from('user_level')
              .update({ xp: userData.xp + 10 })
              .eq('user_id', userId);
          } else {
            // User doesn't exist in XP table yet
            xpUpdateResult = await supabase
              .from('user_level')
              .insert([{ user_id: userId, xp: 10 }]);
          }
          
          if (xpUpdateResult.error) {
            return res.status(400).json({ error: xpUpdateResult.error.message });
          }
          
          return res.json({ 
            success: true, 
            message: 'Lesson marked as completed and XP awarded',
            xpAwarded: 10
          });
        } catch (error) {
          console.error('Error marking lesson as completed:', error);
          return res.status(500).json({ error: 'Server error' });
        }
      }
};

exports.getlessons = async (req, res) => {
    const { userId } = req.query;

    try {
        const { data: existingCompletion, error: checkError } = await supabase
        .from('completed_lessons')
        .select('*')
        .eq('user_id', userId)

        if (checkError && checkError.code !== 'PGRST116') {
            return res.status(400).json({ error: checkError.message });
        }

        return res.json({ success: true, data: existingCompletion });
    }
    catch (error) {
        console.error('Error fetching lessons:', error);
        return res.status(500).json({ error: 'Server error' });
    }
}