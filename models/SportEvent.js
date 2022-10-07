const mongoose = require('mongoose')
const SportEventMatch = require('./SportEventMatch')

const sportEventSchema = new mongoose.Schema({
    sportEventName: { type: String, required: true },
    sportEventCategory: { type: String, required: true },
    sportEventPlace: { type: String, required: true },
    sportEventDate: { type: String, required: true },
    sportEventDescription: { type: String, required: true },
    sportEventProfilePhoto: { type: String },
    photoId: { type: String, default: 0},
    sportDepartment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Sport'
    },
    sportEventMatch: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'SportEventMatch'
        }
    ],
    sportEventMatchCount: {
        type: Number,
        default: 0
    }
})

sportEventSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await SportEventMatch.deleteMany({
            _id: {
                $in: doc.sportEventMatch
            }
        })
    }
  })


const SportEvent = mongoose.model('SportEvent', sportEventSchema)


module.exports = SportEvent