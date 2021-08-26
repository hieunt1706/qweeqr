const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
    name: {type: 'string'},
    email: {type: 'string'},
    password: {type: 'string'},
    role: {type: 'Boolean', default: false}
}, {
    timestamps: true
})



module.exports = mongoose.model('user', userSchema)