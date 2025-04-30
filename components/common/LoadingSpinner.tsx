interface LoadingSpinnerProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "h-8 w-8",
  md: "h-12 w-12",
  lg: "h-16 w-16",
};

export function LoadingSpinner({
  className = "",
  size = "md",
}: LoadingSpinnerProps) {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div
        className={`animate-spin rounded-full border-t-2 border-b-2 border-primary ${sizeClasses[size]} ${className}`}
      ></div>
    </div>
  );
}
