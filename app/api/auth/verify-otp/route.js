import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunctions";
import { zodSchema } from "@/lib/zodSchema";
import OTPModel from "@/models/otp.model";
import UserModel from "@/models/user.model";
import { SignJWT } from "jose";
import { cookies } from "next/headers";

export async function POST(request) {
  try {
    await connectDB();
    const payload = await request.json();

    const validationSchema = zodSchema.pick({
      otp: true,
      email: true,
    });

    const validatedData = validationSchema.safeParse(payload);

    if (!validatedData)
      return response(
        false,
        401,
        "Invalid or missing input field",
        validatedData.error
      );

    const { email, otp } = validatedData.data;
    const getOtpData = await OTPModel.findOne({ email, otp });

    if (!getOtpData) return response(false, 404, "Invalid or expired otp.");

    //lean() means plain js objects not a full mongoose document
    const getUser = await UserModel.findOne({ deletedAt: null, email }).lean();

    if (!getUser) return response(false, 404, "User not found");

    //setting token:
    const loggedInUserData = {
      id: getUser._id,
      role: getUser.role,
      name: getUser.name,
      avatar: getUser.avatar,
    };

    const secret = new TextEncoder().encode(process.env.SECRET_KEY);
    const token = await new SignJWT(loggedInUserData)
      .setIssuedAt()
      .setExpirationTime("2h")
      .setProtectedHeader({ alg: "HS256" })
      .sign(secret);

    //setting cookie:
    const cookieStore = await cookies();
    cookieStore.set({
      name: "access_token",
      value: token,
      httpOnly: process.env.NODE_ENV === "production",
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    //removing otp after validation:
    await getOtpData.deleteOne();

    return response(true, 200, "Login Successful!",loggedInUserData);
  } catch (error) {
    return catchError(error);
  }
}
