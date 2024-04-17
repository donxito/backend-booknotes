const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Function to fetch and save book cover image from Open Library Covers API.
async function fetchAndSaveCover(isbn) {
    const url = `https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg`; // API URL for book cover with ISBN and size parameter (M).

    try {
        const response = await axios.get(url, { responseType: 'arraybuffer' }); // Fetch book cover image from Open Library Covers API.
        const imagePath = path.join(__dirname, `../public/covers/${isbn}.jpg`); // File path to save the image

        // Write the image data to a file
        fs.writeFileSync(imagePath, response.data);

        console.log(`Book cover image saved for ISBN: ${isbn}`);

        return imagePath; // Return the path to the saved image
    } catch (error) {
        console.log('Error fetching book cover image from Open Library Covers API:', error);
        throw error;
    }
}

// Export the function so it can be used in other modules.
module.exports = { fetchAndSaveCover };
