const apikey = "HQIA0tx0Oao3W4j0cJXowbAJiSIVSqZg"; // Your API key

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
    const downloadAnchor = document.createElement("a");
    downloadAnchor.href = url;
    downloadAnchor.setAttribute("download", "giphy.gif");
    document.body.appendChild(downloadAnchor);
    alert("GIF link copied to clipboard and downloading started.");
    downloadAnchor.click();
    document.body.removeChild(downloadAnchor);
};

const showFooter = () => {
    document.getElementById("footer").style.display = "block";
};

let submitBtn = document.getElementById("submit-btn");

let generateGif = () => {
    // Show loader while fetching data
    const loader = document.querySelector(".loader");
    loader.style.display = "block";
    document.querySelector(".wrapper").style.display = "none";
    document.getElementById("footer").style.display = "none";

    // Get search value (default => laugh)
    let q = document.getElementById("search-box").value;
    // We need 10 GIFs to be displayed in result
    let gifCount = 10;
    // API URL
    let finalURL = `https://api.giphy.com/v1/gifs/search?api_key=${apikey}&q=${q}&limit=${gifCount}&offset=0&rating=g&lang=en`;
    document.querySelector(".wrapper").innerHTML = "";

    // Make a call to API
    fetch(finalURL)
        .then((resp) => resp.json())
        .then((info) => {
            console.log(info.data);
            // All GIFs
            let gifsData = info.data;
            gifsData.forEach((gif) => {
                // Generate cards for every GIF
                let container = document.createElement("div");
                container.classList.add("container");
                let iframe = document.createElement("img");
                console.log(gif);
                iframe.setAttribute("src", gif.images.downsized_medium.url);
                iframe.onload = () => {
                    // If iframe has loaded correctly, reduce the count when each GIF loads
                    gifCount--;
                    if (gifCount == 0) {
                        // If all GIFs have loaded, then hide loader and display GIFs UI
                        loader.style.display = "none";
                        document.querySelector(".wrapper").style.display = "grid";
                        showFooter();
                    }
                };
                container.append(iframe);

                // Copy link button
                let copyBtn = document.createElement("button");
                copyBtn.innerText = "Copy Link";
                copyBtn.onclick = () => copyLinkAndDownload(gif.images.downsized_medium.url);
                container.append(copyBtn);

                document.querySelector(".wrapper").appendChild(container);
            });
        })
        .catch((error) => {
            console.error('Error fetching data:', error);
            // Handle error (e.g., display a message to the user)
        });
};

// Generate GIFs when user clicks on submit
submitBtn.addEventListener("click", generateGif);

// Dark mode toggle event listener
document.getElementById("darkModeToggle").addEventListener("change", toggleDarkMode);
