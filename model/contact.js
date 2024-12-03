const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2');
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const ContactSchema = new mongoose.Schema({
    mobile: {
        type: String,
        require: true,
        trim: true
    },
    friendid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    userid: {
        type: String,
        require: true
    }
})

ContactSchema.plugin(mongoosePaginate);
ContactSchema.plugin(aggregatePaginate);

const contactlist = mongoose.model('contactlist', ContactSchema)
module.exports = { contactlist }
