class Analyzer {
    constructor() {
        console.log("Analyzer reset");

        this.userStore = [];
    }

    // handle user message from Sunshine destined for the bot
    async analyze(payload) {
        console.log("To analyze: " + JSON.stringify(payload, null, 2));

        const appUser = payload.appUser._id ;
        let target = this.getUserRecord(appUser).target ;

        //if postback: we get the selection from the user
        if(payload.trigger == "postback"){
            target = payload.postback.action.payload ;
            console.log('Save '+ target + ' for ' + appUser);
            this.setTarget(appUser, target)
        }else{
            //otherwise, if form response: we prepare the message for Tray by adding the metadata target
            console.log("appUser Message, nothing to do here");
        }
        //by default, we let the message go
        await this.continueMessage(payload.nonce, target);
    }

    //Let the message flow
    async continueMessage(nonce, target){
        const https = require('https');
        const data = JSON.stringify({
            "metadata": {
                "target": target
            }
        })
        const options = {
            hostname: 'api.smooch.io',
            path: '/v1.1/apps/'+process.env.APPID+'/middleware/continue',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + nonce
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

    //Sets a target for a specific appUser
    async setTarget(appUser, target) {
        let userRecord = this.getUserRecord(appUser);
        userRecord.target = target ;
    }

    //Returns a record for a specific appUser
    async getUserRecord(appUser) {
        //console.log("Fetching all messages for appUser "+ appUser);
        let userRecord = this.userStore.find(
            function(item){
                return item.appUserId == appUser ;
            })

        if(!userRecord){
            // The user record doesn't exist yet, so we initialize it
            //default target is the BOT
            console.log("Creating userRecord");
            userRecord = {appUserId : appUser, target : process.env.TARGET_BOT};
            this.userStore.push(userRecord);
        }

        return userRecord;
    }
}
module.exports = Analyzer;