"use client";
import { Card, CardContent } from "@/components/ui/card";
import React, { useState } from "react";
import Logo from "@/public/assets/images/logo-black.png";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { zodSchema } from "@/lib/zodSchema";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import ButtonSpinner from "@/components/Application/ButtonSpinner"
import { FaRegEyeSlash } from "react-icons/fa";
import { FaRegEye } from "react-icons/fa6";
import { is } from "zod/v4/locales";
import Link from "next/link";
import {
  USER_DASHBOARD,
  WEBSITE_REGISTER,
  WEBSITE_RESETPASSWORD,
} from "@/routes/ApplicationRoute";
import axios from "axios";
import { showToast } from "@/lib/showToast";
import OtpVerification from "@/components/Application/OtpVerification";
import { useDispatch } from "react-redux";
import { login } from "@/store/reducer/authReducer";
import { useRouter, useSearchParams } from "next/navigation";
import { ADMIN_DASHBOARD } from "@/routes/AdminPanelRoute";

const LoginPage = () => {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [otpVerificationLoading, setOtpVerificationLoading] = useState(false);
  const [isTypePassword, setIsTypePassword] = useState(true);
  const [otpEmail, setOtpEmail] = useState();

  const formSchema = zodSchema
    .pick({
      email: true,
    })
    .extend({
      password: z.string().min(3, "password is required"),
    });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleLoginSubmit = async (values) => {
    try {
      setLoading(true);
      const { data: loginResponse } = await axios.post(
        "/api/auth/login",
        values
      );

      if (!loginResponse.success) {
        showToast("error", loginResponse.message);
        return;
      }

      setOtpEmail(values.email);
      form.reset();
      showToast("success", loginResponse.message);
    } catch (error) {
      showToast("error", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpVerification = async (values) => {
    try {
      setOtpVerificationLoading(true);
      const { data: otpResponse } = await axios.post(
        "/api/auth/verify-otp",
        values
      );
      if (!otpResponse.success) {
        showToast("error", otpResponse.message);
        return;
      }

      setOtpEmail("");
      showToast("success", otpResponse.message);

      dispatch(login(otpResponse.data));

      if (searchParams.has("callback")) {
        router.push(searchParams.get("callback"));
      } else {
        otpResponse.data.role === "admin"
          ? router.push(ADMIN_DASHBOARD)
          : router.push(USER_DASHBOARD);
      }
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
              <h1 className="text-3xl font-bold">Login Into Account</h1>
              <p>Login into your account by filling out the form below.</p>
            </div>
            <div className="mt-5">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleLoginSubmit)}
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
                  <div className="mb-5">
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem className="relative">
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input
                              type={isTypePassword ? "password" : "text"}
                              placeholder="***********"
                              {...field}
                            />
                          </FormControl>
                          <button
                            className="cursor-pointer absolute top-1/2 right-2"
                            type="button"
                            onClick={() => setIsTypePassword(!isTypePassword)}
                          >
                            {isTypePassword ? <FaRegEyeSlash /> : <FaRegEye />}
                          </button>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div>
                    <ButtonSpinner
                      loading={loading}
                      type="submit"
                      text="Login"
                      className="w-full cursor-pointer"
                    />
                  </div>
                  <div className="text-center">
                    <div className="flex justify-center items-center gap-1">
                      <p>Don't have an account?</p>
                      <Link
                        href={WEBSITE_REGISTER}
                        className="text-primary underline"
                      >
                        Create account
                      </Link>
                    </div>
                    <div className="mt-3">
                      <Link
                        href={WEBSITE_RESETPASSWORD}
                        className="text-primary underline"
                      >
                        Forgot password?
                      </Link>
                    </div>
                  </div>
                </form>
              </Form>
            </div>
          </>
        ) : (
          <>
            <OtpVerification
              email={otpEmail}
              loading={otpVerificationLoading}
              onSubmit={handleOtpVerification}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default LoginPage;
