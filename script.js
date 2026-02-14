
let events = JSON.parse(localStorage.getItem('events')) || [];

const eventTitle = document.getElementById('eventTitle');
const eventDate = document.getElementById('eventDate');
const eventCategory = document.getElementById('eventCategory');
const eventDescription = document.getElementById('eventDescription');
const addEventBtn = document.getElementById('addEventBtn');
const clearAllBtn = document.getElementById('clearAllBtn');
const addSampleBtn = document.getElementById('addSampleBtn');
const eventsList = document.getElementById('eventsList');
const emptyMsg = document.getElementById('emptyMsg');


document.addEventListener('DOMContentLoaded', () => {
    renderEvents();
    setMinDate();
});


function setMinDate() {
    const today = new Date().toISOString().split('T')[0];
    eventDate.setAttribute('min', today);
}


addEventBtn.addEventListener('click', addEvent);


eventTitle.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addEvent();
});

eventDescription.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && e.ctrlKey) addEvent();
});


function addEvent() {
    
    const title = eventTitle.value.trim();
    const date = eventDate.value;
    const category = eventCategory.value;
    const description = eventDescription.value.trim();

    
    if (!title) {
        alert('Please enter an event title!');
        eventTitle.focus();
        return;
    }

    if (!date) {
        alert('Please select an event date!');
        eventDate.focus();
        return;
    }

    
    const newEvent = {
        id: Date.now(),
        title: title,
        date: date,
        category: category,
        description: description || 'No description provided'
    };

    
    events.push(newEvent);
    
    
    saveEvents();
    
    
    clearForm();
    
    
    renderEvents();
    
    
    showNotification('Event added successfully! 🎉');
}


function clearForm() {
    eventTitle.value = '';
    eventDate.value = '';
    eventCategory.selectedIndex = 0;
    eventDescription.value = '';
    eventTitle.focus();
}


function renderEvents() {
    if (events.length === 0) {
        eventsList.innerHTML = '<div id="emptyMsg">No events yet. Add your first event!</div>';
        return;
    }


    events.sort((a, b) => new Date(a.date) - new Date(b.date));

    eventsList.innerHTML = events.map(event => {
        const formattedDate = formatDate(event.date);
        const isPast = new Date(event.date) < new Date().setHours(0, 0, 0, 0);
        
        return `
            <div class="event-item ${isPast ? 'past-event' : ''}">
                <div class="event-header">
                    <div class="event-title">${event.title}</div>
                    <div class="event-category">${event.category}</div>
                </div>
                <div class="event-date">📅 ${formattedDate}</div>
                <div class="event-description">${event.description}</div>
                <div class="event-actions">
                    <button class="btn-delete" onclick="deleteEvent(${event.id})">🗑️ Delete</button>
                </div>
            </div>
        `;
    }).join('');
}


function formatDate(dateString) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options);
}


function deleteEvent(id) {
    if (confirm('Are you sure you want to delete this event?')) {
        events = events.filter(event => event.id !== id);
        saveEvents();
        renderEvents();
        showNotification('Event deleted successfully!');
    }
}


clearAllBtn.addEventListener('click', () => {
    if (events.length === 0) {
        alert('No events to clear!');
        return;
    }
    
    if (confirm('Are you sure you want to delete ALL events? This cannot be undone!')) {
        events = [];
        saveEvents();
        renderEvents();
        showNotification('All events cleared!');
    }
});


addSampleBtn.addEventListener('click', () => {
    const today = new Date();
    
    const sampleEvents = [
        {
            id: Date.now() + 1,
            title: 'Team Meeting',
            date: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            category: 'Meeting',
            description: 'Weekly team sync-up to discuss project progress and upcoming tasks.'
        },
        {
            id: Date.now() + 2,
            title: 'Tech Conference 2026',
            date: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            category: 'Conference',
            description: 'Annual technology conference featuring latest innovations and networking opportunities.'
        },
        {
            id: Date.now() + 3,
            title: 'Web Development Workshop',
            date: new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            category: 'Workshop',
            description: 'Hands-on workshop covering modern web development techniques and best practices.'
        },
        {
            id: Date.now() + 4,
            title: 'Client Presentation',
            date: new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            category: 'G-Meet',
            description: 'Virtual presentation to showcase project deliverables and gather client feedback.'
        }
    ];

    events = [...events, ...sampleEvents];
    saveEvents();
    renderEvents();
    showNotification('Sample events added! 📝');
});


function saveEvents() {
    localStorage.setItem('events', JSON.stringify(events));
}



