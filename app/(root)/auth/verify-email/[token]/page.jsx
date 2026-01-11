"use client"
import { Card, CardContent } from "@/components/ui/card";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { use } from "react";
import verifiedImg from "@/public/assets/images/verified.gif";
import verificationFailedImg from "@/public/assets/images/verification-failed.gif";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { WEBSITE_HOME } from "@/routes/ApplicationRoute";

const EmailVerification = ({ params }) => {
  const { token } = use(params);
  const [isVerfied, setIsVerified] = useState(false);

  useEffect(() => {
    const verify = async () => {
      const { data: verificationResponse } = await axios.post(
        "/api/auth/verify-email",
        { token }
      );
      if (verificationResponse.success) {
        setIsVerified(true);
      }
    };
    verify();
  }, [token]);
  return (
    <div>
      <Card className="w-100">
        <CardContent>
          {isVerfied ? (
            <div>
              <div className="flex items-center justify-center">
                <Image
                  src={verifiedImg.src}
                  height={verifiedImg.height}
                  width={verifiedImg.width}
                    className="h-40 w-auto"
                    alt="verification-success"
                />
              </div>
              <div className="text-center">
                <h1 className="text-2xl font-bold my-5 text-green-500">
                  Email Verification Success
                </h1>
                <Button asChild>
                  <Link href={WEBSITE_HOME}>Continue Shopping</Link>
                </Button>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-center">
                <Image
                  src={verificationFailedImg.src}
                  height={verificationFailedImg.height}
                  width={verificationFailedImg.width}
                  className="h-40 w-auto"
                  alt="verification-failed"
                />
              </div>
              <div className="text-center">
                <h1 className="text-2xl font-bold my-5 text-red-500">
                  Email Verification Failed!
                </h1>
                <Button asChild>
                  <Link href={WEBSITE_HOME}>Continue Shopping</Link>
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailVerification;
