import mongoose, {Schema} from "mongoose";

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


export const  User = mongoose.model("User", userSchema);
