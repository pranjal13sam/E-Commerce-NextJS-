import { otpEmail } from "@/Email/otpEmail";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, generateOTP, response } from "@/lib/helperFunctions";
import { sendMail } from "@/lib/sendMail";
import { zodSchema } from "@/lib/zodSchema";
import OTPModel from "@/models/otp.model";
import UserModel from "@/models/user.model";

export async function POST(request) {
  try {
    await connectDB();

    const payload = await request.json();

    const validationSchema = zodSchema.pick({
      email: true,
    });

    const validatedData = validationSchema.safeParse(payload);

    if (!validatedData.success)
      return response(
        false,
        401,
        "Invalid or missing input fields.",
        validatedData.error
      );

    const { email } = validatedData.data;

    const getUser = await UserModel.findOne({ email });
    if (!getUser) return response(false, 404, "User not found!");

    //remove old otps:
    await OTPModel.deleteMany({ email });

    const otp = generateOTP();

    const newOtpData = new OTPModel({
      email,
      otp,
    });

    await newOtpData.save();

    const otpSendStatus = await sendMail({
      subject: "Your login verification code",
      receiver: email,
      body: otpEmail(otp),
    });

    // if (!otpSendStatus.success)
    //   return response(true, 200, "Failed to resend otp.");

    return response(true, 200, "OTP Sent successfully");
  } catch (error) {
    return catchError(error);
  }
}
