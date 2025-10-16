import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
  size?: "small" | "medium" | "large";
}

const Button = ({
  variant = "primary",
  size = "medium",
  className,
  children,
  ...rest
}: ButtonProps) => {
  const baseStyles = "rounded-md font-semibold transition-colors";
  const variantStyles = {
    primary: "bg-blue-500 text-white hover:bg-blue-600",
    secondary: "bg-gray-500 text-white hover:bg-gray-600",
    danger: "bg-red-500 text-white hover:bg-red-600",
  };
  const sizeStyles = {
    small: "px-2 py-1 text-sm",
    medium: "px-4 py-2",
    large: "px-6 py-3 text-lg",
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${
        className ?? ""
      }`}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
