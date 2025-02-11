document.addEventListener('DOMContentLoaded', () => {
    const recommendationsContainer = document.querySelector('.recommendations-container'); // Element to display recommendations
    
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
            const allRecommendations = [
                ...data.countries.flatMap(country => country.cities),
                ...data.temples,
                ...data.beaches
            ];
            
            // Check if the merged recommendations array is valid
            if (Array.isArray(allRecommendations)) {
                // Iterate through the merged recommendations and display them
                allRecommendations.forEach(place => {
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
                console.error('Expected an array, but received:', allRecommendations);
            }
        })
        .catch(error => {
            console.error('Error fetching the travel recommendations:', error);
        });
});