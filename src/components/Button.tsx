import type { ReactNode } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "success" | "ghost";
  children: ReactNode;
}

const variants = {
  primary:
    "cursor-pointer bg-black text-white shadow-sm hover:bg-neutral-800 active:bg-neutral-900 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black disabled:cursor-not-allowed disabled:bg-neutral-200 disabled:text-neutral-400 disabled:shadow-none disabled:active:scale-100",
  secondary:
    "cursor-pointer border border-neutral-300 bg-white text-black shadow-sm hover:border-black hover:bg-neutral-50 active:bg-neutral-100 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black disabled:cursor-not-allowed disabled:border-neutral-200 disabled:text-neutral-400 disabled:shadow-none disabled:active:scale-100",
  danger:
    "cursor-pointer border border-red-600 bg-red-600 text-white shadow-sm hover:bg-red-700 hover:border-red-700 active:bg-red-800 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 disabled:cursor-not-allowed disabled:border-red-200 disabled:bg-red-100 disabled:text-red-300 disabled:shadow-none disabled:active:scale-100",
  success:
    "cursor-pointer border border-emerald-600 bg-emerald-600 text-white shadow-sm hover:bg-emerald-700 hover:border-emerald-700 active:bg-emerald-800 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 disabled:cursor-not-allowed disabled:border-emerald-200 disabled:bg-emerald-100 disabled:text-emerald-400 disabled:shadow-none disabled:active:scale-100",
  ghost:
    "cursor-pointer text-black hover:bg-neutral-100 active:bg-neutral-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black disabled:cursor-not-allowed disabled:text-neutral-400 disabled:active:bg-transparent",
};

export function Button({
  variant = "primary",
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-all duration-150 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
