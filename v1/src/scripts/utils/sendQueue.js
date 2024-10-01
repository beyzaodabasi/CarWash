const amqp = require('amqplib')

const sendQueue = async (message, queue = 'vscooter') => {
  try {
    const connection = await amqp.connect(`amqp://${process.env.RABBITMQ_SERVER}`)
    const channel = await connection.createChannel()
    const assertion = await channel.assertQueue(queue)
    channel.sendToQueue(queue, Buffer.from(message))
    console.log(' [x] Queue Message: %s', message)
  } catch (error) {
    console.error('Queue Send Error: ', error)
  }
}

module.exports = {
  sendQueue,
}
