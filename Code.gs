function summarizeSessions() {
    const calendarId = getCalendarIdFromScriptProperties();
    const startDate = new Date("2025-02-04");
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 14);

    const calendar = CalendarApp.getCalendarById(calendarId);
    const events = calendar.getEvents(startDate, endDate);
	
    // Sum up minutes of pomodoro events (those starting with ⏱️) and collect their original Intents

    const eventsArray = events.reduce((summary, event) => {
        const title = event.getTitle().split(':')[0].trim();
        if (title.startsWith('⏱️')) {
            const duration = Math.round((event.getEndTime() - event.getStartTime()) / (1000 * 60)); // Convert to minutes and round
            summary['combined_minutes'] = summary['combined_minutes'] || {};
            summary['combined_minutes'][title] = (summary['combined_minutes'][title] || 0) + duration;
            summary['session_intents'] = summary['session_intents'] || {};
            summary['session_intents'][title] = (summary['session_intents'][title] || '') + (summary['session_intents'][title] ? ' | ' : '') + event.getTitle().split(':')[1].trim();
        }
        return summary;
    }, {});

    Logger.log(JSON.stringify(eventsArray, null, 2));
}

function getCalendarIdFromScriptProperties() {
    var scriptProperties = PropertiesService.getScriptProperties();
    var calendarId = scriptProperties.getProperty("CalendarID");
  
    if (!calendarId) {
      throw new Error("CalendarID not found in Script Properties. Please set it before running the script.");
    }
  
    return calendarId;
}