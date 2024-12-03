const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    number: [
      {
        type: String,
        required: true,
        validate: [
          function (numbers) {
            return numbers.length > 0;
          },
          "At least one phone number is required",
        ],
      },
    ],

    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  {
    timestamps: true,
  }
);

userSchema.plugin(mongoosePaginate);
userSchema.plugin(aggregatePaginate);

const User = mongoose.model("User", userSchema);
module.exports = { User };

// userSchema.pre('save', async function (next) {
//     try {
//         if(!this.isModified('password')) {
//             const salt = await bcrypt.genSalt(10);
//             this.password = await bcrypt.hash(this.password, salt);
//         }
//         next();
//     } catch (error) {
//         console.log(error)
//     }
// });
