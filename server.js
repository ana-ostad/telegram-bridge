const express = require('express');
const TelegramBot = require('node-telegram-bot-api');

const app = express();

// إعدادات البوت - سنضيفها لاحقاً
const BOT_TOKEN = process.env.BOT_TOKEN || '8437159198:AAG0I2uSL4S1848s4AEJqROkIPWCAearsGs';
const CHANNEL_ID = process.env.CHANNEL_ID || '-1003226579407';

// تخزين الدروس في الذاكرة
let lessons = [];

// إنشاء البوت
const bot = new TelegramBot(BOT_TOKEN, { polling: true });

// استقبال الرسائل من القناة
bot.on('channel_post', (msg) => {
    if (msg.text) {
        const newLesson = {
            id: msg.message_id,
            title: msg.text.split('\n')[0] || 'درس جديد',
            content: msg.text,
            date: new Date().toLocaleString('ar-SA')
        };
        
        lessons.unshift(newLesson);
        console.log('✅ درس جديد:', newLesson.title);
        
        // حفظ فقط آخر 50 درس
        if (lessons.length > 50) {
            lessons = lessons.slice(0, 50);
        }
    }
});

// واجهة API
app.get('/api/lessons', (req, res) => {
    res.json({
        success: true,
        count: lessons.length,
        lessons: lessons
    });
});

app.get('/', (req, res) => {
    res.send(`
        <html dir="rtl">
        <head><title>سيرفر الدروس</title></head>
        <body>
            <h1>✅ السيرفر يعمل!</h1>
            <p>عدد الدروس: ${lessons.length}</p>
            <p>استخدم <code>/api/lessons</code> لجلب الدروس</p>
        </body>
        </html>
    `);
});

// تشغيل السيرفر
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('🚀 السيرفر يعمل على port ' + PORT);
});
