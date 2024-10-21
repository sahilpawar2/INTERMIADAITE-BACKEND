import mongoose, {Schema} from "mongoose";
import jwt from 'jsonwebtoken';
import bcrypt from  'bcrypt';


const userSchema = new Schema(
    {
        userName :  {
            type : String,
            required : true,
            unique : true,
            trim :  true,
            lowercase : true,
            index : true,
        },
        email :  {
            type : String,
            required : true,
            unique : true,
            trim :  true,
            lowercase : true,
        },
        fullName :  {
            type : String,
            required : true,
            index : true,
        },
        password :  {
            type : String,
            required : [true, "password is require"],
            trim :  true,
        },
        avatar :  {
            type : String,
            required : true,
        },
        coverImage :  {
            type : String,
            required : true,
        },
        watchHistory :  {
            type : Schema.Types.ObjectId,
            ref : "Videos"
        },
        refreshToken  :  {
            type : String
        }


    }, 
{timestamps : true})

userSchema.pre("send", async function(next){        // .pre is a hook (middleware which basically encrypt sensitive data)
    if(!this.isModified('password')) return next();  //this functionm will encrypt password when modefied
    this.password = bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.isPasswordCorrect = async function(password){    //this is method is use to compare the password to the actual db stored password
    return await bcrypt.compare(password, this.password)    // return value in boolean
}

userSchema.methods.generateAccessToken = function(){
    const payload = {
        _id : this._id,
        email : this.email,
        userName : this.userName,
        fullName : this.fullName
    }
    process.env.ACCESS_TOKEN_SECRET ,
    {
        expiresIn : process.env.ACCESS_TOKEN_EXPIRY
    }
}
userSchema.methods.generateRefreshToken = function(){
    const payload = {
        _id : this._id
    }
    process.env.REFRESH_TOKEN_SECRET ,
    {
        expiresIn : process.env.REFRESH_TOKEN_EXPIRY
    }
}


export const  User = mongoose.model("User", userSchema);
