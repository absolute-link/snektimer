class Duration {
    constructor(value) {
        if (typeof value === 'string') {
            this.seconds = this.fromString(value);
        } else if (typeof value === 'number') {
            this.seconds = value;
        }
    }

    fromString(str) {
        const parts = str.split(':');
        let seconds = 0;
        let multiplier = 1;
        while (parts.length) {
            seconds += (parseInt(parts.pop()) || 0) * multiplier;
            multiplier = multiplier * 60;
        }
        return seconds;
    }

    toString() {
        let str = '';
        let seconds = this.seconds;
        let minutes = 0;
        let hours = 0;
        if (seconds >= 3600) {
            hours = Math.floor(seconds / 3600);
            str += `${hours.toString().padStart(2, '0')}:`;
            seconds -= (hours * 3600);
        }
        if (hours > 0 || seconds >= 60) {
            minutes = Math.floor(seconds / 60);
            str += `${minutes.toString().padStart(2, '0')}:`;
            seconds -= (minutes * 60);
        }
        str += `${seconds.toString().padStart(2, '0')}`;
        return str;
    }
}

class Timer {
    active = false;
    startDate = null;
    startDuration = null;
    remainingDuration = null;
    intervalId = null;
    events = {};

    on(evtName, callback) {
        this.events[evtName] = callback;
    }

    start() {
        this.startDate = new Date();
        this.active = true;
        if (this.events.start) this.events.start();

        setTimeout(() => {
            this.iteration();
            this.intervalId = setInterval(() => {
                this.iteration();
            }, 1000);
        }, 250);
    }

    iteration() {
        const diff = Math.floor((new Date() - this.startDate) / 1000);
        this.remainingDuration = new Duration(this.startDuration.seconds - diff);
        if (Math.floor(this.remainingDuration.seconds) > 0) {
            if (this.events.update) this.events.update();
        } else {
            this.stop();
            if (this.events.complete) this.events.complete();
        }
    }

    stop() {
        if (this.intervalId) clearInterval(this.intervalId);
        this.active = false;
        this.startDuration = this.remainingDuration;
        if (this.events.stop) this.events.stop();
    }

    reset(startVal) {
        this.startDuration = new Duration(startVal);
        if (this.events.reset) this.events.reset();
    }
}

(() => {
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

    timer.reset(getStartTime());
    timer.start();
})();
