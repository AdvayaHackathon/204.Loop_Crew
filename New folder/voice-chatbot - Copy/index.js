const express = require('express');
const bodyParser = require('body-parser');
const twilio = require('twilio');
const axios = require('axios');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));

// Twilio credentials
const accountSid = 'YOUR_TWILIO_ACCOUNT_SID';
const authToken = 'YOUR_TWILIO_AUTH_TOKEN';
const client = twilio(accountSid, authToken);

// Endpoint to handle incoming calls
app.post('/voice', async (req, res) => {
    const twiml = new twilio.twiml.VoiceResponse();

    // Get the user's speech input
    const userInput = req.body.SpeechResult;

    // Call OpenAI API for response
    try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: userInput }],
        }, {
            headers: {
                'Authorization': `Bearer YOUR_OPENAI_API_KEY`,
                'Content-Type': 'application/json',
            },
        });

        const aiResponse = response.data.choices[0].message.content;

        // Respond with AI's answer
        twiml.say(aiResponse);
    } catch (error) {
        console.error('Error fetching AI response:', error);
        twiml.say('Sorry, I could not process your request at this time.');
    }

    res.type('text/xml');
    res.send(twiml.toString());
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});