var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var userSchema = new Schema({
    username: String,
    password: String,
    name: String,
    address: String,
    city: String,
    zip: Number,
    state: String
});

var itemSchema = new Schema({
    name: String,
    category: String,
    description: String,
    image: String,
    current_owner: { type: Schema.Types.ObjectId, ref: 'User' },
    proposed_owner: { type: Schema.Types.ObjectId, ref: 'User' },    
    value: Number,
});

mongoose.model('User', userSchema);
mongoose.model('Item', itemSchema);