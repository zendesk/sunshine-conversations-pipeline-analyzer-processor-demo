# sunco-pipeline-analyzer-processor-demo
## How to make it run?
### Prerequisite
1. A Sunshine conversation App
2. A Zendesk instance connected to the Sunshine conversation App
3. A tool to give access to your server (ngrok)

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
```

**2. Endpoints**

**- In the code: (if you need a demo frontpage)**
In the /public/workbench.html file 
  - provide your Sunshine conversation App ID in : `const appID = "[your app id]";`
  - in the `function getMessages()`, provide your server address in the fetch: `https://[your URL]/users/'+appUserId+'/messages`

**- On Sunshine Conversation:**
  1. Setup the Pipeline in this order
     - Analyzer processor: `https://[your URL]/analysis`
     - Response bot: `response bot`
     - Tray: `your Tray endpoint`
