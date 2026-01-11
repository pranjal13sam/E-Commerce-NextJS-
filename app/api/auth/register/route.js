import { emailVerificationLink } from "@/Email/emailVerificationLink";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunctions";
import { sendMail } from "@/lib/sendMail";
import { zodSchema } from "@/lib/zodSchema";
import UserModel from "@/models/user.model";
import { SignJWT } from "jose";

export async function POST(request) {
  try {
    await connectDB();
    //validation schema:
    const validationSchema = zodSchema.pick({
      name: true,
      email: true,
      password: true,
    });

    const payload = await request.json();

    //validating the payload with schema using zod safeParse method:
    const validatedData = validationSchema.safeParse(payload);

    if (!validatedData.success) {
      return response(
        false,
        401,
        "Invalid or missing input fields",
        validatedData.error
      );
    }
    const { name, email, password } = validatedData.data;

    //check if user already exists
    const checkUser = await UserModel.exists({ email });
    if (checkUser) {
      return response(false, 409, "User already exists with this email");
    }

    //create new user:
    const newUser = new UserModel({
      name,
      email,
      password,
    });
    await newUser.save();

    //creating jose toke for the user:
    const secret = new TextEncoder().encode(process.env.SECRET_KEY);
    const token = await new SignJWT({ userId: newUser._id.toString() })
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
      true,
      201,
      "Registration successful. Please verify your email."
    );
  } catch (error) {
    return catchError(error, "Failed to register user");
  }
}
