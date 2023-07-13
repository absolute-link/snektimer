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
    const designChoice = document.getElementById('design-choice');
    const soundChoice = document.getElementById('sound-choice');

    for (const [val, text] of Object.entries(DESIGNS)) {
        const opt = document.createElement('option');
        opt.value = val;
        opt.innerText = text;
        designChoice.appendChild(opt);
    }

    for (const [val, text] of Object.entries(SOUNDS)) {
        const opt = document.createElement('option');
        opt.value = val;
        opt.innerText = text;
        soundChoice.appendChild(opt);
    }
    
    const designChoice2 = document.getElementById('design-choice2');
    for(let design in DESIGNS){
        designChoice2.addOption(DESIGNS[design], design);
    }
}

function updateDesign(settings) {
    // document.body.className = settings.get('design-choice2');
    const choice = settings.get('design-choice2');
    // const choice = settings.get('design-choice');
    for (const designName of Object.keys(DESIGNS)) {
        const setMedia = (designName === choice) ? 'all' : 'none';
        document.getElementById(designName).media = setMedia;
    }
}

function playSound(player, settings) {
    const soundChoice = settings.get('sound-choice');
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
    document.getElementById('design-choice').addEventListener('change', () => {
        updateDesign(settings);
    });
    document.getElementById('design-choice2').onSelect = () => {
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
