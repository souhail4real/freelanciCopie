/**
 * FreeLanci.ma - Filters Module
 * Handles filtering functionality
 */

import { state, commonSkills } from './config.js';
import { displayFilteredResults } from './render.js';
import { renderFreelancers } from './render.js';

/**
 * Applies advanced filters to freelancer data
 */
export function applyAdvancedFilters() {
    const minPrice = document.getElementById('price-min')?.value;
    const maxPrice = document.getElementById('price-max')?.value;
    const category = document.getElementById('category-filter')?.value;
    const skillsInput = document.getElementById('skills-filter')?.value || '';
    
    const skills = skillsInput.toLowerCase().split(',').map(s => s.trim()).filter(s => s);
    
    // Track active filters for display
    const activeFilters = [];
    
    // Set the active category if one is selected
    if (category) {
        state.currentCategory = category;
        activeFilters.push({ type: 'category', value: category });
        
        // Update UI to show the selected category
        document.querySelectorAll('.category-card').forEach(card => {
            card.classList.remove('selected-category');
            if (card.getAttribute('data-category') === category) {
                card.classList.add('selected-category');
            }
        });
    }
    
    // Add price filters if specified
    if (minPrice) activeFilters.push({ type: 'min-price', value: `$${minPrice}+` });
    if (maxPrice) activeFilters.push({ type: 'max-price', value: `Up to $${maxPrice}` });
    
    // Add skill filters
    skills.forEach(skill => {
        if (skill) activeFilters.push({ type: 'skill', value: skill });
    });
    
    const loadingSpinner = document.getElementById('loading-spinner');
    if (loadingSpinner) loadingSpinner.classList.remove('hidden');
    
    // Get all freelancers either from the current category or all categories if no category is specified
    let allFreelancers = [];
    if (category) {
        allFreelancers = state.freelancerData[category] || [];
    } else {
        // Combine all freelancers from all categories
        Object.values(state.freelancerData).forEach(categoryFreelancers => {
            allFreelancers = [...allFreelancers, ...categoryFreelancers];
        });
    }
    
    // Apply filters
    const filteredFreelancers = allFreelancers.filter(freelancer => {
        const price = parseInt(freelancer.price);
        
        // Price range filter
        if (minPrice && price < parseInt(minPrice)) return false;
        if (maxPrice && price > parseInt(maxPrice)) return false;
        
        // Skills filter
        if (skills.length > 0) {
            const freelancerDescription = freelancer.short_description.toLowerCase();
            // Check if any of the skills are mentioned in the freelancer's description
            const hasMatchingSkill = skills.some(skill => 
                freelancerDescription.includes(skill)
            );
            if (!hasMatchingSkill) return false;
        }
        
        return true;
    });
    
    // Display filtered results
    displayFilteredResults(filteredFreelancers, activeFilters);
    
    if (loadingSpinner) loadingSpinner.classList.add('hidden');
}

/**
 * Removes a specific filter and reapplies remaining filters
 * @param {string} filterType The filter type
 * @param {string} filterValue The filter value
 */
export function removeFilter(filterType, filterValue) {
    // Handle different filter types
    switch(filterType) {
        case 'category':
            const categoryFilter = document.getElementById('category-filter');
            if (categoryFilter) categoryFilter.value = '';
            break;
        case 'min-price':
            const minPrice = document.getElementById('price-min');
            if (minPrice) minPrice.value = '';
            break;
        case 'max-price':
            const maxPrice = document.getElementById('price-max');
            if (maxPrice) maxPrice.value = '';
            break;
        case 'skill':
            // Remove just this skill from the comma-separated list
            const skillsInput = document.getElementById('skills-filter');
            if (skillsInput) {
                const skills = skillsInput.value.split(',').map(s => s.trim());
                const updatedSkills = skills.filter(s => s.toLowerCase() !== filterValue.toLowerCase());
                skillsInput.value = updatedSkills.join(', ');
            }
            break;
    }
    
    // Reapply remaining filters
    applyAdvancedFilters();
}

/**
 * Extracts skills from freelancers' descriptions
 * @returns {Array} The extracted skills
 */
export function extractSkillsFromData() {
    const skillsSet = new Set();
    
    if (Object.keys(state.freelancerData).length === 0) {
        return [];
    }
    
    Object.values(state.freelancerData).forEach(categoryFreelancers => {
        categoryFreelancers.forEach(freelancer => {
            const description = freelancer.short_description.toLowerCase();
            
            // Extract skills from descriptions based on common skills
            commonSkills.forEach(skill => {
                if (description.includes(skill.toLowerCase())) {
                    // Capitalize first letter of each word
                    const formattedSkill = skill.split(' ').map(word => 
                        word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ');
                    skillsSet.add(formattedSkill);
                }
            });
        });
    });
    
    return Array.from(skillsSet).sort();
}