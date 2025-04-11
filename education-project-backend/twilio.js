const express = require('express');
const { VoiceResponse } = require('twilio').twiml;
const db = require('./db/progress'); // Your progress functions

const app = express();
const port = process.env.PORT2;
app.use(express.urlencoded({ extended: false }));

app.post('/call-status', async (req, res) => {
    const caller = req.body.From;
    const duration = parseInt(req.body.CallDuration, 10);

    const student = await db.getStudentByPhone(caller);
    if (student) {
        await db.updateProgress(student.id, student.class_id, duration);
    }

    res.sendStatus(204);
});

app.post('/handle-call', async (req, res) => {
    const caller = req.body.From;
    const student = await db.getStudentByPhone(caller);
    if (!student) {
        const twiml = new VoiceResponse();
        twiml.say('You are not registered in our system.');
        return res.type('text/xml').send(twiml.toString());
    }

    const progress = await db.getProgress(student.id, student.class_id);
    const classInfo = await db.getClassById(student.class_id);
    const audioUrl = classInfo.audio_url;
    const startTime = progress?.last_played_seconds || 0;

    const twiml = new VoiceResponse();
    
    twiml.play({
    loop: 1,
    // 👇 This tells Twilio where to send status updates after call ends
    statusCallback: 'https://your-server.com/call-status',
    statusCallbackEvent: ['completed'],
    statusCallbackMethod: 'POST'
    }, `${audioUrl}#t=${startTime}`);

        res.type('text/xml').send(twiml.toString());
    })
app.listen(port, () => {
    console.log(`🚀 Server running at http://localhost:${port}`);
  });