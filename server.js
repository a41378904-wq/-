const express = require('express');
const settingsManager = require('./settings_manager.js');
const app = express();
const PORT = 3000;

// Middleware لتفسير البيانات القادمة من النماذج (Forms)
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

// عرض صفحة الإعدادات
app.get('/', (req, res) => {
    const settings = settingsManager.getSettings();
    res.render('index', { settings });
});

// تحديث إعداد معين
app.post('/update', (req, res) => {
    const { key, value } = req.body;
    
    // تحويل القيم بناءً على النوع (Boolean أو Integer)
    let parsedValue = value;
    if (value === 'true') parsedValue = true;
    if (value === 'false') parsedValue = false;
    if (!isNaN(value) && value.trim() !== "") parsedValue = Number(value);

    settingsManager.updateSetting(key, parsedValue);
    res.redirect('/');
});

app.listen(PORT, () => {
    console.log(`🌐 Dashboard server running at http://localhost:${PORT}`);
});
