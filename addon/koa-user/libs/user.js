
const mongoose = require('mongoose');
const beautifyUnique = require('mongoose-beautiful-unique-validation');

// uniqueValidator validation is not atomic! unsafe!
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: "E-mail пользователя не должен быть пустым.",
    validate: [
      {
        validator: async function(value) {
          return /^[-.\w]+@([\w-]+\.)+[\w-]{2,12}$/.test(value);
        },
        msg:       'Некорректный email.'
      }
    ],
    unique: "Такой email уже существует"
  },
  displayName: {
    type: String,
    required: "У пользователя должно быть имя",
    unique: "Такое имя уже существует"
  }
}, {
  timestamps: true,
  /* @see mongoose 
  toObject: {
    transform(doc, ret) {
      // remove the __v of every document before returning the result
      delete ret.__v;
      return ret;
    }
  }*/
});

userSchema.plugin(beautifyUnique);

userSchema.statics.publicFields = ['email', 'displayName'];

module.exports = mongoose.model('User', userSchema);
