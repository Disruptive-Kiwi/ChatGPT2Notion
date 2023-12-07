console.log('This is a content script running in the page.')

setTimeout(() => {
  let transcript = ''
  const listOfMessages = document.querySelectorAll('[data-message-author-role]')
  // console.log('list', listOfMessages)
  listOfMessages.forEach((message) => {
    const role = message.getAttribute('data-message-author-role')
    transcript += `${role.toUpperCase()}: ${message.innerText}\n\n`
    // if (role === 'user') {
    //   message.style.backgroundColor = 'red'
    //   console.log('User:', message.innerText)
    // } else if(role === 'assistant') {
    //   message.style.backgroundColor = 'blue'
    //   console.log('Assistant:', message.innerText)
    // }
  })
  console.log('Chat transcript:',transcript)
}, 2000)