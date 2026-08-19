const { Client, GatewayIntentBits, ActivityType } = require('discord.js');
const { getSettings } = require('./settings_manager.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// تحديث حالة البوت بناءً على الإعدادات
function updateBotStatus(client) {
    const settings = getSettings();
    const statusType = settings.status?.type || 'WATCHING';
    
    client.user.setActivity(settings.status?.text || 'the Dashboard', {
        type: ActivityType[statusType.toUpperCase()] || ActivityType.Watching
    });
}

client.once('ready', () => {
    console.log(`✅ [ONLINE] ${client.user.tag}`);
    updateBotStatus(client);
    console.log('🚀 البوت جاهز للعمل!');
});

// تحديث الحالة كل 5 دقائق (احتياطاً)
setInterval(() => {
    updateBotStatus(client);
}, 300000);

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    const settings = getSettings();
    const prefix = settings.prefix || '!';

    // مثال بسيط: أمر البريفكس
    if (message.content.startsWith(`${prefix}ping`)) {
        message.reply('🏓 Pong!');
    }

    // مثال بسيط: أمر الترحيب
    if (message.content.startsWith(`${prefix}hello`)) {
        message.reply(settings.welcome_message || 'Hello!');
    }
});

// ضع التوكن الخاص بك هنا
client.login('MTUzNjA5Njc1ODUzMzMzMjk5Mg.GtpxQ9.jd8FeGR6Itb-fSpgSUBqn0GQCQmCvoeBGbbGLY');
