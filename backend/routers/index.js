const accountRouter = require('./account')

module.exports = (app) => {
    app.use('/account',accountRouter)
}