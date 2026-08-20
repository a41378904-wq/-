const express = require('express');
const session = require('express-session');
const passport = require('passport');
const { Strategy } = require('passport-discord');
const settingsManager = require('./settings_manager.js');
const app = express();

const PORT = process.env.PORT || 3000;

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

passport.use(new Strategy({
    clientID: process.env.DISCORD_CLIENT_ID,
    clientSecret: process.env.DISCORD_CLIENT_SECRET,
    callbackURL: process.env.DISCORD_CALLBACK_URL,
    scope: ['identify', 'guilds']
}, (accessToken, refreshToken, profile, done) => {
    process.nextTick(() => done(null, profile));
}));

app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.use(session({
    secret: 'some_secret_key',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
    const settings = settingsManager.getSettings();
    res.render('index', { 
        settings, 
        user: req.user || null 
    });
});

app.get('/auth/discord', passport.authenticate('discord'));

app.get('/auth/discord/callback', passport.authenticate('discord', {
    failureRedirect: '/'
}), (req, res) => {
    res.redirect('/');
});

app.get('/logout', (req, res) => {
    req.logout(() => {
        res.redirect('/');
    });
});

app.post('/update', (req, res) => {
    if (!req.isAuthenticated()) return res.redirect('/');

    try {
        const settings = settingsManager.getSettings();
        
        // تحديث القيم مع التأكد من تحويل الأنواع
        settings.prefix = req.body.prefix;
        settings.welcome_message = req.body.welcome_message;
        settings.auto_mod_enabled = (req.body.auto_mod_enabled === 'true');

        // التعامل مع الكائن المتداخل (Nested Object) بأمان
        if (!settings.status) settings.status = { text: "" };
        settings.status.text = req.body.status_text;

        // حفظ الإعدادات
        settingsManager.saveSettings(settings);
        
        // هذا السطر سيطبع لك في الـ Logs في Railway للتأكد
        console.log('✅ تم تحديث الإعدادات بنجاح:', JSON.stringify(settings));
        
        res.redirect('/');
    } catch (error) {
        console.error('❌ فشل تحديث الإعدادات:', error);
        res.status(500).send('حدث خطأ أثناء الحفظ. راجع الـ Logs.');
    }
});

app.listen(PORT, () => {
    console.log(`🌐 Dashboard server running on port ${PORT}`);
});
