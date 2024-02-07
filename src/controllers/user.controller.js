import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({
      ValiditeBeforeSave: false,
    }); //save the data in the database

    return { accessToken, refreshToken };
  } catch (error) {
    throw new Error("Something went wrong");
  }
};

const registerUser = async (req, res) => {
  //get user details from frontend
  //validation --not empty
  // check if user already exists: username,email
  // check for images,check for avtar
  //upload them to cloudinary
  //create user object - create entry in db
  // remove password and refresh token field from response
  //check for user creation
  // return response

  const { fullName, email, username, password } = req.body;

  if (
    [fullName, email, username, password].some((field) => field?.trim() === "") //checks if field trim ke baad is empty return true or false
  ) {
    throw new Error("Full Name cannot be empty");
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new Error("USer already existed");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;

  if (!avatarLocalPath) {
    throw new Error("Avatar is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  const user = await User.create({
    fullName,
    avatar: avatar?.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });
  console.log(user);
  const createdUser = await User.findById(user._id);

  if (!createdUser) {
    throw new Error("user not found");
  }
  return res.status(201).json({
    createdUser,
  });
};

const loginUser = async (req, res) => {
  //get detail from frontend= req body
  // username or email
  // find the user
  // password check
  //access and refresh token generated
  //send cookie

  const { email, username, password } = req.body;

  if (!username || !email) {
    throw new Error("username or email cannot be empty");
  } //this checks if the username or email is not there then throw error

  const user = await User.findOne({
    $or: [{ username }, { email }],
  }); //if the data is there then find weather the username or email exist in the database or not

  if (!user) {
    throw new Error("user not existed");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new Error("password not correct");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      {
        user: loggedInUser,
        accessToken,
        refreshToken,
      },
      "User looge in succesfully"
    );
};

const logoutUser = async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json({
      msg: "ok",
    });
};

export { registerUser, loginUser, logoutUser };
