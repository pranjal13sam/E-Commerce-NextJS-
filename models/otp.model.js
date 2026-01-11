import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    otp: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      //adding 10 minutes from the current time(in millisecond)
      default: () => new Date(Date.now() + 10 * 60 * 1000),
    },
  },
  { timestamps: true }
);

//this is TTL(time to live)index
//automatically delete this document when expiresAt time is reached.
otpSchema.index({ expiresAt: 1 }, { expiresAfterSeconds: 0 });
//at last we gave 'otps' so that in the database otps document will be created not 'otp'
const OTPModel = mongoose.models.OTP || mongoose.model("OTP", otpSchema,'otps');

export default OTPModel;
