const mongoose = require("mongoose")
const bcrypt = require("bcrypt")

// Schema for users to be stored in database
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Username is required"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        validate: {
            validator: val => /^([\w-\.]+@([\w-]+\.)+[\w-]+)?$/.test(val),
            message: "Email is not valid"
        }
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [8, "Password must be at least 8 characters"]
    }
}, { timestamps: true })

// Not stored in database, used to confirm password on creation
UserSchema.virtual("confirmPassword")
    .get( () => this.confirmPassword )
    .set( value => this._confirmPassword = value);

// Confirms passwords match before validations
UserSchema.pre("validate", function(next){
    if(this.password !== this.confirmPassword){
        this.invalidate("confirmPassword", "Passwords must match")
    }
    next();
});

// Hashes password before saving
UserSchema.pre("save", function(next){
    bcrypt.hash(this.password, 10)
        .then(hash => {
            this.password = hash;
            next();
        })
})

module.exports = mongoose.model("User", UserSchema)