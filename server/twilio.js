import twilio from "twilio";

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

export const sendSms = async (to, body) => {
    // return client.messages.create({
    //     body,
    //     from: process.env.TWILIO_PHONE_NUMBER, // your Twilio number
    //     to
    // });


    return true
};
