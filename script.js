let timers = { 'Silence': 0 }; // Initialize 'Silence'
let counts = { 'Silence': 0 }; // Initialize count for 'Silence'
let currentTimer = null;
let startTime = null;
let currentSpeakingTime = 0;
let updateInterval = null;

function addName() {
    const nameInput = document.getElementById('name-input');
    const name = nameInput.value.trim();
    if (name && !timers.hasOwnProperty(name)) {  // Ensure names are unique
        timers[name] = 0; // Initialize timer for the new name
        counts[name] = 0; // Initialize count for the new name
        const button = document.createElement('button');
        button.innerText = name;
        button.onclick = () => startTimer(name);
        document.getElementById('buttons-section').appendChild(button);
        nameInput.value = '';
        updateTotalTimes();
    }
}

function startTimer(name) {
    if (currentTimer) {
        const endTime = Date.now();
        timers[currentTimer] += (endTime - startTime) / 60000; // Convert ms to minutes
    }

    if (currentTimer !== name) { // Only increment count if a new speaker starts
        counts[name]++;
    }

    currentTimer = name;
    startTime = Date.now();
    currentSpeakingTime = 0;

    document.getElementById('current-speaker').innerText = name;

    clearInterval(updateInterval);
    updateInterval = setInterval(updateCurrentTime, 100);
}

function updateCurrentTime() {
    const now = Date.now();
    currentSpeakingTime = (now - startTime) / 60000; // Convert ms to minutes
    document.getElementById('current-time').innerText = currentSpeakingTime.toFixed(2);
    updateTotalTimes();
}

function updateTotalTimes() {
    const individualTimesDiv = document.getElementById('individual-times');
    individualTimesDiv.innerHTML = ''; // Clear previous entries
    for (const [name, time] of Object.entries(timers)) {
        const totalTime = time + (name === currentTimer ? currentSpeakingTime : 0);
        const timeDisplay = document.createElement('p');
        timeDisplay.innerText = `${name}: ${totalTime.toFixed(2)} minutes`;
        individualTimesDiv.appendChild(timeDisplay);
    }
}

function endSession() {
    if (currentTimer) {
        const endTime = Date.now();
        timers[currentTimer] += (endTime - startTime) / 60000; // Convert ms to minutes
        clearInterval(updateInterval);
    }
    displayResults();
    currentTimer = null; // Ensure no timer is active after ending the session
}

function displayResults() {
    const resultsSection = document.getElementById('results-section');
    resultsSection.innerHTML = '<h2>Results</h2>';
    for (const [name, time] of Object.entries(timers)) {
        const result = document.createElement('p');
        result.innerText = `${name}: ${time.toFixed(2)} minutes, Wortmeldungen: ${counts[name]}`;
        resultsSection.appendChild(result);
    }
}

