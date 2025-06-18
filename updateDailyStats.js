const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
);

async function updateDailyStats(eventType) {
    try {
        console.log(`Updating stats for event type: ${eventType}`);
        
        // Get today's date in YYYY-MM-DD format
        const today = new Date().toISOString().split('T')[0];
        
        // Try to get today's stats record
        const { data: existingStats, error: fetchError } = await supabase
            .from('cloaking_site_table')
            .select('*')
            .eq('date', today)
            .single();

        if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
            console.error('Error fetching stats:', fetchError);
            return;
        }

        if (!existingStats) {
            // If no stats exist for today, create a new record
            const newStats = {
                date: today,
                page_views: eventType === 'page_view' ? 1 : 0,
               
            };
            console.log('Creating new stats record for today:', newStats);

            const { error: insertError } = await supabase
                .from('cloaking_site_table')
                .insert([newStats]);

            if (insertError) {
                console.error('Error creating stats:', insertError);
            } else {
                console.log('Successfully created new stats record for today');
            }
        } else {
            // Update today's stats
            const updateData = {
                total_events: existingStats.total_events + 1
            };

            // Increment the appropriate counter
            switch (eventType) {
                case 'page_view':
                    updateData.page_views = existingStats.page_views + 1;
                    break;
               
            }

            console.log('Updating today\'s stats:', {
                previous: existingStats,
                update: updateData
            });

            const { error: updateError } = await supabase
                .from('cloaking_site_table')
                .update(updateData)
                .eq('date', today);

            if (updateError) {
                console.error('Error updating stats:', updateError);
            } else {
                console.log('Successfully updated today\'s stats');
            }
        }
    } catch (error) {
        console.error('Error in updateDailyStats:', error);
    }
}

module.exports = updateDailyStats; 