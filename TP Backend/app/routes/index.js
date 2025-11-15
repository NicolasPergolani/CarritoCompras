const  express = require('express');
const router = express.Router();
const fs= requere('fs')

const pathRouter =` ${__dirname}`
const removeExtension = (fileName) => {
  return fileName.split('.').shift()
}

fs.readdirSync(pathRouter).filter((file) => {
  const fileWithOutExt = removeExtension(file)
  const skip = ['index'].includes(fileWithOutExt)
  if (!skip) {
    router.use(`/${fileWithOutExt}`, require(`./${fileWithOutExt}`))
  }
})
    router.get('*', (req, res) => {
        res.status(404).send('404 not found')
    })

    module.exports = router;    