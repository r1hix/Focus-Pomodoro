# Focus Flow Pomodoro Timer

A minimalist Chrome extension that combines a Pomodoro timer with website blocking to help you stay focused and productive.

## Features
- 🍅 **25-minute Pomodoro timer** with visual countdown
- 🚫 **Dynamic website blocking** during focus sessions (redirects blocked sites)
- ⚙️ **Auto-saving blocklist** - instantly saves changes without manual save buttons
- 🎨 **Clean dark theme UI** with responsive design
- 🔄 **Single button control** - toggle between start/stop states
- ⌨️ **Enter key support** for quick site additions
- 🧠 **Smart URL parsing** - handles https://, http://, www., and paths automatically

## Installation
1. Download or clone this repository
2. Open your browser and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top-right corner
4. Click "Load unpacked" and select the extension folder

## How to Use

### Starting a Focus Session
1. Click the extension icon in your browser toolbar
2. The timer will show 25:00 by default
3. Click **"Start Session"** to begin focusing
4. During focus mode, any sites in your blocklist will redirect to a blocked page

### Managing Blocked Sites
1. Click the ⚙️ gear icon next to "Focus Flow" in the popup
2. Enter website domains (e.g., `twitter.com`, `youtube.com`, `reddit.com`)
3. Press Enter or click "Add" - sites are **auto-saved** immediately
4. Click "Remove" next to any site to delete it from your blocklist
5. Changes are automatically saved with visual feedback (✓ Saved indicator)

### Stopping a Session
- Click **"Stop Session"** (button changes text when active)
- Timer automatically stops after 25 minutes and clears block rules

## Technical Details
- Built with vanilla JavaScript, HTML, and CSS
- Uses Chrome's `declarativeNetRequest` API for efficient site blocking
- Implements `chrome.storage.local` for persistent settings
- Auto-save with debouncing to prevent excessive writes
- Clean URL parsing that normalizes different input formats

## Future Improvements
- Customizable timer durations
- Sound notifications
- Pause/Resume functionality

## Credits
Created by [rihix](https://github.com/r1hix) as a productivity tool for developers and students.
- Version: `1.1.1`
- License: `MIT`
