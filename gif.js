// Function to toggle dark mode
const toggleDarkMode = () => {
    const darkModeToggle = document.getElementById("darkModeToggle");
    const body = document.body;
    if (darkModeToggle.checked) {
        body.classList.add("dark-mode");
    } else {
        body.classList.remove("dark-mode");
    }
};

// Function to copy link and download GIF
const copyLinkAndDownload = (url) => {
    // Create a hidden anchor element
    const downloadAnchor = document.createElement("a");
    downloadAnchor.href = url;
    downloadAnchor.setAttribute("download", "giphy.gif");
    document.body.appendChild(downloadAnchor);
    // Trigger click event on the anchor element
    downloadAnchor.click();
    // Remove the anchor element
    document.body.removeChild(downloadAnchor);
    // Show confirmation message
    alert("GIF link copied to clipboard and downloading started.");
};
const showFooter = () => {
    document.getElementById("footer").style.display = "block";
};

// Function to generate GIFs
const generateGif = () => {
    // Display loader until GIFs load
    const loader = document.querySelector(".loader");
    loader.style.display = "block";
    document.querySelector(".wrapper").style.display = "none";
    document.getElementById("footer").style.display = "none"; 

    // Get search value (default => laugh)
    const q = document.getElementById("search-box").value;
    // We need 15 GIFs to be displayed in result
    const gifCount = 15;
    // API URL
    const finalURL = `http://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC&tag=+q, true`;
    document.querySelector(".wrapper").innerHTML = "";

    // Make a call to API
    fetch(finalURL)
        .then((resp) => resp.json())
        .then((info) => {
            // All GIFs
            const gifsData = info.data;
            if (gifsData.length === 0) {
                // If no GIFs found, display predefined GIFs
                document.querySelector(".wrapper").style.display = "grid";
                loader.style.display = "none";
                showFooter();
            } else {
                gifsData.forEach((gif) => {
                    // Generate cards for every GIF
                    const container = document.createElement("div");
                    container.classList.add("container");
                    const img = document.createElement("img");
                    img.src = gif.images.downsized_medium.url;
                    container.appendChild(img);

                    // Copy link and download button
                    const copyDownloadBtn = document.createElement("button");
                    copyDownloadBtn.classList.add("btn", "btn-primary", "btn-sm", "mt-2", "copy-download-btn");
                    copyDownloadBtn.innerText = "Copy Link & Download";
                    copyDownloadBtn.dataset.url = gif.images.original.url;
                    copyDownloadBtn.onclick = () => copyLinkAndDownload(copyDownloadBtn.dataset.url);
                    container.appendChild(copyDownloadBtn);

                    document.querySelector(".wrapper").appendChild(container);
                });
                loader.style.display = "none"; 
                showFooter(); 
            }
        });
};

document.getElementById("submit-btn").addEventListener("click", generateGif);
document.getElementById("darkModeToggle").addEventListener("change", toggleDarkMode);
