
// Function to log events to the backend
async function logEvent(eventType, additionalData = {}) {
    try {
        const response = await fetch('/api/logEvent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                type: eventType,
                session_id: sessionId,
                timestamp: new Date().toISOString(),
                duration: formatDuration(timeSpent),
                ...additionalData
            })
        });

        if (!response.ok) {
            console.error('Failed to log event:', await response.text());
        }
    } catch (error) {
        console.error('Error logging event:', error);
    }
}

// Log page view when the page loads
document.addEventListener('DOMContentLoaded', () => {
    logEvent('page_view');
});
