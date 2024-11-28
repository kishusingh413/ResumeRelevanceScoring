import * as React from "react";

import logo from "../assets/icons/logo.svg";
import { cva, type VariantProps } from "class-variance-authority";

const loadingVariants = cva(
  [
    "fixed",
    "inset-0",
    "bg-black",
    "bg-opacity-20",
    "flex",
    "flex-col",
    "items-center",
    "justify-center",
    "z-50"
  ],
  {
    variants: {
      size: {
        full: "w-full h-full",
      },
    },
    defaultVariants: {
      size: "full",
    },
  }
);

interface LoadingProps extends VariantProps<typeof loadingVariants> {
  className?: string;
}

const Loading: React.FC<LoadingProps> = ({ className }) => {
  return (
    <div className={`${loadingVariants()} ${className}`}>
      <div className="flex justify-center items-center">
        <img src={logo} alt="loading" className="animate-bounce w-14 h-14" />
      </div>
      <div className="mt-4 text-white text-xl font-medium">Loading ...</div>
    </div>
  );
};

export { Loading };
