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
    soundChoice.addOption("[None]", "");
    soundChoice.addOption("[Random]", "_random");
    for (let sound in SOUNDS) {
        soundChoice.addOption(SOUNDS[sound], sound);
    }
    
    const designChoice = document.getElementById('design-choice');
    for(let design in DESIGNS){
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

function playSound(player, settings) {
    const soundChoice = settings.get('sound-choice')[0];
    debugger;
    if (soundChoice) {
        if (soundChoice === '_random') {
            const filenames = [...Object.keys(SOUNDS)];
            const num = Math.floor(Math.random() * filenames.length);
            player.play(filenames[num]);
        } else {
            player.play(soundChoice);
        }
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
        timer.reset(settings.get('start-time'));
        playSound(player, settings);
    });

    // set up interactivity
    document.getElementById('active-toggle').addEventListener('click', () => {
        if (timer.active) timer.stop();
        else timer.start();
    });
    document.getElementById('reset').addEventListener('click', () => {
        if (timer.active) timer.stop();
        timer.reset(settings.get('start-time'));
        timer.start();
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
    timer.reset(settings.get('start-time'));
    if (settings.get('auto-start')) {
        timer.start();
    } else {
        document.getElementById('time').innerText = timer.startDuration.toString();
    }
}
