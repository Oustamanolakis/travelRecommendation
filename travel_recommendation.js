document.addEventListener('DOMContentLoaded', () => {
    const recommendationsContainer = document.querySelector('.recommendations-container'); // Element to display recommendations
    const searchInput = document.querySelector('#search');
    const searchButton = document.querySelector('#btnSearch');
    const resetButton = document.querySelector('#btnReset');

    // Fetch data from the API
    fetch('./travel_recommendation_api.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json(); // Parse JSON data
        })
        .then(data => {
            console.log(data); // Log the fetched data to check its structure
            
            // Accessing all categories from the data
            const allRecommendations = {
                countries: data.countries.flatMap(country => country.cities),
                temples: data.temples,
                beaches: data.beaches
            };

            // Function to display results
            function displayResults(results) {
                recommendationsContainer.innerHTML = ''; // Clear previous results
                if (results.length > 0) {
                    results.forEach(place => {
                        const placeElement = document.createElement('div');
                        placeElement.classList.add('recommendation-item');
                        
                        // Create the HTML structure for each recommendation
                        placeElement.innerHTML = `
                            <img src="${place.imageUrl || 'default_image.jpg'}" alt="${place.name}" class="recommendation-image">
                            <h3 class="recommendation-name">${place.name}</h3>
                            <p class="recommendation-description">${place.description}</p>
                        `;
                        
                        // Append the created element to the container
                        recommendationsContainer.appendChild(placeElement);
                    });
                } else {
                    recommendationsContainer.innerHTML = '<p>No results found for your search.</p>';
                }
            }

            // Display default recommendations (all categories combined)
            displayResults([
                ...allRecommendations.beaches,
                ...allRecommendations.temples,
                ...allRecommendations.countries
            ]);

            // Search functionality: Filtering recommendations based on keyword
            function searchKeyword(keyword) {
                const lowerKeyword = keyword.toLowerCase(); // Make the search case-insensitive
                
                let results = [];
                
                // Check the entered keyword and filter by category (beach, temple, country)
                if (lowerKeyword === 'beach') {
                    results = allRecommendations.beaches.slice(0, 2); // Show at least 2 beaches
                } else if (lowerKeyword === 'temple') {
                    results = allRecommendations.temples.slice(0, 2); // Show at least 2 temples
                } else if (lowerKeyword === 'country') {
                    results = allRecommendations.countries.slice(0, 2); // Show at least 2 countries or cities
                } else {
                    recommendationsContainer.innerHTML = '<p>No results found for this keyword.</p>';
                    return;
                }

                displayResults(results); // Display the filtered results
            }

            // Event listener for search button click
            searchButton.addEventListener('click', (e) => {
                e.preventDefault(); // Prevent form submission
                const keyword = searchInput.value.trim();
                if (keyword) {
                    searchKeyword(keyword); // Call the search function with the entered keyword
                } else {
                    recommendationsContainer.innerHTML = '<p>Please enter a keyword to search.</p>';
                }
            });

            // Event listener for reset button click
            resetButton.addEventListener('click', () => {
                searchInput.value = ''; // Clear the search input field
                displayResults([
                    ...allRecommendations.beaches,
                    ...allRecommendations.temples,
                    ...allRecommendations.countries
                ]); // Reset to showing all recommendations
            });
        })
        .catch(error => {
            console.error('Error fetching the travel recommendations:', error);
        });
});