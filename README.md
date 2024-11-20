# 2d bin packing problem (working on an algorithm right now)

## Sources

https://www.intechopen.com/chapters/5850
https://github.com/SebastianBitsch/bin-packing

Pack4Print: The Ultimate Image Packing Solution for Print Optimization

Pack4Print is a powerful, intuitive web app designed to simplify the process of arranging and printing images. Built with advanced technologies including React, TypeScript, Redux, and React Konva, Pack4Print is a Progressive Web App (PWA) that offers a responsive, offline-capable experience. Whether you're printing an assortment of images in various dimensions or need precise arrangements for specific photo sizes, Pack4Print uses a cutting-edge bin-packing algorithm to maximize space usage and minimize paper waste, all while allowing users extensive customization options for layout and output quality.

Key Features of Pack4Print

1. Two Distinct Packing Modes
   Pack4Print offers two modes for different user needs:

Efficient Packing Mode
This mode is ideal for users seeking to optimize page usage and reduce the number of printed pages. In this mode, Pack4Print resizes images according to the selected paper size and automatically arranges them using a sophisticated bin-packing algorithm. This ensures the highest possible packing efficiency, minimizing unused space on each page.

Freeform Mode
Freeform mode gives users full control over the layout of images. Unlike Efficient Packing Mode, it allows for complete freedom in arranging images by hand, including overlapping and rotating images as needed. This mode is perfect for creative or custom layouts where precision and flexibility are more important than minimizing page count.

2. Cross-Mode Features
   Both Efficient Packing and Freeform modes share a range of powerful and convenient features:

Image Resizing
Users can adjust the dimensions of images manually to achieve the ideal fit within the chosen paper size. Pack4Print also offers a selection of preset image sizes (passport, visa, etc.) for easy and accurate resizing.

Drag-and-Drop and Paste Functionality
With drag-and-drop support, users can quickly upload images directly to the workspace. Additionally, Ctrl+V functionality allows images to be pasted directly from the clipboard, making the process faster and more seamless.

Full-Page Preview
Users can preview individual images within the full size of the selected paper (e.g., A4) to assess their relative scale before finalizing the layout.

Cropping Tools
Pack4Print offers multiple cropping presets, so users can quickly and easily tailor images to fit specific ratios or dimensions.

Image Duplication
Users can make copies of images to replicate layouts or print multiple versions of the same image on a page.

Borders and Margins
Customizable borders can be added to images to enhance presentation, while margins around the paper provide space for framing or binding.

Paper Size Selection
Choose from a variety of common paper sizes (A4, letter, etc.) to tailor the final layout to your specific needs.

PDF Export and Print Options
Users can save the finalized layout as a PDF for easy sharing or future use. Direct print functionality is also available for desktop users, allowing them to print their layouts directly from Pack4Print.

3. Features Exclusive to Freeform Mode
   Image Movement
   In Freeform mode, images can be freely moved across the workspace, with no restrictions on positioning. This allows for overlapping images or custom compositions that require precise manual adjustments.

Rotation
Rotate images to fit within custom layouts or achieve the desired visual orientation.

4. Features Exclusive to Efficient Packing Mode
   Packing Efficiency Control
   Efficient Packing Mode offers a “packing efficiency” setting, allowing users to balance quality and speed. When there are many images to arrange, users can lower the efficiency to speed up processing, with the trade-off of potentially more pages or less compact arrangements.

Algorithm Selection
Two algorithms are available in Efficient Packing Mode:

Efficient Algorithm: Maximizes space usage through advanced bin-packing logic, taking anywhere from seconds to a few minutes depending on the complexity and number of images.
Simple Algorithm: Arranges images in a straightforward row-by-row format, ideal for users who need quick results or are printing multiple images of the same size.
Margin Customization
Adjust the margins on all sides (top, bottom, left, and right) to create a well-spaced layout that suits printing needs.

Padding Between Images
Add padding to ensure images aren’t crowded together, allowing for cleaner visual separation or space for cutting if needed.

Technology Highlights
Progressive Web App (PWA): Offline functionality ensures users can access and work on layouts even without an internet connection.
Custom Drag-and-Drop Interface: Designed for ease of use, enabling rapid image uploads.
Image Resizing Logic: Tailors images to paper dimensions or user specifications, ensuring efficient packing.
React Konva Rendering: Provides a responsive, high-quality visual display of layouts.
Efficient-Rect-Packer Integration: A custom npm package that applies an optimized bin-packing algorithm for layout efficiency.
Pack4Print is an all-in-one solution for anyone needing a powerful, customizable tool for preparing images for print. Whether you’re aiming to save paper, create custom layouts, or both, Pack4Print’s intuitive interface and extensive features offer flexibility and precision for every print job.
