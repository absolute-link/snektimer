class SoundPlayer {
    currentAudio = null;

    play(filename) {
        if (this.currentAudio instanceof HTMLAudioElement) {
            this.currentAudio.pause();
            this.currentAudio.removeAttribute('src');
            this.currentAudio.load();
        }
        this.currentAudio = new Audio(`sounds/${filename}`);
        this.currentAudio.play();
    }
}
