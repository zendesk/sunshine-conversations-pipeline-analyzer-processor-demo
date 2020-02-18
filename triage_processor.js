const stripHtml = require("string-strip-html");
const Storage = require('./storage');
const Smooch = require('smooch-core');

class TriageProcessor {
    constructor() {
        console.log("TRIAGE reset");

        this.storage = new Storage({});

        this.smooch = new Smooch({
            keyId: process.env.KEY,
            secret: process.env.SECRET,
            scope: 'app'
        });
    }

    // handle user message from Sunshine destined for the bot
    async dispatch(payload) {
        let target = payload.message.metadata.target;
        console.log('Dispatching to:'+ target);

        switch(target) {
            case process.env.TARGET_ZENDESK:
                console.log('Sending to Zendesk');
                await this.sendToZendesk(payload)
                break;
            case process.env.TARGET_SALESFORCE:
                console.log('Sending to Salesforce');
                await this.sendToSalesforce(payload)
                break;
            case process.env.TARGET_MARKETING:
                console.log('Sending to Marketing');
                await this.sendToMarketing(payload)
                break;
            default:
                return;
        }
    }

    //Send to Zendesk
    async sendToZendesk(payload){
        //Check if we should the send the conversation history to Intercom
        const history = payload.message.metadata.history;
        let context = '';
        if(history){
            const appUserId = payload.appUser._id;
            //Determine from when we need the history (1mn history for demo purposes)
            let since = Math.round((new Date()).getTime() / 1000)-60000;
            //Get the conversation from Sunshine conversation and push an initial message to ZD
            if (this.smooch) {
                this.smooch.appUsers
                .getMessages(appUserId,{
                    query: {
                        after: since
                    }
                })
                .then((response) => {
                    console.log(response);
                    console.log('Sending history to Zendesk');
                    
                    context = response.messages.map(message => message.name + "   :   " + message.text).join('\n');
                    
                    const text = payload.message.text + "\n\n" + process.env.CONTEXT_KEYWORD + "\n\n" + context ;
                    console.log('Will send : '+ text);
                    console.log('As : '+ appUserId);

                    if (this.smooch && appUserId && text) {
                        this.smooch.appUsers
                        .sendMessage(appUserId,{
                            text: text,
                            role: 'appUser',
                            type: 'text'
                        })
                        .then((response) => {
                            console.log(response);
                        })
                        .catch((err) => {
                            console.log('API ERROR:\n', err);
                        });
                    }
                })
                .catch((err) => {
                    console.log('API ERROR:\n', err);
                })
            }
        }else{
            //let the message continue
            const https = require('https');
            const data = JSON.stringify({        })
            const options = {
                hostname: 'api.smooch.io',
                path: '/v1.1/apps/'+process.env.APPID+'/middleware/continue',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + payload.nonce
                }
            }
            const req = https.request(options, (res) => {
                    console.log(`statusCode: ${res.statusCode}`)
            })
            req.on('error', (error) => {
                console.error(error)
            })
            req.write(data);
            req.end();
        }
    }
    //Send to Salesforce
    async sendToSalesforce(payload){
        console.log('sendToSalesforce');
        //let the message continue
        const https = require('https');
        const data = JSON.stringify(payload);
        const options = {
            host: 'b852d4c5-2306-4463-8fa8-3a29da8a7df0.trayapp.io',
            //host: 'alexissmooch.ngrok.io',
            //path: '/SF',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        };
        const req = https.request(options, (res) => {
            console.log(`statusCode: ${res.statusCode}`)
        });
        req.on('error', (error) => {
            console.error(error)
        });
        req.write(data);
        req.end();
    }
    //Send to Marketing
    async sendToMarketing(payload){
        console.log('sendToMarketing');
        //let the message continue
        const https = require('https');
        const data = JSON.stringify(payload);
        const options = {
            host: 'b852d4c5-2306-4463-8fa8-3a29da8a7df0.trayapp.io',
            //host: 'alexissmooch.ngrok.io',
            //path: '/SF',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        };
        const req = https.request(options, (res) => {
            console.log(`statusCode: ${res.statusCode}`)
        });
        req.on('error', (error) => {
            console.error(error)
        });
        req.write(data);
        req.end();
        
    }
}
module.exports = TriageProcessor;