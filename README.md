# Two-Factor Authentication with Node.js, Twilio Account Security, and Bluemix

Here you will learn how to create a login system for Express applications secured with Two-Factor Authentication using Twilio Account Security.

[Learn more about this code in our interactive code walkthrough](https://www.twilio.com/docs/howto/walkthrough/two-factor-authentication/node/express).  The walkthrough is not based on Bluemix, but will help you understand what actions we are taking.

## Quickstart

### Create an Authy app

Create a free [Authy account](https://www.authy.com/developers/) if you don't
have one already, and then connect it to your Twilio account.

### Deploy to IBM's Bluemix

This project is built using the [Express](http://expressjs.com/) web framework, and this branch is made to deploy on IBM's Bluemix.

1. On your phone, using your platform’s Application Store download the Authy Two-Factor application
2. Register your phone with Authy
3. On the command line using the Bluemix CLI Tools, change the API endpoint and login:
```
bluemix api https://api.ng.bluemix.net
bluemix login
```
4. Create a new Bluemix App, naming it ‘Twilio-Authy-Two-Factor’
5. While logged into the Bluemix Console, create a new Compose for MongoDB App
6. After creation, link it to your Authy App
7. Create a new Application in the [Authy Dashboard](https://www.twilio.com/console/authy/)
8. In the Catalog, search for 'Twilio Two-Factor Authentication' to create a new integration.
9. From the console, enter your `Twilio Account Sid` and `Secret Key`.  Enter a SMS capable `Phone Number` from the [Phone Number](https://www.twilio.com/console/phone-numbers) section of the console.  Enter the `Authy App API Key` from the above step.  Finally, enter any `Secret Key` which will be used to hash your cookies.
10. Clone this repository locally with:
`git clone -b bluemix-quickstart https://github.com/TwilioDevEd/account-security-2fa-node.git`.
11. Run `npm install` locally.
10. Push this branch to Bluemix with `bluemix app push APPNAME`.
11. In the Account Security Dashboard, add the App's URL with `/authy/callback` appended
12. Visit the site and register
13. Login to your app and accept the Authy prompt on your phone!

## Meta

* No warranty expressed or implied. Software is as is. Diggity.
* [MIT License](http://www.opensource.org/licenses/mit-license.html)
* Lovingly crafted by Twilio Developer Education.
