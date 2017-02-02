# Two-Factor Authentication with Node.js and Authy

Here you will learn how to create a login system for Express applications secured with 2FA using Authy.

[Learn more about this code in our interactive code walkthrough](https://www.twilio.com/docs/howto/walkthrough/two-factor-authentication/node/express).

## Quickstart

### Create an Authy app

Create a free [Authy account](https://www.authy.com/developers/) if you don't
have one already, and then connect it to your Twilio account.

### Local development

This project is built using the [Express](http://expressjs.com/) web framework.

1. First clone this repository and `cd` into it.

   ```bash
   $ git clone git@github.com:TwilioDevEd/authy2fa-node.git
   $ cd authy2fa-node
   ```

1. Install the dependencies.

   ```bash
   $ npm install
   ```

1. Make sure you have installed [MongoDB](https://www.mongodb.org/). _If on a Mac, you can use this [guide](https://docs.mongodb.org/manual/tutorial/install-mongodb-on-os-x/) to install it._

1. Export the environment variables.

   You can find your **Authy Api Key** for Production at https://dashboard.authy.com/. The default MongoDB URL when running MongoDB locally is shown below.

   ```bash
   $ export AUTHY_API_KEY=Your Authy API Key
   $ export MONGO_URL=mongodb://127.0.0.1:27017
   ```

1. Run the server.

   ```bash
   $ node .
   ```

   Alternatively you might also consider using [nodemon](https://github.com/remy/nodemon) for this.
   It works just like the node command, but automatically restarts your application when you change
   any source code files.

   ```
   $ npm install -g nodemon
   $ nodemon .
   ```

1. Expose your application to the wider internet using [ngrok](http://ngrok.com). You can click
  [here](https://www.twilio.com/blog/2015/09/6-awesome-reasons-to-use-ngrok-when-testing-webhooks.html) for more details. This step
  is important because the application won't work as expected if you run it through localhost.

  ```bash
  $ ngrok http 3000
  ```

  Once ngrok is running, open up your browser and go to your ngrok URL.
  It will look something like this: `http://9a159ccf.ngrok.io`

1. Go to your https://dashboard.authy.com. On the menu to the right you'll find the
   **Settings**. Go to **OneTouch settings** and update the _Endpoint/URL_ with the
   endpoint you created. Something like this:

   `http://[your-ngrok-subdomain].ngrok.io/authy/callback`

   If you deployed this application to _Heroku_, the the Endpoint/URL should look like this:

   `http://[your-heroku-subdomain].herokuapp.com/authy/callback`

### Deploy to Heroku

Hit the button!

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/TwilioDevEd/authy2fa-node)

That's it!

## Meta

* No warranty expressed or implied. Software is as is. Diggity.
* [MIT License](http://www.opensource.org/licenses/mit-license.html)
* Lovingly crafted by Twilio Developer Education.
