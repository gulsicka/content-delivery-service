const { createClient } = require('@supabase/supabase-js');
const updateDailyStats = require('./updateDailyStats');
require('dotenv').config();

console.log('Supabase URL:', process.env.SUPABASE_URL);
console.log('Supabase Key exists:', !!process.env.SUPABASE_KEY);

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
);

async function logEvent(req, res) {
    try {
       
        // Update daily stats
        await updateDailyStats(type);
        console.log('Daily stats update completed');

        res.status(200).json({ message: 'Event logged successfully' });
    } catch (error) {
        console.error('Error in logEvent:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = logEvent; 