
export const PrimaryButton = ({children, onClick, size = "small"}: {
  children: React.ReactNode;
  onClick: () => void;
  size?: "small" | "large";
}) => {
  return <div onClick={onClick} className={`bg-amber-700 text-white text-center rounded-full items-center hover:shadow-md cursor-pointer ${size === "small" ? "text-sm" : "text-lg"} ${size === "small" ? "px-8 pt-1.5" : "px-10  py-4"} `}>
    {children}
  </div>
}
