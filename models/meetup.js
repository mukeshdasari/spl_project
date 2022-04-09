const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const meetupSchema = new Schema({
    name: {type: String, required: [true, 'Title is required']},
    topic: {type: String, required: [true, 'Topic is required']},
    interests: {type: String, required: [true, 'Interests is required']},
    details: {type: String, required: [true, 'Detail is required'], 
              minLength: [10, 'The detail should have at least 10 characters']},
    host: {type: Schema.Types.ObjectId, ref: 'User'},
    location: {type: String, required: [true, 'Location is required']},
    date: {type: String, required: [true, 'Date is required']},
    startTime: {type: String, required: [true, 'Start time is required']},
    endTime: {type: String, required: [true, 'End Time is required']},
    image: {type: String, required: [true, 'Image is required']},
    attendees: [{type: Schema.Types.ObjectId, ref: 'User'}]
},
{timestamps: true}
);

module.exports = mongoose.model('Meetup', meetupSchema);


