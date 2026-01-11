import React from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

const ButtonSpinner = ({ type, text, loading, className, onClick, ...props }) => {
  return (
    <Button type={type} disabled={loading}
     onClick={onClick}
     className={cn("",className)}
      {...props}>
      {loading && <Spinner />}
      {text}
    </Button>
  );
};

export default ButtonSpinner;
