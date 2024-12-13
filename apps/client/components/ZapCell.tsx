
export const ZapCell = ({
    name,
    index,
    onClick,
    image,
}: {
    name?: string;
    index?: number;
    onClick?: () => void;
    image?: string;
}) => {
    return <div onClick={onClick} className="border border-black text-black py-8 px-12 flex max-[300px] justify-center 
        cursor-pointer">
        <div className="flex text-xl items-center">
            {/* <div className="font-bold">
                {index}.
            </div>
            <div>
                {image && <img src={image} className="w-9 h-39 rounded-lg"/>}
            </div> */}
            <div className="pr-2">
                {image ? (
                    <img src={image} alt={name} className="w-7 h-5 rounded-lg" />
                ) : (
                    <div className="font-bold">{index}.</div>
                )}
            </div>
            <div>
                {name}
            </div>
        </div>
    </div>
}