const cron = require('node-cron');
const sendEmail = require('./emailServices'); // Функцията за изпращане на имейли
const supabase = require('../utils/supabaseClient'); // Връзка със Supabase

// Разписание: Изпращане на имейли всеки ден в 20:00
cron.schedule('0 20 * * *', async () => {
  console.log('Изпращане на напомняния за потребители...');

  const { data: users, error } = await supabase
    .from('users')
    .select('email')
    .eq('wants_notifications', true); // Извличаме само потребителите, които искат нотификации

  if (error) {
    console.error('Грешка при извличане на потребители:', error);
    return;
  }

  if (!users || users.length === 0) {
    console.log('Няма потребители, които да получават напомняния.');
    return;
  }

  users.forEach(user => {
    sendEmail(user.email); // Изпращаме имейл на всеки потребител
  });
});
