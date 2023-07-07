function zeroPad(num) {
    return num.toString().padStart(2, '0');
}

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
            str += `${zeroPad(hours)}:`;
            seconds -= (hours * 3600);
        }

        minutes = Math.floor(seconds / 60);
        str += `${zeroPad(minutes)}:`;
        seconds -= (minutes * 60);

        str += `${zeroPad(seconds)}`;
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
