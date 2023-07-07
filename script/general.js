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

function setDesign() {
    const overlay = document.getElementById('overlay');
    const designChoice = document.getElementById('design-choice');
    overlay.className = designChoice.value;
}

function playSound() {
    const soundChoice = document.getElementById('sound-choice');
    const audio = new Audio(`sounds/${soundChoice.value}.mp3`);
    audio.play();
}

(() => {
    createDropdowns();
    setDesign();

    const finalMessage = "Zatsu's Cooked!";
    const timer = new Timer();

    const getStartTime = () => {
        return document.getElementById('start-time').value;
    };

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
        timer.reset(getStartTime());
        document.getElementById('time').innerText = finalMessage;
        playSound();
    });

    document.getElementById('active-toggle').addEventListener('click', () => {
        if (timer.active) timer.stop();
        else timer.start();
    });
    document.getElementById('reset').addEventListener('click', () => {
        if (timer.active) timer.stop();
        timer.reset(getStartTime());
        timer.start();
    });
    document.getElementById('design-choice').addEventListener('change', () => {
        setDesign();
    });

    timer.reset(getStartTime());
    timer.start();
})();
