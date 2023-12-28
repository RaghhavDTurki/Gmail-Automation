const { google } = require('googleapis')

/**
 * Fetches the new unread messages from the inbox starting from the moment the main function is called.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 * @param {number} time The time when the main function was called.
 * @return {<Array<gmail_v1.Schema$Message>} List of unread messages.
 */
async function getNewMessages (auth, time) {
  try {
    const gmail = google.gmail({ version: 'v1', auth })
    const response = await gmail.users.messages.list({
      userId: 'me',
      labelIds: ['INBOX'],
      // Fetch unread messages after the moment the main function is called.
      q: `is:unread after:${time}`
    })

    return response.data.messages || []
  } catch (error) {
    console.log("Couldn't fetch messages\n", error)
    throw error
  }
}

/**
 * Create a new Label named "Vacation Automated Reply" if it does not exist in the user's account.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 * @returns {string} The id of the label.
 */
async function createLabel (auth) {
  try {
    const labelName = 'Vacation Automated Reply'
    const gmail = google.gmail({ version: 'v1', auth })
    const response = await gmail.users.labels.create({
      userId: 'me',
      requestBody: {
        labelListVisibility: 'labelShow',
        messageListVisibility: 'show',
        name: labelName
      }
    })
    return response.data.id
  } catch (error) {
    // If the label already exists, return its id.
    if (error.code === 409) {
      const gmail = google.gmail({ version: 'v1', auth })
      const response = await gmail.users.labels.list({
        userId: 'me'
      })
      const labels = response.data.labels
      const label = labels.find(
        (label) => label.name === 'Vacation Automated Reply'
      )
      return label.id
    } else {
      throw error
    }
  }
}

/**
 * From the list of new messages, send replies to emails that have no prior replies.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 * @param {Array<gmail_v1.Schema$Message>} newMessages List of new messages.
 * @returns {Array<gmail_v1.Schema$Message>} List of messages that were not replied to.
 */
async function sendReplies (auth, newMessages) {
  try {
    const labelId = await createLabel(auth)
    const gmail = google.gmail({ version: 'v1', auth })
    if (newMessages && newMessages.length > 0) {
      for (const message of newMessages) {
        const messageData = await gmail.users.messages.get({
          auth,
          userId: 'me',
          id: message.id
        })

        const email = messageData.data
        const hasReplied = email.payload.headers.some(
          (header) => header.name === 'In-Reply-To'
        )
        if (!hasReplied) {
          const reply = createReplyEmail(email)
          await gmail.users.messages.send({
            auth,
            userId: 'me',
            requestBody: {
              raw: reply,
              labelIds: [labelId]
            }
          })

          // Move the email to the "Vacation Automated Reply" label.
          await gmail.users.messages.modify({
            auth,
            userId: 'me',
            id: email.id,
            requestBody: {
              addLabelIds: [labelId],
              removeLabelIds: ['INBOX']
            }
          })
        }
      }
    }
  } catch (error) {
    console.log("Couldn't send replies\n", error)
    throw error
  }
}

/**
 * Creates a reply to the given email.
 * @param {gmail_v1.Schema$Message} email The email to reply to.
 * @returns {string} The raw string of the reply.
 */
function createReplyEmail (email) {
  const reply = `From: ${
        email.payload.headers.find((header) => header.name === 'To').value
    }\n`
  const replyTo = `To: ${
        email.payload.headers.find((header) => header.name === 'From').value
    }\n`
  const subject = `Subject: Re: ${
        email.payload.headers.find((header) => header.name === 'Subject').value
    }\n`
  const replyBody =
        'I am currently on vacation. I will reply to your email when I return.\n\nBest, \n Test Email\n'
  const replyMessage = `${reply}${replyTo}${subject}\n${replyBody}`
  const encodedReply = Buffer.from(replyMessage)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
  return encodedReply
}

module.exports = { getNewMessages, sendReplies }
