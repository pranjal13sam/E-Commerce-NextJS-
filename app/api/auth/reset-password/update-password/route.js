import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunctions";
import { zodSchema } from "@/lib/zodSchema";
import UserModel from "@/models/user.model";

export async function PUT(request) {
  try {
    await connectDB();

    const payload = await request.json();

    const validationSchema = zodSchema.pick({
      email: true,
      password: true,
    });

    const validatedData = validationSchema.safeParse(payload);

    if (!validatedData)
      return response(
        false,
        401,
        "Invalid or missing input field",
        validatedData.error
      );

    const { email, password } = validatedData.data;
    const getUser = await UserModel.findOne({ deletedAt: null, email }).select(
      "+password"
    );

    if (!getUser) return response(false, 404, "User not found");

    //update password:
    getUser.password = password;

    await getUser.save();

    return response(true, 200, "Password updated successfully");
  } catch (error) {
    return catchError(error);
  }
}
