const About = () => {
    return (
        <main className="flex flex-col pb-10 gap-2 px-4 py-4 mx-auto max-w-[800px] mt-10">
            <h1 className="mb-4 text-3xl font-semibold">About pack4print</h1>
            <p className="mb-6 text-gray-700">
                Welcome to pack4print – your go-to solution for efficient image
                packing onto paper! We understand the importance of optimizing
                resources and minimizing waste, and that's exactly what
                pack4print aims to achieve. Our app utilizes a powerful bin
                packing algorithm to intelligently arrange your images on paper,
                ensuring the minimum number of pages required for printing.
            </p>

            <h2 className="mb-4 text-xl font-semibold">
                How to Use pack4print:
            </h2>
            <ol className="ml-6 list-decimal">
                <li className="mb-2">
                    <strong>Uploading Images:</strong>
                    <ul className="ml-6 list-disc">
                        <li>
                            Drag and Drop: Simply drag and drop your images into
                            the designated area.
                        </li>
                        <li>
                            Click to Upload: Click anywhere inside the drop area
                            to manually select and upload images.
                        </li>
                        <li>
                            Ctrl + V: Paste images directly for quick uploading.
                        </li>
                    </ul>
                </li>
                <li className="mb-2">
                    <strong>Image Resizing and Customization:</strong>
                    <ul className="ml-6 list-disc">
                        <li>
                            Upon uploading, your images will be displayed in a
                            resizing window with the width equal to the paper
                            size.
                        </li>
                        <li>
                            Click on an image to activate resizing handles at
                            the bottom right corner.
                        </li>
                        <li>
                            Drag the handles to resize the image according to
                            your preference.
                        </li>
                    </ul>
                </li>
                <li className="mb-2">
                    <strong>Customization Options:</strong>
                    <ul className="ml-6 list-disc">
                        <li>
                            Adjust image sizes relative to paper dimensions.
                        </li>
                        <li>
                            Set padding between images for better aesthetics.
                        </li>
                        <li>
                            Define page margins to suit your printing needs.
                        </li>
                        <li>Add borders to images for a polished look.</li>
                    </ul>
                </li>
                <li className="mb-2">
                    <strong>Initial Image Size:</strong> Specify the initial
                    maximum size of images relative to the paper when first
                    uploaded.
                </li>
                <li className="mb-2">
                    <strong>Efficient Packing:</strong> Click on "Start Packing"
                    to let our efficient algorithm arrange the images on paper.
                    View the optimized layout and make adjustments as needed.
                </li>
                <li className="mb-2">
                    <strong>Download and Print:</strong> Once satisfied,
                    download the layout as a PDF or print it directly.
                </li>
                <li className="mb-2">
                    <strong>Update and Refine:</strong> Use the "Resize Images"
                    button to make further adjustments. Click on "Start Packing"
                    again to generate a new packing based on your updates.
                </li>
            </ol>

            <p className="mt-6 text-gray-700">
                At pack4print, we believe in simplicity and effectiveness. Our
                goal is to provide you with a user-friendly experience while
                maximizing the efficiency of your printing projects. Feel free
                to explore the customization options and enjoy the benefits of
                intelligent image packing!
            </p>
        </main>
    );
};

export default About;
