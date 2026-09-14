# Focus Flow Pomodoro Timer

A minimalist Chrome extension that combines a Pomodoro timer with website blocking to help you stay focused and productive.

## Features
- 🍅 **Customizable Pomodoro timer** (defaults to 25 minutes) with visual countdown
- ⏳ **Quick +/- interval buttons** on the sides of the timer in stopped state (5-minute increments)
- ⚙️ **Default duration setting** at the top of the Settings/Options page
- 🚫 **Dynamic website blocking** during focus sessions (redirects blocked sites)
- ⚙️ **Auto-saving blocklist** - instantly saves changes without manual save buttons
- 🎨 **Clean dark theme UI** with responsive design
- 🔄 **Single button control** - toggle between start/stop states
- ⏸️ **Pause / Resume & Reset controls** for flexible session management
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
2. The timer will show 25:00 by default (or your custom default timer)
3. In its stopped state, use the **−** and **+** buttons on the sides of the timer to adjust focus time in 5-minute increments (minimum 5 minutes)
4. Click **"Start Session"** to begin focusing
5. During focus mode, any sites in your blocklist will redirect to a blocked page

### Customizing the Default Timer
1. Click the ⚙️ gear icon in the popup to open Settings
2. At the top of Settings under **Default Timer**, enter your preferred default duration in minutes (defaults to 25)
3. Click "Save", press Enter, or blur the field - your default duration is saved and applies to new sessions

### Managing Blocked Sites
1. Click the ⚙️ gear icon next to "Focus Pomodoro" in the popup
2. Enter website domains (e.g., `twitter.com`, `youtube.com`, `reddit.com`)
3. Press Enter or click "Add" - sites are **auto-saved** immediately
4. Click "Remove" next to any site to delete it from your blocklist
5. Changes are automatically saved with visual feedback (✓ Saved indicator)

### Controlling an Active Session
- Click **"Pause"** to pause the countdown and temporarily unblock or take a break
- Click **"Resume"** to continue focusing
- Click **"Reset"** to cancel the session and restore the default timer
- The timer automatically finishes when the time runs out and clears block rules

## Technical Details
- Built with vanilla JavaScript, HTML, and CSS
- Uses Chrome's `declarativeNetRequest` API for efficient site blocking
- Implements `chrome.storage.local` for persistent settings
- Auto-save with debouncing to prevent excessive writes
- Clean URL parsing that normalizes different input formats

## Future Improvements
- Sound notifications
- Add a button to block the current site
- Breaks & study intervals (automatically adds breaks between study sessions)
- Skip current session button

## Credits
Created by [rihix](https://github.com/r1hix) as a productivity tool for developers and students.
- Version: `1.1.3`
- License: `MIT`
