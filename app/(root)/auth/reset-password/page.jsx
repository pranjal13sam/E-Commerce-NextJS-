"use client";
import { Card, CardContent } from "@/components/ui/card";
import React, { useState } from "react";
import Logo from "@/public/assets/images/logo-black.png";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { zodSchema } from "@/lib/zodSchema";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import ButtonSpinner from "@/components/Application/ButtonSpinner";
import Link from "next/link";
import {
  WEBSITE_LOGIN,
  WEBSITE_REGISTER,
  WEBSITE_RESETPASSWORD,
} from "@/routes/ApplicationRoute";
import axios from "axios";
import { showToast } from "@/lib/showToast";
import OtpVerification from "@/components/Application/OtpVerification";
import UpdatePassword from "@/components/Application/UpdatePassword";

const ResetPassword = () => {
  const [emailVerificationLoading, setEmailVerificationLoading] =
    useState(false);
  const [otpVerificationLoading, setOtpVerificationLoading] = useState(false);
  const [otpEmail, setOtpEmail] = useState();
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const formSchema = zodSchema.pick({
    email: true,
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleEmailVerification = async (values) => {
    try {
      setEmailVerificationLoading(true);
      const { data: sendOtpResponse } = await axios.post(
        "/api/auth/reset-password/send-otp",
        values
      );
      if (!sendOtpResponse.success) {
        showToast("error", sendOtpResponse.message);
        return;
      }

      setOtpEmail(values.email);
      showToast("success", sendOtpResponse.message);
    } catch (error) {
      showToast("error", error.message);
    } finally {
      setEmailVerificationLoading(false);
    }
  };

  const handleOtpVerification = async (values) => {
    try {
      setOtpVerificationLoading(true);
      const { data: otpResponse } = await axios.post(
        "/api/auth/reset-password/verify-otp",
        values
      );
      if (!otpResponse.success) {
        showToast("error", otpResponse.message);
        return;
      }
      setIsOtpVerified(true);
      showToast("success", otpResponse.message);
    } catch (error) {
      showToast("error", error.message);
    } finally {
      setOtpVerificationLoading(false);
    }
  };

  return (
    <Card className="w-100">
      <CardContent>
        <div className="flex justify-center">
          <Image
            src={Logo.src}
            width={Logo.width}
            height={Logo.height}
            alt="logo"
            className="max-w-37.5"
          />
        </div>
        {!otpEmail ? (
          <>
            <div className="text-center">
              <h1 className="text-3xl font-bold">Reset Password</h1>
              <p>Enter your email for password reset.</p>
            </div>
            <div className="mt-5">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleEmailVerification)}
                  className=""
                >
                  <div className="mb-5">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="example@gmail.com"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />{" "}
                  </div>

                  <div>
                    <ButtonSpinner
                      loading={emailVerificationLoading}
                      type="submit"
                      text="Send OTP"
                      className="w-full cursor-pointer"
                    />
                  </div>
                  <div className="text-center">
                    <div className="flex justify-center items-center gap-1">
                      <Link
                        href={WEBSITE_LOGIN}
                        className="text-primary underline"
                      >
                        Back to login
                      </Link>
                    </div>
                  </div>
                </form>
              </Form>
            </div>
          </>
        ) : (
          <>
            {!isOtpVerified ? (
              <OtpVerification
                email={otpEmail}
                loading={otpVerificationLoading}
                onSubmit={handleOtpVerification}
              />
            ) : (
              <UpdatePassword email={otpEmail} />
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ResetPassword;
