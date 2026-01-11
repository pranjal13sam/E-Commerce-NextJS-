import { NextResponse } from "next/server";

export const response = (success, statusCode, message, data = {}) => {
  return NextResponse.json({
    success,
    statusCode,
    message,
    data,
  });
};

export const catchError = (error, customMessage) => {
  //handling duplicate key error:
  if (error.code && error.code === 11000) {
    const duplicateKey = Object.keys(error.keyPattern).join(",");
    error.message = `Duplicate field: ${duplicateKey} already exists. Please use another value.`;
  }

  let errorObj = {};

  if (process.env.NODE_ENV === "development") {
    errorObj = {
      message: error.message,
      error,
    };
  } else {
    errorObj = {
      message: customMessage || "Internal server error",
    };
  }

  return response(false, 500, errorObj.message, errorObj);
};


export const generateOTP=()=>{
  const otp=Math.floor(100000+Math.random()*900000).toString();
  return otp;
}