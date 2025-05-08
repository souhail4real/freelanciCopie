/**
 * FreeLanci.ma - UI Module
 * Handles UI initialization and interactions
 */

import { state } from './config.js';
import { renderFreelancers } from './render.js';
import { performSearch, clearSearch } from './search.js';
import { applyAdvancedFilters, extractSkillsFromData } from './filters.js';
import { formatResponse } from './render.js';

/**
 * Initializes all UI components
 */
export function initializeUI() {
    // Initialize all UI components
    initializeSkillsAutocomplete();
    initializeCategorySelection();
    initializeSearchFunctionality();
    initializeMobileMenu();
    initializeAdvancedFilters();
    initializeTeamForm();
}

/**
 * Initializes skills autocomplete
 */
function initializeSkillsAutocomplete() {
    const skillsInput = document.getElementById('skills-filter');
    if (!skillsInput) {
        return;
    }
    
    const skillsList = extractSkillsFromData();
    
    // Create a datalist element
    const datalist = document.createElement('datalist');
    datalist.id = 'skills-list';
    
    // Add options to datalist
    skillsList.forEach(skill => {
        const option = document.createElement('option');
        option.value = skill;
        datalist.appendChild(option);
    });
    
    // Add datalist to the document
    document.body.appendChild(datalist);
    
    // Connect input to datalist
    skillsInput.setAttribute('list', 'skills-list');
    
    // Handle comma-separated inputs
    skillsInput.addEventListener('input', function(e) {
        const value = e.target.value;
        const lastCommaIndex = value.lastIndexOf(',');
        
        if (lastCommaIndex !== -1) {
            // Get text after the last comma
            const currentInput = value.substring(lastCommaIndex + 1).trim();
            
            // Remove the datalist temporarily to prevent it from showing all options
            if (currentInput.length === 0) {
                skillsInput.removeAttribute('list');
            } else {
                skillsInput.setAttribute('list', 'skills-list');
            }
        }
    });
}

/**
 * Initializes category selection
 */
function initializeCategorySelection() {
    const categoryCards = document.querySelectorAll('.category-card');
    
    if (categoryCards.length === 0) {
        return;
    }
    
    categoryCards.forEach(card => {
        card.addEventListener('click', function() {
            // Remove selected class from all cards
            document.querySelectorAll('.category-card').forEach(c => {
                c.classList.remove('selected-category');
            });
            
            // Add selected class to clicked card
            this.classList.add('selected-category');
            
            // Get the category from data attribute
            const category = this.getAttribute('data-category');
            
            // Clear any active search
            clearSearch();
            
            // Render freelancers for this category
            renderFreelancers(category);
        });
    });
}

/**
 * Initializes search functionality
 */
function initializeSearchFunctionality() {
    // Hero search
    const heroSearchInput = document.getElementById('hero-search-input');
    const heroSearchButton = document.getElementById('hero-search-button');
    
    if (!heroSearchInput || !heroSearchButton) {
        return;
    }
    
    // Handle search button click
    heroSearchButton.addEventListener('click', () => {
        const query = heroSearchInput.value;
        performSearch(query);
    });
    
    // Handle enter key press
    heroSearchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const query = heroSearchInput.value;
            performSearch(query);
        }
    });
    
    // Clear search button
    const clearSearchButton = document.getElementById('clear-search');
    if (clearSearchButton) {
        clearSearchButton.addEventListener('click', clearSearch);
    }
}

/**
 * Initializes mobile menu
 */
function initializeMobileMenu() {
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    if (hamburgerMenu) {
        hamburgerMenu.addEventListener('click', function() {
            // Mobile menu toggle logic here
        });
    }
}

/**
 * Initializes advanced filters
 */
function initializeAdvancedFilters() {
    // Filter toggle functionality
    const toggleFilters = document.getElementById('toggle-filters');
    const advancedFilters = document.getElementById('advanced-filters');
    const applyFiltersBtn = document.getElementById('apply-filters');
    const clearFiltersBtn = document.getElementById('clear-filters');
    
    if (!toggleFilters || !advancedFilters) {
        return;
    }
    
    // Toggle filters visibility
    toggleFilters.addEventListener('click', () => {
        const isVisible = advancedFilters.style.display === 'block';
        advancedFilters.style.display = isVisible ? 'none' : 'block';
        
        // Update toggle icon
        const icon = toggleFilters.querySelector('.fa-chevron-down, .fa-chevron-up');
        if (icon) {
            icon.classList.toggle('fa-chevron-down');
            icon.classList.toggle('fa-chevron-up');
        }
    });
    
    // Apply filters
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', () => {
            applyAdvancedFilters();
        });
    }
    
    // Clear filters
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', () => {
            document.getElementById('price-min').value = '';
            document.getElementById('price-max').value = '';
            document.getElementById('category-filter').value = '';
            document.getElementById('skills-filter').value = '';
            
            // Reset to default view
            renderFreelancers(state.currentCategory);
        });
    }

    // Initialize active filter tags container
    const filterTagsContainer = document.getElementById('active-filter-tags');
    if (filterTagsContainer) {
        filterTagsContainer.innerHTML = '';
    }
}

/**
 * Initializes Team Form submission
 */
function initializeTeamForm() {
    const teamForm = document.getElementById('teamForm');
    
    if (!teamForm) {
        return;
    }
    
    teamForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const description = document.getElementById('projectDescription').value;
        const findTeamBtn = document.getElementById('findTeamBtn');
        const loadingIndicator = document.getElementById('loadingIndicator');
        const responseContainer = document.getElementById('responseContainer');
        const errorContainer = document.getElementById('errorContainer');
        const chooseTeamBtnContainer = document.getElementById('chooseTeamBtnContainer');
        
        // Show loading, hide other elements
        findTeamBtn.disabled = true;
        findTeamBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Processing...';
        loadingIndicator.classList.remove('hidden');
        responseContainer.classList.add('hidden');
        chooseTeamBtnContainer.classList.add('hidden'); // Hide button initially
        
        try {
            const response = await fetch('http://127.0.0.1:8000/find-team', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ project: description })
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Failed to find team members');
            }
            
            // Display the response
            document.getElementById('apiResponse').innerHTML = formatResponse(data);
            responseContainer.classList.remove('hidden');
            
            // Show the "Choose Your Team" button
            chooseTeamBtnContainer.classList.remove('hidden');
            
        } catch (error) {
            console.error('Error:', error);
            document.getElementById('errorMessage').textContent = error.message || 'An unexpected error occurred';
            errorContainer.classList.remove('hidden');
        } finally {
            findTeamBtn.disabled = false;
            findTeamBtn.innerHTML = '<i class="fas fa-users mr-2"></i> Find My Team';
            loadingIndicator.classList.add('hidden');
        }
    });
}