/**
 * FreeLanci.ma - Main Module
 * Created: 2025-05-04
 * Author: souhail4real
 * Updated: 2025-05-08 14:59:53
 */

import { state } from './modules/config.js';
import { loadFreelancerData } from './modules/api.js';
import { initializeUI } from './modules/ui.js';
import { renderFreelancers } from './modules/render.js';

// Entry point - Application initialization
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // STEP 1: Load the freelancer data
        await loadFreelancerData();
        
        // STEP 2: Initialize all UI components
        initializeUI();
        
        // STEP 3: Render initial content
        renderFreelancers('web-development');
    } catch (error) {
        console.error('Application initialization error:', error);
    }
});