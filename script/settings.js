class SettingsItem {
    element = null;
    defaultVal = null;

    constructor(defaultVal) {
        if (typeof defaultVal !== 'undefined') this.defaultVal = defaultVal;
    }
}

class Settings {
    storagePfx = 'default';
    items = {
        'start-time': new SettingsItem('30:00'),
        'design-choice': new SettingsItem('scroll-light'),
        'sound-choice': new SettingsItem('harp-glissando-descending-short-103886.mp3'),
        'auto-start': new SettingsItem(true)
    };

    constructor(storagePfx) {
        if (storagePfx) this.storagePfx = storagePfx;
        this.loadFromStorage();
    }

    makeStorageKey(id) {
        return `snektimer:${this.storagePfx}:${id}`;
    }

    loadFromStorage() {
        for (const [id, item] of Object.entries(this.items)) {
            item.element = document.getElementById(id);

            const storageKey = this.makeStorageKey(id);
            const storedVal = window.localStorage.getItem(storageKey);

            if (storedVal !== null) this.set(id, storedVal);
            else if (item.defaultVal !== null) this.set(id, item.defaultVal);
        }
    }

    get(id) {
        const item = this.items[id];
        if (!item?.element) return null;

        return (item.element.type === 'checkbox') ? item.element.checked : item.element.value;
    }

    set(id, val) {
        const item = this.items[id];
        if (!item?.element) return;

        if (item.element.type === 'checkbox') item.element.checked = !!val;
        else item.element.value = val;
    }

    saveToStorage() {
        for (const id of Object.keys(this.items)) {
            const storageKey = this.makeStorageKey(id);
            const val = this.get(id);

            if (typeof val === 'boolean') window.localStorage.setItem(storageKey, (val) ? 'true' : '');
            else window.localStorage.setItem(storageKey, val);
        }
    }
}
