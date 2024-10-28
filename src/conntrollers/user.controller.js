import {asyncHandler} from '../utils/asyncHandeler.js'
import {APIErros} from "../utils/ApiError.js"
import { User } from '../models/user.models.js';
import {uploadOnCloudinary} from '../utils/cloudinary.js'
import { ApiResponse } from '../utils/ApiResponse.js';

const generateAccessRefreshToken = async(userId)  => {

        try {
            const user = await User.findById(userId)
            const accessToken = user.generateAccessToken()
            const refreshToken = user.generateRefreshToken()
            user.refreshToken = refreshToken
            await user.save({validateBeforeSave : false})
            return {accessToken, refreshToken}
        } catch (error) {
            throw new APIErros(500, "SOMETHIG WENT WORNGE WHILE GENERATING ACCESS TOKEN AND REFRESH TOKEN")
        }
}

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
    const expectedUser = await User.findOne({
        $or : [{userName}, {email}]
    })

    if(expectedUser){
        throw new APIErros(409, "USER IS EXISTED")
    }

    const avatarLocalFile = req.files?.avatar[0]?.path;
    // const coverImageLocalFile = req.files?.coverImage[0]?.path;

    let coverImageLocalPath;
    // if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
    //     coverImageLocalFile = req.files.coverImage[0].path
    // }
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }

    if(!avatarLocalFile) {
        throw new APIErros(400, "AVATARFILE IS REQUIRED")
    }

    const avatar = await uploadOnCloudinary(avatarLocalFile);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if(!avatar){
        throw new APIErros(500, "AVATAR FILE IS NOT UPLOADED")
    }


    // creating user object to store inside the databases
    const user = await User.create({     // use await because it will create object in the db so itll take time
        fullName,
        avatar : avatar.url,
        coverImage : coverImage?.url || " ",

        email,
        password,
        userName : userName.toUpperCase()
    })

    // checkeing if user is created or not
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"  /// select which filed does not want to ckeck
    )

    if(!createdUser){
        throw new APIErros(500, "SOMETHING WENT WRONG WHILR REGISTERING THE USER")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "USER REGISTERED SUCCESFULLY")
    )
    
})
const userLoggedIn = asyncHandler(async(req, res) =>{
    const {email, userName, password} = req.body
    if(!userName || email){
        throw new APIErros(400, "USERNAME OR EMAIL IS REQUIRED")
    }
    const user = User.findOne({
        $or : [{userName}, {email}]
    })
    if(!user){
        throw new APIErros(404, "USER DOESNT EXIST PLEASE REGISTER")
    }
    const isPasswordValid = await user.isPasswordCorrect(password) 
    if(!isPasswordValid){
        throw new ApiError(401, 'PASSWORD IS INCORECT')
    }
    const{ accessToken, refreshToken} = await generateAccessRefreshToken(user._id)
    const loggedInUser = await  User.findById(user._id).select('-password -refreshToken')
    const option = {
        httpOnly : true,
        secure : true
    }
    return res
    .status(200)
    .cookie('accessToken', accessToken, options)
    .cookie('refreshToken', refreshToken, options)
    .json(
        new ApiResponse(
            200, 
            {
                user :loggedInUser, accessToken, refreshToken
            }, 
            "USER LOGGED IN SUCCESSFULLY"
        )
    ) 
})

export {
    registerUser, 
    userLoggedIn
}



