import Pack4Print from "./Pack4Print";

const Header = () => {
    return (
        <header className="relative flex justify-center select-none bg-secondary">
            <div
                className="flex-grow w-full "
                style={{
                    WebkitMaskImage:
                        "linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)",
                    maskImage:
                        "linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)",
                }}
            >
                <div className="w-full h-full bg-grid-white/[0.05] "></div>
            </div>
            <div className="py-2 md:pt-4 md:pb-5">
                <Pack4Print />
            </div>
            <div
                className="flex-grow w-full pl-2"
                style={{
                    WebkitMaskImage:
                        "linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)",
                    maskImage:
                        "linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)",
                }}
            >
                <div className="w-full h-full bg-grid-white/[0.05]"></div>
            </div>
        </header>
    );
};

export default Header;
