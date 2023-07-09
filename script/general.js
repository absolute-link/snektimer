const DESIGNS = {
    frame: 'Zatsu Frame',
    clock: 'Digital Clock',
    plain: 'Plain Numbers'
};

const SOUNDS = {
    'harp-glissando-descending-short-103886': 'Harp',
    'a-bomb-139689': 'A Bomb',
    'alarm-110066': 'Siren',
    'alarm-car-or-home-62554': 'Car Alarm',
    'alarm-clock-loop-90916': 'Alarm Clock (Buzz)',
    'alarm-clock-short-6402': 'Alarm Clock (Beep)',
    'hq-explosion-6288': 'Explosion',
    'microwave-finished-82491': 'Microwave',
    'rattlesnake-32718': 'Rattlesnake',
    'sitar-01-91623': 'Sitar'
};

function createDropdowns() {
    const designChoice = document.getElementById('design-choice');
    const soundChoice = document.getElementById('sound-choice');

    for ([val, text] of Object.entries(DESIGNS)) {
        const opt = document.createElement('option');
        opt.value = val;
        opt.innerText = text;
        designChoice.appendChild(opt);
    }

    for ([val, text] of Object.entries(SOUNDS)) {
        const opt = document.createElement('option');
        opt.value = val;
        opt.innerText = text;
        soundChoice.appendChild(opt);
    }
}

function updateDesign(settings) {
    const overlay = document.getElementById('overlay');
    overlay.className = settings.get('design-choice');
}

function playSound(settings) {
    const soundKey = settings.get('sound-choice');
    const audio = new Audio(`sounds/${soundKey}.mp3`);
    audio.play();
}

(() => {
    createDropdowns();

    const settings = new Settings(window.location.hash);
    updateDesign(settings);

    const finalMessage = "Done!";
    const timer = new Timer();

    timer.on('start', () => {
        document.getElementById('active-toggle').innerText = 'Pause';
    });
    timer.on('stop', () => {
        document.getElementById('active-toggle').innerText = 'Resume';
    });
    timer.on('update', () => {
        document.getElementById('time').innerText = timer.remainingDuration.toString();
    });
    timer.on('complete', () => {
        timer.reset(settings.get('start-time'));
        document.getElementById('time').innerText = finalMessage;
        document.getElementById('active-toggle').innerText = 'Restart';
        playSound(settings);
    });

    // TODO: for styles, try making each style a separate CSS file, and have the "DONE" text as a :before content: 'DONE' so that literally everything is style
    // TODO: frame, clock, scroll (light), scroll (dark), plain text (light), plain text (dark)

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
    document.getElementById('reset-settings').addEventListener('click', () => {
        settings.loadFromStorage();
        updateDesign(settings);
    });
    document.getElementById('save-settings').addEventListener('click', () => {
        settings.saveToStorage();
    });

    timer.reset(settings.get('start-time'));
    if (settings.get('auto-start')) {
        timer.start();
    }
})();
