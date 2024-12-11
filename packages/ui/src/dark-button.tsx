
export const DarkButton = ({children, onClick, size = "small"}: {
  children: React.ReactNode;
  onClick: () => void;
  size?: "small" | "large";
}) => {
  return <div onClick={onClick} className={`bg-purple-700 text-white text-center rounded-full 
    items-center hover:shadow-md cursor-pointer flex flex-col justify-center px-8 py-2 `}>
    {children}
  </div>
}

//0759405494