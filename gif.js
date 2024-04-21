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

let loadingMore = false;

// Function to load GIFs
const loadGIFs = async (q, offset) => {
    const gifCount = 10; // Number of GIFs to load
    const apiUrl = `https://api.giphy.com/v1/gifs/search?api_key=${apikey}&q=${q}&limit=${gifCount}&offset=${offset}&rating=g&lang=en`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
};

// Function to load more GIFs
const loadMoreGIFs = async () => {
    loadingMore = true;
    const offset = document.querySelectorAll('.container').length; // Calculate offset based on already loaded GIFs
    const q = document.getElementById("search-box").value;

    try {
        const gifsData = await loadGIFs(q, offset);
        gifsData.forEach((gif) => {
            // Generate cards for every GIF
            const container = document.createElement("div");
            container.classList.add("container");
            const iframe = document.createElement("img");
            iframe.setAttribute("src", gif.images.downsized_medium.url);
            container.appendChild(iframe);

            // Copy link button
            const copyBtn = document.createElement("button");
            copyBtn.innerText = "Copy Link";
            copyBtn.onclick = () => copyLinkAndDownload(gif.images.downsized_medium.url);
            container.appendChild(copyBtn);

            document.querySelector(".wrapper").appendChild(container);
        });
        loadingMore = false;
    } catch (error) {
        console.error('Error loading more GIFs:', error);
    }
};

// Generate GIFs when user clicks on submit
submitBtn.addEventListener("click", async () => {
    // Show loader while fetching data
    const loader = document.querySelector(".loader");
    loader.style.display = "block";
    document.querySelector(".wrapper").style.display = "none";
    document.getElementById("footer").style.display = "none";

    // Get search value (default => laugh)
    const q = document.getElementById("search-box").value;
    document.querySelector(".wrapper").innerHTML = "";

    try {
        const gifsData = await loadGIFs(q, 0);
        gifsData.forEach((gif) => {
            // Generate cards for every GIF
            const container = document.createElement("div");
            container.classList.add("container");
            const iframe = document.createElement("img");
            iframe.setAttribute("src", gif.images.downsized_medium.url);
            container.appendChild(iframe);

            // Copy link button
            const copyBtn = document.createElement("button");
            copyBtn.innerText = "Copy Link";
            copyBtn.onclick = () => copyLinkAndDownload(gif.images.downsized_medium.url);
            container.appendChild(copyBtn);

            document.querySelector(".wrapper").appendChild(container);
        });
        // If all GIFs have loaded, then hide loader and display GIFs UI
        loader.style.display = "none";
        document.querySelector(".wrapper").style.display = "grid";
        showFooter();
    } catch (error) {
        console.error('Error fetching data:', error);
        // Handle error (e.g., display a message to the user)
    }
});

// Dark mode toggle event listener
document.getElementById("darkModeToggle").addEventListener("change", toggleDarkMode);

// Track scroll position to trigger lazy loading
window.addEventListener('scroll', () => {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
        // When user reaches the bottom of the page, load more GIFs
        if (!loadingMore) { // Ensure not loading more already
            loadMoreGIFs();
        }
    }
});
