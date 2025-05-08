/**
 * FreeLanci.ma - Configuration Module
 * Contains global state variables and constants
 */

// Global state (exported so other modules can access and update)
export const state = {
    freelancerData: {},
    currentCategory: 'web-development',
    currentPage: 1,
    freelancersPerPage: 28,
    metaData: {
        lastUpdated: "2025-05-07 17:45:45",
        updatedBy: "souhail4real"
    }
};

// Categories for classification
export const categories = {
    'web-development': ['web', 'developer', 'development', 'javascript', 'react', 'vue', 'angular', 'node', 'php', 'laravel', 'html', 'css', 'bootstrap', 'tailwind', 'wordpress', 'shopify', 'frontend', 'backend', 'full stack'],
    'mobile-development': ['mobile', 'android', 'ios', 'flutter', 'react native', 'kotlin', 'swift', 'dart', 'xamarin', 'ionic', 'app development', 'pwa', 'mobile app'],
    'data-science-ml': ['data', 'machine learning', 'artificial intelligence', 'ai', 'ml', 'python', 'pandas', 'tensorflow', 'pytorch', 'scikit', 'data analysis', 'data scientist', 'big data', 'nlp', 'deep learning', 'neural network'],
    'cybersecurity': ['security', 'cyber', 'ethical hacking', 'penetration testing', 'pen test', 'infosec', 'firewall', 'cryptography', 'encryption', 'vulnerability', 'security audit', 'siem', 'compliance', 'gdpr'],
    'cloud-devops': ['cloud', 'aws', 'azure', 'gcp', 'google cloud', 'devops', 'docker', 'kubernetes', 'jenkins', 'ci/cd', 'terraform', 'ansible', 'infrastructure', 'iaas', 'paas', 'saas', 'microservices', 'serverless']
};

// Common skills for extraction from descriptions
export const commonSkills = [
    // Web development
    'javascript', 'react', 'vue', 'angular', 'node', 'php', 'laravel', 
    'html', 'css', 'bootstrap', 'tailwind', 'wordpress', 'shopify',
    
    // Mobile development
    'android', 'ios', 'flutter', 'react native', 'kotlin', 'swift',
    
    // Data science
    'python', 'tensorflow', 'pytorch', 'data analysis', 
    'machine learning', 'ai', 'ml', 'deep learning',
    
    // Cybersecurity
    'security', 'ethical hacking', 'penetration testing', 'encryption',
    
    // Cloud & DevOps
    'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'devops'
];

// Category display names
export const categoryDisplayNames = {
    'web-development': 'Web Development',
    'mobile-development': 'Mobile Development',
    'data-science-ml': 'Data Science & ML',
    'cybersecurity': 'Cybersecurity',
    'cloud-devops': 'Cloud & DevOps'
};