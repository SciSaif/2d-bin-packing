import { useAppSelector } from '@/redux/hooks'

const PageWidthIndicator = () => {
    const { container } = useAppSelector((state) => state.main)
    return (
        <div className="absolute flex flex-row items-center w-full h-10 -top-12 ">
            <div className="w-full h-[1px] bg-gray-500 relative ">
                <div className="w-[10px] h-[1px] rotate-90 bg-gray-500 absolute -left-[6px]"></div>
            </div>
            <div className="px-2 text-sm text-center select-none whitespace-nowrap ">
                {container.paperSize.name} Paper Width
            </div>
            <div className="w-full h-[1px] bg-gray-500 relative">
                <div className="w-[10px] h-[1px] rotate-90 bg-gray-500 absolute -right-[6px]"></div>
            </div>
        </div>
    )
}

export default PageWidthIndicator