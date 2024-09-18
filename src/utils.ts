export const clearFileInput = () => {
    // clear value of file input
    const fileInput = document.getElementById("fileInput") as HTMLInputElement;
    if (fileInput) {
        fileInput.value = "";
    }
};
