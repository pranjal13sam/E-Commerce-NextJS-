import { zodSchema } from "@/lib/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import ButtonSpinner from "./ButtonSpinner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { showToast } from "@/lib/showToast";
import axios from "axios";

const OtpVerification = ({ email, onSubmit, loading }) => {
  const [value, setValue] = useState("");
  const [isResendOtp, setIsResendOtp] = useState(false);
  const formSchema = zodSchema.pick({
    otp: true,
    email: true,
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      otp: "",
      email: email,
    },
  });

  const handleOtpVerification = async (values) => {
    onSubmit(values);
  };

  const resendOTP = async (values) => {
    try {
      setIsResendOtp(true);
      const { data: resendOtp } = await axios.post(
        "/api/auth/resend-otp",
        {email}
      );
      if (!resendOtp.success) {
        showToast("error", resendOtp.message);
        return;
      }
      showToast("success", resendOtp.message);
    } catch (error) {
      showToast("error", error.message);
    } finally {
      setIsResendOtp(false);
    }
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleOtpVerification)} className="">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">
              please complete verification
            </h1>
            <p className="text-shadow-md">
              We have sent an One-time Password (OTP) to your registered email
              address. The OTP is valid for 10 minutes only.
            </p>
          </div>
          <div className="mb-5 mt-5 flex justify-center">
            <FormField
              control={form.control}
              name="otp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>One-time Password (OTP)</FormLabel>
                  <FormControl>
                    <InputOTP maxLength={6} {...field}>
                      <InputOTPGroup>
                        <InputOTPSlot className="text-xl size-10" index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />{" "}
          </div>

          <div>
            <ButtonSpinner
              loading={loading}
              type="submit"
              text="Verify"
              className="w-full cursor-pointer"
            />
            <div className="text-center mt-5">
              {!isResendOtp ? (
                <button
                  onClick={resendOTP}
                  type="button"
                  className="text-blue-500 cursor-pointer hover:underline"
                >
                  Resend OTP
                </button>
              ) : (
                <span className="text-md">Resending...</span>
              )}
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default OtpVerification;
