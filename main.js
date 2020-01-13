require('dotenv').config()
const linebot = require('linebot')
const rp = require('request-promise')
const callAPI = async (name) => {
  let data = ''
  try {
    const str = await rp('http://data.coa.gov.tw/Service/OpenData/ODwsv/ODwsvTravelFood.aspx')
    let json = JSON.parse(str)
    json = json.filter((j) => {
      return j.Name === name
    })
    data = json[0].PicURL
  } catch (error) {
    data = '發生錯誤'
  }
  return data
}
const bot = linebot({
  channelId: process.env.CHANNEL_ID,
  channelSecret: process.env.CHANNEL_SECRET,
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
})

bot.listen('/', process.env.PORT, () => {
  console.log('機器人已啟動')
})

bot.on('message', event => {
//   console.log(event.message)
//   console.log('1232')
  if (event.message.type === 'text') {
    const usermsg = event.message.text
    callAPI(usermsg).then(result => {
      if (result.substr(0, 5) === 'https') {
        event.reply({
          type: 'image',
          originalContentUrl: result,
          previewImageUrl: result
        })
      } else event.reply(result)
    }).catch(error => {
      console.log(error.message)
      event.reply('發生錯誤')
    })
    // event.reply(usermsg)
  }
})

// bot.on('message', function (event) {
//   event.reply(event.message.text).then(function (data) {
//     // success
//   }).catch(function (error) {
//     // error
//   });
// });
