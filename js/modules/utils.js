/**
 * FreeLanci.ma - Utilities Module
 * Contains utility functions used across the app
 */

import { state, categoryDisplayNames } from './config.js';

/**
 * Updates metadata display
 */
export function updateMetadataDisplay() {
    const metadataElement = document.getElementById('metadata-info');
    if (metadataElement) {
        metadataElement.innerHTML = `
            <p class="text-xs text-gray-500">
                Last updated: ${state.metaData.lastUpdated} by ${state.metaData.updatedBy}
            </p>
        `;
    }
}

/**
 * Toggles favorite status for a freelancer
 * @param {HTMLElement} button The button element
 */
export function toggleFavorite(button) {
    const icon = button.querySelector('i');
    if (icon.classList.contains('far')) {
        icon.classList.remove('far');
        icon.classList.add('fas');
    } else {
        icon.classList.remove('fas');
        icon.classList.add('far');
    }
}

/**
 * Gets display name for category
 * @param {string} categoryValue The category value
 * @returns {string} The display name
 */
export function getCategoryDisplayName(categoryValue) {
    return categoryDisplayNames[categoryValue] || categoryValue;
}

/**
 * Exports global functions to window object for event handler access
 */
export function exposeGlobalFunctions() {
    // Create a namespace to avoid polluting global scope
    window.app = window.app || {};
    
    // Expose functions that need to be called from HTML
    window.app.toggleFavorite = toggleFavorite;
}

// Call this function immediately to make toggleFavorite available globally
exposeGlobalFunctions();