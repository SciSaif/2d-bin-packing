import React from "react";

const Footer = () => {
    return (
        <footer className="flex flex-col items-center justify-between px-10 mt-10 border-t md:flex-row ">
            <div className="text-sm text-center text-gray-500">
                <p>
                    Made with{" "}
                    <span role="img" aria-label="heart">
                        ❤️
                    </span>{" "}
                    by saifullah rahman (sciSaif)
                </p>
            </div>
            <p className="text-sm text-gray-500">
                Contact: saiflll284@gmail.com
            </p>
        </footer>
    );
};

export default Footer;
