/**
 * FreeLanci.ma - Rendering Module
 * Contains all UI rendering functions
 */

import { state, categoryDisplayNames } from './config.js';
import { loadCategoryData } from './api.js';
import { toggleFavorite, updateMetadataDisplay } from './utils.js';

/**
 * Renders freelancers based on selected category and page
 * @param {string} category The category to render
 * @param {number} page The page number
 */
export async function renderFreelancers(category, page = 1) {
    // Get the container for freelancers
    const container = document.getElementById('freelancer-container');
    const loadingSpinner = document.getElementById('loading-spinner');
    
    if (!container) {
        console.error("Freelancer container not found in DOM");
        return;
    }
    
    // Show loading spinner
    if (loadingSpinner) {
        loadingSpinner.classList.remove('hidden');
    }
    
    // Clear the container
    container.innerHTML = '';
    
    try {
        // If we don't have data for this category yet, load it from API
        if (!state.freelancerData[category] || state.freelancerData[category].length === 0) {
            await loadCategoryData(category);
        }
        
        // Get freelancers for the selected category
        const freelancers = state.freelancerData[category] || [];
        
        // Update current category and page
        state.currentCategory = category;
        state.currentPage = page;

        if (freelancers.length === 0) {
            container.innerHTML = '<p class="text-center col-span-full py-8">No freelancers found in this category.</p>';
        } else {
            // Calculate start and end indices for pagination
            const startIndex = (page - 1) * state.freelancersPerPage;
            const endIndex = startIndex + state.freelancersPerPage;
            const paginatedFreelancers = freelancers.slice(startIndex, endIndex);

            // Render each freelancer card
            container.innerHTML = paginatedFreelancers.map(freelancer => renderFreelancerCard(freelancer)).join('');

            // Render pagination controls
            renderPaginationControls(freelancers.length, page);
        }

        // Update the metadata display
        updateMetadataDisplay();
    } catch (error) {
        console.error('Error rendering freelancers:', error);
        container.innerHTML = '<p class="text-center col-span-full py-8 text-red-500">Error loading freelancer data. Please try again later.</p>';
    } finally {
        // Hide loading spinner
        if (loadingSpinner) {
            loadingSpinner.classList.add('hidden');
        }
    }
}

/**
 * Renders a single freelancer card
 * @param {Object} freelancer The freelancer data
 * @returns {string} HTML for the freelancer card
 */
export function renderFreelancerCard(freelancer) {
    return `
        <div class="freelancer-card bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer">
            <a href="${freelancer.profile_link}" target="_blank" class="block">
                <div class="relative">
                    <img src="${freelancer.profile_image}" alt="${freelancer.username}" class="w-full h-48 object-cover">
                    <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                        <h3 class="text-white font-semibold text-xl">${freelancer.username}</h3>
                    </div>
                </div>
                <div class="p-4">
                    <div class="flex items-center mb-2">
                        <div class="flex text-yellow-400">
                            ${renderStars(freelancer.rating)}
                        </div>
                        <span class="ml-2 text-gray-600">${freelancer.rating} (${freelancer.reviews} reviews)</span>
                    </div>
                    <p class="text-gray-700">${freelancer.short_description}</p>
                    <div class="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                        <span class="text-green-600 font-semibold">Starting at $${freelancer.price}</span>
                        <button class="text-green-600 hover:text-green-700" onclick="event.stopPropagation(); window.app.toggleFavorite(this);">
                            <i class="far fa-heart"></i>
                        </button>
                    </div>
                </div>
            </a>
        </div>
    `;
}

/**
 * Renders star ratings
 * @param {number|string} rating The rating value 
 * @returns {string} HTML for the star ratings
 */
export function renderStars(rating) {
    const stars = [];
    const fullStars = Math.floor(parseFloat(rating));
    const hasHalfStar = parseFloat(rating) % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
        stars.push('<i class="fas fa-star"></i>');
    }
    
    if (hasHalfStar) {
        stars.push('<i class="fas fa-star-half-alt"></i>');
    }
    
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
        stars.push('<i class="far fa-star"></i>');
    }
    
    return stars.join('');
}

/**
 * Renders pagination controls
 * @param {number} totalFreelancers Total number of freelancers
 * @param {number} currentPage Current page number
 */
export function renderPaginationControls(totalFreelancers, currentPage) {
    const paginationContainer = document.getElementById('pagination-container');
    if (!paginationContainer) return;
    
    const totalPages = Math.ceil(totalFreelancers / state.freelancersPerPage);
    paginationContainer.innerHTML = '';

    if (totalPages > 1) {
        for (let i = 1; i <= totalPages; i++) {
            const button = document.createElement('button');
            button.textContent = i;
            button.className = `pagination-button ${i === currentPage ? 'active' : ''}`;
            button.addEventListener('click', () => renderFreelancers(state.currentCategory, i));
            paginationContainer.appendChild(button);
        }
    }
}

/**
 * Displays search results
 * @param {Array} results The search results
 */
export function displaySearchResults(results) {
    const resultsContainer = document.getElementById('search-results-container');
    const searchResultsSection = document.getElementById('search-results');
    
    if (!resultsContainer || !searchResultsSection) {
        console.error("Search results containers not found in DOM");
        return;
    }
    
    if (results.length === 0) {
        resultsContainer.innerHTML = '<p class="text-center col-span-full py-8">No freelancers found matching your search.</p>';
    } else {
        resultsContainer.innerHTML = results.map(freelancer => renderFreelancerCard(freelancer)).join('');
    }
    
    searchResultsSection.classList.remove('hidden');
    document.getElementById('freelancer-container').classList.add('hidden');
}

/**
 * Displays filtered results
 * @param {Array} results The filtered results
 * @param {Array} activeFilters Active filters
 */
export function displayFilteredResults(results, activeFilters = []) {
    const container = document.getElementById('freelancer-container');
    const paginationContainer = document.getElementById('pagination-container');
    const filterTagsContainer = document.getElementById('active-filter-tags');
    
    if (!container) {
        console.error("Freelancer container not found in DOM");
        return;
    }
    
    // Hide pagination when showing filtered results
    if (paginationContainer) paginationContainer.innerHTML = '';
    
    // Display active filter tags if container exists
    if (filterTagsContainer) {
        filterTagsContainer.innerHTML = '';
        
        if (activeFilters.length > 0) {
            filterTagsContainer.classList.remove('hidden');
            
            // Add filter tags
            activeFilters.forEach(filter => {
                const tag = document.createElement('span');
                tag.className = 'filter-tag';
                
                let tagText = '';
                let tagClass = '';
                
                switch(filter.type) {
                    case 'category':
                        tagText = `Category: ${categoryDisplayNames[filter.value] || filter.value}`;
                        tagClass = 'bg-blue-100 text-blue-800';
                        break;
                    case 'min-price':
                        tagText = filter.value;
                        tagClass = 'bg-green-100 text-green-800';
                        break;
                    case 'max-price':
                        tagText = filter.value;
                        tagClass = 'bg-green-100 text-green-800';
                        break;
                    case 'skill':
                        tagText = filter.value;
                        tagClass = 'bg-purple-100 text-purple-800';
                        break;
                    default:
                        tagText = filter.value;
                        tagClass = 'bg-gray-100 text-gray-800';
                }
                
                tag.innerHTML = `
                    <span class="px-2 py-1 rounded-full text-xs font-medium ${tagClass}">
                        ${tagText}
                        <button class="ml-1 text-xs filter-tag-remove" data-filter-type="${filter.type}" data-filter-value="${filter.value}">
                            <i class="fas fa-times"></i>
                        </button>
                    </span>
                `;
                
                filterTagsContainer.appendChild(tag);
            });
            
            // Add clear all button if there are filters
            const clearAllBtn = document.createElement('button');
            clearAllBtn.className = 'ml-2 text-xs text-gray-500 hover:text-gray-700';
            clearAllBtn.innerHTML = 'Clear all';
            clearAllBtn.addEventListener('click', () => {
                document.getElementById('price-min').value = '';
                document.getElementById('price-max').value = '';
                document.getElementById('category-filter').value = '';
                document.getElementById('skills-filter').value = '';
                renderFreelancers(state.currentCategory);
            });
            filterTagsContainer.appendChild(clearAllBtn);
            
            // Add event listeners to tag remove buttons
            document.querySelectorAll('.filter-tag-remove').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    const filterType = btn.getAttribute('data-filter-type');
                    const filterValue = btn.getAttribute('data-filter-value');
                    
                    // Import dynamically to avoid circular dependencies
                    import('./filters.js').then(module => {
                        module.removeFilter(filterType, filterValue);
                    });
                });
            });
        } else {
            filterTagsContainer.classList.add('hidden');
        }
    }
    
    if (results.length === 0) {
        container.innerHTML = '<p class="text-center col-span-full py-8">No freelancers match your filters. Try adjusting your criteria.</p>';
    } else {
        container.innerHTML = results.map(freelancer => renderFreelancerCard(freelancer)).join('');
    }
    
    // Show the number of results
    const resultsCount = document.createElement('div');
    resultsCount.className = 'text-center col-span-full mt-4 text-gray-600';
    resultsCount.innerHTML = `<p>${results.length} freelancer${results.length !== 1 ? 's' : ''} found</p>`;
    container.prepend(resultsCount);
    
    // Make sure the container is visible
    container.classList.remove('hidden');
    
    const searchResults = document.getElementById('search-results');
    if (searchResults) searchResults.classList.add('hidden');
}

/**
 * Formats API response for team builder display
 * @param {Object} data - The API response data
 * @returns {string} Formatted HTML
 */
export function formatResponse(data) {
    if (!data || typeof data !== 'object') {
        return '<p>Invalid response received</p>';
    }
    
    let html = '<div class="response-content">';
    
    if (data.team) {
        html += '<h3 class="text-lg font-semibold mb-3">Recommended Team</h3>';
        html += '<ul class="space-y-3">';
        
        data.team.forEach(member => {
            html += `
                <li class="bg-white p-3 rounded shadow">
                    <div class="font-medium">${member.name}</div>
                    <div class="text-sm text-gray-600">${member.role}</div>
                    <div class="text-xs text-gray-500">${member.skills}</div>
                </li>
            `;
        });
        
        html += '</ul>';
    } else {
        html += '<p>No team recommendations available.</p>';
    }
    
    html += '</div>';
    return html;
}