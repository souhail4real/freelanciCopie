/**
 * FreeLanci.ma - Search Module
 * Handles search functionality
 */

import { searchFreelancersApi } from './api.js';
import { displaySearchResults } from './render.js';

/**
 * Performs search and displays results
 * @param {string} query The search query
 */
export async function performSearch(query) {
    // Show loading spinner
    const loadingSpinner = document.getElementById('loading-spinner');
    if (loadingSpinner) {
        loadingSpinner.classList.remove('hidden');
    }
    
    try {
        // Search for freelancers
        const results = await searchFreelancersApi(query);
        displaySearchResults(results);
    } catch (error) {
        console.error('Search error:', error);
    } finally {
        // Hide loading spinner
        if (loadingSpinner) {
            loadingSpinner.classList.add('hidden');
        }
    }
    
    // Scroll to results
    const searchResults = document.getElementById('search-results');
    if (searchResults) {
        searchResults.scrollIntoView({ behavior: 'smooth' });
    }
}

/**
 * Clears search results and shows main content
 */
export function clearSearch() {
    const searchResults = document.getElementById('search-results');
    const freelancerContainer = document.getElementById('freelancer-container');
    const searchInput = document.getElementById('hero-search-input');
    
    if (searchResults) searchResults.classList.add('hidden');
    if (freelancerContainer) freelancerContainer.classList.remove('hidden');
    if (searchInput) searchInput.value = '';
}