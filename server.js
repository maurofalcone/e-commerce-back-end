const bodyParser = require("body-parser")
const express = require("express")
const mongoose = require("mongoose")
const passport = require("passport")
const api = require("./routes/api")
const dynamic = require("./routes/dynamic")
const app = express()
// Bodyparser middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
// DB Config
const db = require("./config/keys").mongoURI
// Connect to MongoDB
mongoose.connect(db, {useNewUrlParser: true}).then(() => console.log("MongoDB successfully connected")).catch(err => console.log(err))
mongoose.set('useFindAndModify', false)
// Passport middleware
app.use(passport.initialize())
// Passport config
require("./config/passport")(passport)

app.use('/static', express.static('assets'))
app.use('/api', api)
app.use('/',dynamic)


// process.env.port is Heroku's port.
const port = process.env.PORT ||5000
app.listen(port, () => console.log('Server up and running on port:'+ port))
