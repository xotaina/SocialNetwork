const { Schema, model } = require('mongoose');
const reactionSchema = require('./reaction');
const format = require('date-fns/format');

// Schema to create Thought model
const thoughtSchema = new Schema(
    {
        thoughtText: {
            type: String, 
            required: true, 
            minlength: 1,
            maxlength: 280
        },
        createdAt: {
          type: Date,
          default: Date.now,
          get: (date) => format(new Date(date), "MMMM do, yyyy 'at' hh:mm a"),
        }, 
        username: { 
            type: String, 
            required: true
        },
        reactions: [reactionSchema],
    },
    {
      toJSON: {
        virtuals: true,
        getters: true,
      },
      id: false,
    }
);

// Create a virtual property `reactionCount` that retrieves the # of reactions
thoughtSchema.virtual('reactionCount').get(function () {
    return this.reactions.length;
});

// Initialize our Thought model
const Thought = model('Thought', thoughtSchema);

module.exports = Thought;
