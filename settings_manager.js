const fs = require('fs');
const SETTINGS_FILE = './settings.json';

function getSettings() {
    try {
        const data = fs.readFileSync(SETTINGS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error("❌ Error reading settings.json:", error);
        return {};
    }
}

function saveSettings(newSettings) {
    try {
        fs.writeFileSync(SETTINGS_FILE, JSON.stringify(newSettings, null, 4));
        return true;
    } catch (error) {
        console.error("❌ Error saving settings.json:", error);
        return false;
    }
}

function updateSetting(key, value) {
    const settings = getSettings();
    settings[key] = value;
    return saveSettings(settings);
}

module.exports = {
    getSettings,
    saveSettings,
    updateSetting
};
