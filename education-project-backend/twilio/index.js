const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const twilio = require('twilio');
require('dotenv').config({ path: '.env.local' });

const app = express();
const client = new twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);


// Middleware setup
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());  // Add JSON body parser
app.use(cors());

const VoiceResponse = twilio.twiml.VoiceResponse;

// Root route
app.post('/', (req, res) => {
  try {
    res.type('xml');
    const twiml = new VoiceResponse();
    twiml.say('Welcome to eduConnect');
    const gather = twiml.gather({
      input: 'dtmf',
      action: '/results',
    });
    gather.say('Press 1 for English or press 2 for Kannada or press 3 for Hindi');
    res.send(twiml.toString());
  } catch (error) {
    console.error('Error in / route:', error);
    res.status(500).send('Server error');
  }
});

// Results route
app.post('/results', async (req, res) => {
    try {
      const userInput = req.body.Digits;
      const userPhone = req.body.From; // This is the caller's phone number
      const twiml = new VoiceResponse();
      let message = '';
  
      switch (userInput) {
        case '1':
          message = "Thanks for choosing English. Karnataka is a vibrant state in southern India known for its rich cultural heritage and historical significance. It has been ruled by powerful dynasties like the Mauryas, Chalukyas, Hoysalas, and the Vijayanagara Empire, who contributed immensely to art, architecture, and literature.";
          twiml.say({ language: 'en-IN', voice: 'Polly.Aditi' }, message);
          break;
  
        case '2':
          message = "Dhanyavada! Karnataka ondhu samruddha samskrutikate mattu itihasadinda koodida rajya. Idu Mauryaru, Chalukyaru, Hoysalara mattu Vijayanagara samrajyada aalavikeyalli idittu. ";
          twiml.say({ language: 'kn-IN', voice: 'Polly.Aditi' }, message);
          break;
  
        case '3':
          message = "Dhanyavaad! Karnataka ek samriddh sanskritik aur aitihasik rajya hai. Yah Maurya, Chalukya, Hoysala aur Vijayanagar samraajyon ke shasan ke antargat tha.";
          twiml.say({ language: 'hi-IN', voice: 'Polly.Aditi' }, message);
          break;
  
        default:
          message = "Invalid choice selected.";
          twiml.say({ language: 'en-IN', voice: 'Polly.Aditi' }, message);
      }
  
      // ✅ Send SMS after the voice message
      if (userPhone) {
        await client.messages.create({
          body: "Thanks for choosing English. Karnataka is a vibrant state in southern India known for its rich cultural heritage and historical significance.",
          from: process.env.TWILIO_PHONE_NUMBER, // your Twilio number
          to: userPhone,
        });
      }
  
      res.type('xml');
      res.send(twiml.toString());
    } catch (error) {
      console.error('Error in /results route:', error);
      res.status(500).send('Server error');
    }
  });
  
// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});