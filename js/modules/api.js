/**
 * FreeLanci.ma - API Module
 * Handles all data loading and API communication
 */

import { state } from './config.js';

/**
 * Loads freelancer data from the database via API
 * @returns {Promise<Object>} The loaded freelancer data
 */
export async function loadFreelancerData() {
    try {
        const response = await fetch('api/get_freelancers.php?action=all');
        
        if (!response.ok) {
            throw new Error(`Failed to load freelancer data: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // Update metadata from database
        if (data.metadata) {
            state.metaData.lastUpdated = data.metadata.last_updated;
            state.metaData.updatedBy = data.metadata.updated_by;
        }
        
        // Store categories data globally
        state.freelancerData = data.categories;
        
        return data.categories;
    } catch (error) {
        console.error('Error loading freelancer data from database:', error);
        return {};
    }
}

/**
 * Loads data for a specific category
 * @param {string} category The category to load
 * @returns {Promise<Object>} The category data
 */
export async function loadCategoryData(category) {
    try {
        const response = await fetch(`api/get_freelancers.php?action=category&category=${category}`);
        
        if (!response.ok) {
            throw new Error(`Failed to load category data: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // Update metadata
        if (data.metadata) {
            state.metaData.lastUpdated = data.metadata.last_updated;
            state.metaData.updatedBy = data.metadata.updated_by;
        }
        
        // Store category data
        if (data.categories && data.categories[category]) {
            state.freelancerData[category] = data.categories[category];
        }
        
        return data.categories[category] || [];
    } catch (error) {
        console.error(`Error loading category data for ${category}:`, error);
        return [];
    }
}

/**
 * Searches for freelancers via API
 * @param {string} query The search query
 * @returns {Promise<Array>} Search results
 */
export async function searchFreelancersApi(query) {
    if (!query || query.trim() === '') return [];
    
    query = query.toLowerCase().trim();
    
    try {
        const response = await fetch(`api/get_freelancers.php?action=search&search=${encodeURIComponent(query)}`);
        
        if (!response.ok) {
            throw new Error(`Search API error: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // Process search results
        const results = [];
        for (const [category, freelancers] of Object.entries(data.categories)) {
            for (const freelancer of freelancers) {
                results.push({...freelancer, category});
            }
        }
        
        return results;
    } catch (error) {
        console.error('Database search error:', error);
        
        // Client-side search as fallback when API fails but we have data
        if (Object.keys(state.freelancerData).length > 0) {
            const results = [];
            
            for (const [category, freelancers] of Object.entries(state.freelancerData)) {
                for (const freelancer of freelancers) {
                    if (
                        freelancer.username.toLowerCase().includes(query) ||
                        freelancer.short_description.toLowerCase().includes(query)
                    ) {
                        results.push({...freelancer, category});
                    }
                }
            }
            
            return results;
        }
        
        return [];
    }
}