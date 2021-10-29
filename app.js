const dotenv = require('dotenv');
dotenv.config();

const { App } = require('@slack/bolt');
const axios = require("axios");

const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    socketMode: true, 
    appToken: process.env.SLACK_APP_TOKEN
});

const checkAppointments = () => {
    setInterval(async () => {
        try {
            const { data } = await axios.get(`${process.env.APPOINTMENTS_ENDPOINT}&_=${Date.now()}`);
            const isEmpty = JSON.stringify(data) === '{"empty":"TRUE"}';
            if (!isEmpty) {
                sendMessage("Appointment found! <https://burghquayregistrationoffice.inis.gov.ie/Website/AMSREG/AMSRegWeb.nsf/AppSelect?OpenForm|Click *here* to schedule>");
            }
        } 
        catch (error) {
            console.error(error);
            sendMessage(error);
        }
        
    }, 900000);
};

const startApp = async () => {
    await app.start(process.env.PORT || 3000);
    console.log('⚡️ Bolt app is running!');
    checkAppointments();
};

const sendMessage = async (message) => {
    try {
        const channelId = process.env.SLACK_CHANNEL_ID;
        const result = await app.client.chat.postMessage({
          channel: channelId,
          text: message,
        });
      
        console.log(result);
      }
    catch (error) {
        console.error(error);
    }
};

startApp(); 




