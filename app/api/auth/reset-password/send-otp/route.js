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
        "Invalid or missing input field",
        validatedData.error
      );

    //verify user:
    const { email } = validatedData.data;
    const getUser = await UserModel.findOne({ deletedAt: null, email }).lean();
    if (!getUser) {
      return response(false, 404, "User not found");
    }

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

    return response(true, 200, "Please verify your account");
  } catch (error) {
    return catchError(error);
  }
}
