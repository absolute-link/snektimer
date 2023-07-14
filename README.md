# SnekTimer

We present a full-featured "zatsu timer" overlay for OBS, configurable and interactable with multiple style options and sound effect choices!

The timer can be paused, started, and restarted, and changing to a different style, sound, or time to count down from can all be done on the fly.

## OBS Setup

Add a new Browser Capture to your scene in OBS, and fill in the URL (or browse to the local file):

1. Set the width to 450px and height 550px.
1. Recommended: check "Control audio via OBS".
1. Recommended: empty the "Custom CSS".
1. Recommended: check "Shutdown source when not visible" and "Refresh browser when scene becomes available". (if used with "auto-start", you can start the timer simply by toggling the source visibility or switching scenes)
1. Set Page permissions to "No access to OBS"

Right-click on the source, go to Transform > Edit Transform.

1. Set it to crop 375px from the bottom (this will hide the controls from view no matter where you put the timer, but you can still interact).

Setting the "control audio" should give you an audio source in the mixer.

1. Set its "Audio monitoring" to "Monitor and Output" so you can hear and broadcast it.

## How to Use

To change settings, click on the Browser Source and click the "Interact" button under your scene, this will bring up a new window with everything visible only to you.

1. You can change the amount of time it's set for with the "Restart at Time", just enter a new time in the box and click the button. Format it like `00:00`, or if under a minute, just `00`. You can also do more than an hour, but note that some designs won't visually support it.
1. Selecting a new style in "Choose Style" will apply it immediately.
1. Selecting a sound in "Choose Sound" will ready it, and it will play when the timer finishes.
1. Setting "Auto-Start" will make the timer start as soon as the Browser Source is loaded next time. This can be from switching scenes or changing the visibility. If not set to auto-start, you will need to open the Interact panel and hit the Start button.
1. Hitting "Save Settings" will internally store all of the above settings (if not saved, everything will revert to defaults the next time it's loaded). The key here is that you should only need to interact when you actually want to change something, otherwise you can do it once and it's set-and-forget. But if you do want to change settings on the fly, the "Reset Settings" button can load the last-saved settings.

## Advanced Usage

You can set the SnekTimer up with multiple presets by adding it as multiple different Browser Sources in OBS.

1. If you're using it as a URL, you can append `#anytext` (make sure the `#` is there, and then write anything all as one word) to the end of the URL, and this will identify it differently, allowing different presets to be saved.
1. If you're loading from the filesystem, you can't append a `#`, but in that case you can copy and paste `index.html` and rename it to anything else, e.g. `scene1.html` and load that separately to save its settings separately.

## Updates and Modification

Designs, sounds, and voice clips are defined in `config.js` in the root of the directory. While it is a Javascript file, it should be easy to edit.

1. You can add, remove, or modify sounds directly by editing `config.js` and adding, removing, or modifying files in the `sounds` directory.
1. If you're handy with CSS, you can do the same for the designs. Each one in `config.js` points to a single `.css` file in the `style` directory, and you can add, remove, or modify those as well.
1. Protip: for most designs, the words "zatsudan" or "zatsu" and the "Done" or "Done!" displayed at the end are part of the CSS, so you can edit the wording directly as well! You can do this even without CSS knowledge, just look for them in the file.

## CREDIT

- Programming:
    - Absolute Link
    - LoupDuQc
- Administrative Tasks, Finding Artists, Finding/Editing Assets, and Quality Assurance Testing:
    - ChunkyCoone777
    - Meridan
    - Oishizou
    - SuperCondor
- Frame designs commissioned for commercial use by artist [Hoon](https://www.fiverr.com/wekhans2).
- Clock design commissioned for commercial use by artist [VTuber Graphics](https://www.fiverr.com/vtuber_graphics).

## LICENSE

This project is under the very permissive MIT License, which freely allows commercial use, distribution, and modification. See `LICENSE.md` for the full text.

## THIRD PARTY LICENSING

### Sounds

- All included sound effects are free for use including in commercial applications, from [Pixabay](https://pixabay.com/). See "Content License" on the page for the [Harp](https://pixabay.com/sound-effects/harp-flourish-6251/) sound effect as a summary example, or view the full [Pixabay License](https://pixabay.com/service/terms/).

- All included voice clips are short audio segments from public PRISM Project streams on Youtube.

### Fonts

- All included fonts are free for commercial use, licensed under SIL Open Font License (OFL), see `fonts/OFL.txt`.
