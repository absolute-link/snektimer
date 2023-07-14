function loadDesigns() {
    for (const designName of Object.keys(DESIGNS)) {
        const tag = document.createElement('link');
        tag.id = designName;
        tag.rel = 'stylesheet';
        tag.media = 'none';
        tag.href = `style/${designName}.css`;
        document.head.appendChild(tag);
    }
}

function createDropdowns() {
    const soundChoice = document.getElementById('sound-choice');
    soundChoice.addOption('[None]', '');
    soundChoice.addOption('[Random: Sound Effect]', '_random_sound');
    soundChoice.addOption('[Random: Voice Clip]', '_random_voice');
    soundChoice.addOption('[Random: Any]', '_random_any');

    for (let sound in SOUNDS) {
        soundChoice.addOption(SOUNDS[sound], sound);
    }
    for (let voice in VOICES) {
        soundChoice.addOption(VOICES[voice], voice);
    }

    const designChoice = document.getElementById('design-choice');
    for (let design in DESIGNS){
        designChoice.addOption(DESIGNS[design], design);
    }
}

function updateDesign(settings) {
    const choice = settings.get('design-choice')[0];
    for (const designName of Object.keys(DESIGNS)) {
        const setMedia = (designName === choice) ? 'all' : 'none';
        document.getElementById(designName).media = setMedia;
    }
}

function chooseRandomFilename(configSection) {
    const filenames = [...Object.keys(configSection)];
    const num = Math.floor(Math.random() * filenames.length);
    return filenames[num];
}

function playSound(player, settings) {
    const soundChoice = settings.get('sound-choice')[0];
    if (soundChoice) {
        if (soundChoice === '_random_sound') player.play(chooseRandomFilename(SOUNDS));
        else if (soundChoice === '_random_voice') player.play(chooseRandomFilename(VOICES));
        else if (soundChoice === '_random_any') player.play(chooseRandomFilename({...SOUNDS, ...VOICES}));
        else player.play(soundChoice);
    }
}

function startTimeValid(startTime) {
    return (startTime.match(/^[0-9 :-]+$/));
}

function setStartTimeError(showError) {
    const errorSpan = document.getElementById('error');
    if (showError) {
        errorSpan.className = 'error';
        errorSpan.innerText = 'Please format like 00:00';
    } else {
        errorSpan.className = 'ok';
        errorSpan.innerText = '';
    }
}

function handleRestartAttempt(timer, settings) {
    const startTime = settings.get('start-time');
    if (startTimeValid(startTime)) {
        setStartTimeError(false);
        timer.reset(startTime);
        timer.start();
    } else {
        setStartTimeError(true);
    }
}

function init() {
    createDropdowns();

    const settings = new Settings(window.location.hash);
    updateDesign(settings);

    const player = new SoundPlayer();

    // set up timer and events
    const timer = new Timer();
    timer.on('start', () => {
        document.getElementById('overlay').className = 'active';
        document.getElementById('active-toggle').innerText = 'Pause';
    });
    timer.on('stop', () => {
        document.getElementById('overlay').className = 'stopped';
        document.getElementById('active-toggle').innerText = 'Resume';
    });
    timer.on('update', () => {
        document.getElementById('time').innerText = timer.remainingDuration.toString();
    });
    timer.on('complete', () => {
        document.getElementById('time').innerText = timer.remainingDuration.toString();
        document.getElementById('overlay').className = 'complete';
        document.getElementById('active-toggle').innerText = 'Restart';
        playSound(player, settings);
    });

    // set up interactivity
    document.getElementById('active-toggle').addEventListener('click', () => {
        if (timer.active) timer.stop();
        else if (!timer.hasRemainingTime()) handleRestartAttempt(timer, settings);
        else timer.start();
    });
    document.getElementById('reset').addEventListener('click', () => {
        if (timer.active) timer.stop();
        handleRestartAttempt(timer, settings);
    });
    document.getElementById('design-choice').onSelect = () => {
        updateDesign(settings);
    }
    document.getElementById('reset-settings').addEventListener('click', () => {
        settings.loadFromStorage();
        updateDesign(settings);
    });
    document.getElementById('save-settings').addEventListener('click', () => {
        settings.saveToStorage();
    });

    // start timer or show start time
    let startTime = settings.get('start-time');
    if (!startTimeValid(startTime)) {
        startTime = settings.items['start-time'].defaultVal;
        settings.set('start-time', startTime);
    }
    timer.reset(startTime);
    if (settings.get('auto-start')) {
        timer.start();
    } else {
        document.getElementById('time').innerText = timer.startDuration.toString();
    }
}
