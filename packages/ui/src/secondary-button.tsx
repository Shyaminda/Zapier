
export const SecondaryButton = ({children, onClick, size = "small"}: {
  children: React.ReactNode;
  onClick: () => void;
  size?: "small" | "large";
}) => {
  return <div onClick={onClick} className={`border text-white rounded-full hover:shadow-md cursor-pointer ${size === "small" ? "text-sm" : "text-lg"} ${size === "small" ? "px-8 pt-2" : "px-10  py-4"} `}>
    {children}   
  </div>   //border-black
}

