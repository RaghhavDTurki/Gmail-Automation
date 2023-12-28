const { authorize } = require('./auth')
const { getNewMessages, sendReplies } = require('./mailAutomation')

async function main () {
  try {
    // Get current time in seconds.
    const now = Math.floor(Date.now() / 1000)
    console.log('Starting the application')
    // Authorize the client.
    const auth = await authorize()
    // Do these steps in random intervals of 45 to 120 seconds
    setInterval(
      async () => {
        console.log('Checking for new messages')
        // Get the list of new messages.
        const newMessages = await getNewMessages(auth, now)
        console.log('You have got ' + newMessages.length + ' new messages')
        // Send replies to the new messages.
        await sendReplies(auth, newMessages)
        console.log('Replied to ' + newMessages.length + ' messages')
      },
      Math.floor(Math.random() * (120000 - 45000 + 1)) + 45000
    )
  } catch (error) {
    console.log('An error occured\n', error)
  }
}

main()
