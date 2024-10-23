import {asyncHandler} from '../utils/asyncHandeler.js'
import {APIErros} from "../utils/ApiError.js"
import { User } from '../models/user.models.js';
import {uploadOnCloudinary} from '../utils/cloudinary.js'
import { ApiResponse } from '../utils/ApiResponse.js';


const registerUser = asyncHandler(async(req, res) =>{
    
    const {fullName, userName, email, password} = req.body;
    console.log('fullName:', fullName);
    console.log('userName:', userName);
    console.log('email:', email);
    console.log('password:', password);

    // if(fullName ==="") {
    //     throw new APIErros(400, 'FULL NAME IS REQUIRE');
    // }
    if(
        [fullName,  userName, email, password]
        .some((fields) => fields?.trim() === "")
    )
    {
        throw new  APIErros(400, 'ALL FIELDS ARE REQUIRED');

    }
    
    // check if same userName email exist
    const expectedUser = User.findOne({
        $or : [{userName}, {email}]
    })

    if(expectedUser){
        throw new APIErros(409, "USER IS EXISTED")
    }

    const avatarLocalFile = req.files?.avatar[0]?.path;
    const coverImageLocalFile = req.files?.coverImage[0]?.path;

    if(!avatarLocalFile) {
        throw new APIErros(400, "AVATARFILE IS REQUIRED")
    }

    const avatar = await uploadOnCloudinary(avatarLocalFile);
    const coverImage = await uploadOnCloudinary(coverImageLocalFile);

    if(!avatar){
        throw new APIErros(500, "AVATAR FILE IS NOT UPLOADED")
    }


    // creating user object to store inside the databases
    const user = await User.create({     // use await because it will create object in the db so itll take time
        fullName,
        avatar : avatar.url,
        coverImage : coverImage?.url,
        email,
        password,
        userName : userName.toUpperCase()
    })

    // checkeing if user is created or not
    const createdUser = await User.findById(user._id).select(
        "-passowrd -refreshToken"  /// select which filed does not want to ckeck
    )

    if(!createdUser){
        throw new APIErros(500, "SOMETHING WENT WRONG WHILR REGISTERING THE USER")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "USER REGISTERED SUCCESFULLY")
    )
    
})

export {registerUser}


