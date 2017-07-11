# Two-Factor Authentication with Node.js, Twilio's Authy, and Bluemix

Here you will learn how to create a login system for Express applications secured with 2FA using Authy.

[Learn more about this code in our interactive code walkthrough](https://www.twilio.com/docs/howto/walkthrough/two-factor-authentication/node/express).  The walkthrough is not based on Bluemix, but will help you understand what actions we are taking.

## Quickstart

### Create an Authy app

Create a free [Authy account](https://www.authy.com/developers/) if you don't
have one already, and then connect it to your Twilio account.

### Deploy to IBM's Bluemix

This project is built using the [Express](http://expressjs.com/) web framework, and this branch is made to deploy on IBM's Bluemix.

1. On your phone, using your platform’s Application Store download the Authy Two-Factor application
2. Register your phone with Authy
3. Create an [Authy Developer Account](https://dashboard.authy.com/) and link it to your [Twilio Account](https://www.twilio.com/console)
4. On the command line using the Bluemix CLI Tools, change the API endpoint and login:
```
bluemix api https://api.ng.bluemix.net
bluemix login
```
5. Create a new Bluemix App, naming it ‘Twilio-Authy-Two-Factor’
6. While logged into the Bluemix Console, create a new Compose for MongoDB App
7. After creation, link it to your Authy App
8. In the [Authy Dashboard](https://dashboard.authy.com/), create a new application, and copy the API Key
9. Paste the API Key into the environment variable `AUTHY_API_KEY` back in your Bluemix Authy App
10. Push this branch to Bluemix
11. Visit the site and register
12. In the Authy Dashboard, add the App's URL with `/authy/callback` appended
13. Login to your app and accept the Authy prompt on your phone!

## Meta

* No warranty expressed or implied. Software is as is. Diggity.
* [MIT License](http://www.opensource.org/licenses/mit-license.html)
* Lovingly crafted by Twilio Developer Education.
