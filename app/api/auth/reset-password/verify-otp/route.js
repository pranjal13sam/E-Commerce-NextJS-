import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunctions";
import { zodSchema } from "@/lib/zodSchema";
import OTPModel from "@/models/otp.model";
import UserModel from "@/models/user.model";

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

    //removing otp after validation:
    await getOtpData.deleteOne();

    return response(true, 200, "Otp verifed successfully");
  } catch (error) {
    return catchError(error);
  }
}
