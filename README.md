# sunco-logitech-demo
## How to make it run?
### Prerequisite
1. A Sunshine conversation App
2. A Zendesk instance connected to the Sunshine conversation App
3. A tool to give access to your server

### Installation
After cloning the repo, you need to install the required dependencies:
`npm install`

### Setup
**1. `.env` file**
```
APPID=[Sunshine Conversation APP ID]
KEY=[SC app key]
SECRET=[SC app secret]
TARGET_BOT=BOT
TARGET_ZENDESK=ZENDESK
TARGET_SALESFORCE=SALESFORCE
TARGET_MARKETING=MARKETING
ZENDESK_KEYWORD=[keyword to redirect the conversation to Zendesk]
AGENT_TO_BOT_KEYWORD=[keyword to redirect the conversation to the bot]
SALESFORCE_KEYWORD=[keyword to redirect the conversation to SELL]
MARKETING_KEYWORD=[keyword to redirect the conversation to Marketing]
```

**2. Endpoints**

**- In the code:**
In the /public/workbench.html file 
  - provide your Sunshine conversation App ID in : `const appID = "[your app id]";`
  - in the `function getMessages()`, provide your server address in the fetch: `https://[your URL]/users/'+appUserId+'/messages`

**- On Intercom:**

In the developer hub, in your app webhook section, provide the endpoint to receive Intercom messages: `https://[your URL]/intercom`

**- On Sunshine Conversation:**
  1. Setup a webhook to receive and analyse appMaker messages: `https://[your URL]/agentmessage`
  2. Setup the Pipeline in this order
     - Bot processor: `https://[your URL]/messages`
     - Triage processor: `https://[your URL]/triage`
