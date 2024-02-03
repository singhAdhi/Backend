import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

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
  console.log(fullName, email, username, password);

  if (
    [fullName, email, username, password].some((field) => field?.trim() === "") //checks if field trim ke baad is empty return true or false
  ) {
    throw new Error("Full Name cannot be empty");
  }

  const existedUser = User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new Error("USer already existed");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;
  console.log(avatarLocalPath);

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

  const createdUser = await User.findById(user._id);

  if (!createdUser) {
    throw new Error("user not found");
  }
  return res.status(201).json({
    createdUser,
  });
};

export { registerUser };
