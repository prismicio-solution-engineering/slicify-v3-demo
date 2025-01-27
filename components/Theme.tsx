import clsx from "clsx";
import BackgroundImage from "./BackgroundImage";

export const ThemeContainer = ({
  children,
  theme,
  className,
}: {
  children: React.ReactNode;
  theme: "Blue" | "Dark" | "Light" | "White";
  className?: string;
}) => {
  const themeColor = theme === "Blue" || theme === "Dark" ? "dark" : "light";

  className = clsx(
    `relative isolate overflow-hidden ${
      themeColor === "dark" ? "bg-dark-blue" : "bg-white"
    }`,
    className
  );

  return (
    <div className={className}>
      {(theme === "Blue" || theme === "Light") && (
        <BackgroundImage theme={theme} />
      )}
      {children}
    </div>
  );
};