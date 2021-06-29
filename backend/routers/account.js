const express = require('express')
const router = express.Router()
const accountController = require('../controllers/accountController')

router.post('/register',accountController.register)
router.post('/login',accountController.login)
router.post('/logout',accountController.logout)
router.get('/',accountController.show)

module.exports = router