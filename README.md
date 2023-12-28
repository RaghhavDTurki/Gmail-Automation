# Gmail Automation Tool

## Objectives

-   [x] Google Oauth login
-   [x] Check for new unread emails
-   [x] Send replies to Emails that have no prior replies
-   [x] Repeat the above steps in random intervals of 45 to 120 seconds

## Tech Stack
1. Node.js (v20.9.0)
2. Google APIs Node.js Client
3. Gmail API
4. Eslint (Standard)

## Steps to run the project

1. [Create a new project in Google Cloud Platform](https://console.cloud.google.com/projectcreate)
2. [Enable Gmail API inside your new project](https://console.cloud.google.com/apis/library/gmail.googleapis.com)
3. [Configure OAuth consent screen](https://console.cloud.google.com/apis/credentials/consent)

-   Select `External` user type and click `Create`
-   Fill out the app information and click `Save and Continue`
-   Now add the email address you want to use for testing and click `Save and Continue`
-   Review the information and click `Back to Dashboard`

4. [Create OAuth client ID](https://console.cloud.google.com/apis/credentials)

-   Select `Desktop app` as the application type and click `Create`
-   Click `Download JSON` and save the file as `credentials.json` in the project directory

5. Install the required packages

```bash
npm install
```

6. Run the project

```bash
npm start
```

7. Open the link in your browser and allow the permissions
8. You are all set! The program will now run in the background and send replies to unread emails that have no prior replies

## References

-   [Google APIs Node.js Client](https://www.npmjs.com/package/googleapis)
-   [Gmail API](https://developers.google.com/gmail/api)
-   [Gmail API Node.js Quickstart](https://developers.google.com/gmail/api/quickstart/nodejs)

## License

[MIT](https://choosealicense.com/licenses/mit/)
