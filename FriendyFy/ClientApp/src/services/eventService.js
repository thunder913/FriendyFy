export function createEvent(name, date, interests, privacyOptions, latitude, longitude, description, isReocurring, reocurringFrequency = null){
    return fetch('/event/create', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({name, date, interests, privacyOptions, latitude, longitude, description, isReocurring, reocurringFrequency})
    });
}