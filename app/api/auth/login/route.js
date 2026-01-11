import { emailVerificationLink } from "@/Email/emailVerificationLink";
import { otpEmail } from "@/Email/otpEmail";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, generateOTP, response } from "@/lib/helperFunctions";
import { sendMail } from "@/lib/sendMail";
import { zodSchema } from "@/lib/zodSchema";
import OTPModel from "@/models/otp.model";
import UserModel from "@/models/user.model";
import { z } from "zod";

export async function POST(request) {
  try {
    await connectDB();
    const payload = await request.json();

    const validationSchema = zodSchema
      .pick({
        email: true,
      })
      .extend({
        password: z.string(),
      });

    const validatedData = validationSchema.safeParse(payload);

    if (!validatedData.success) {
      return response(
        false,
        401,
        "Invalid or missing input field.",
        validatedData.error
      );
    }

    const { email, password } = validatedData.data;

    //get user data:
    //here we are adding +password because in password model it is select false so by using query
    //we will not get password hence we cannot compare but here we are using it by force applying +
    const getUser = await UserModel.findOne({ deletedAt: null, email }).select(
      "+password"
    );

    if (!getUser) {
      return response(false, 401, "Invalid login credentials");
    }

    //resend email verification link if not verified during registration:
    if (!getUser.isEmailVerified) {
      const secret = new TextEncoder().encode(process.env.SECRET_KEY);
      const token = await new SignJWT({ userId: getUser._id.toString() })
        .setIssuedAt()
        .setExpirationTime("2h")
        .setProtectedHeader({ alg: "HS256" })
        .sign(secret);

      await sendMail({
        subject: "Email verification request",
        receiver: email,
        body: emailVerificationLink(
          `${process.env.NEXT_PUBLIC_BASE_URL}/auth/verify-email/${token}`
        ),
      });

      return response(
        false,
        401,
        "Your email is not verified. We have sent a verification link to your registered email address"
      );
    }

    //password comparison:
    const isPasswordVerified = await getUser.comparePassword(password);
    if (!isPasswordVerified)
      return response(false, 400, "Invalid login credentials");

    //otp generation:
    await OTPModel.deleteMany({ email }); //deleting old otps

    //generating new otps:
    const otp = generateOTP();

    //storing otp into database:
    const newOtpData = new OTPModel({
      email,
      otp,
    });

    await newOtpData.save();

    //sending otp to email:
    const otpEmailStatus = await sendMail({
      subject: "Your login verification code",
      receiver: email,
      body: otpEmail(otp),
    });

    // if (!otpEmailStatus.success) {
    //   return response(false, 400, "Failed to send OTP");
    // }

    return response(true, 200, "Please verify your device");
  } catch (error) {
    return catchError(error);
  }
}
