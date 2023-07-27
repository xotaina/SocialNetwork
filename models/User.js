const { Schema, model } = require('mongoose');

// Schema to create User model
const userSchema = new Schema(
    {
        username: { 
            type: String, 
            required: true, 
            unique: true, 
            trim: true
        },
        email: {
            type: String, 
            required: true, 
            unique: true, 
            // remove the array and second argument?
            match: [/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/, 'Please enter a valid email address']
        },
        thoughts: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Thought',
              },
        ],
        friends: [
            {
                type: Schema.Types.ObjectId,
                ref: 'user',
              },
        ]
    },
    {
      toJSON: {
        virtuals: true,
      },
      id: false,
    }
  );

  // Virtual property friendCount
  userSchema
  .virtual('friendCount')
  
  .get(function () {
    return this.friends.length;
  })

const User = model('user', userSchema);

module.exports = User;