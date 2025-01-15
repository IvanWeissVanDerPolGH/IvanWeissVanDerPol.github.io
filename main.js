/* main.js */

// Imports
import {
    metaTitle,
    metaDescription,
    metaKeywords,
    metaAuthor,
    pageConfig,
    FullName,
    mail,
    contactInfo,
    bio,
    languagesData,
    skills,
    certifications,
    experience,
    education,
    footer,
    testimonials,
} from './PageData.js';

import {
    createElement,
    createBioSection,
    createSkillItem,
    createCertificationItem,
    createTimelineItem,
    createFooterItem,
    createTestimonialElement,
    createSectionsFromConfig,
    createCategoryElement,
    createLanguageSkillElement
} from './js/Components/itemCreation.js';

import {
    populateContainer,
    populateLanguages,
    populateAccordion,
    populateTestimonials,
    populateFooter,
    initializeCarousel,
    setMetaTags,
    populatePersonalInfo
} from './js/Components/Populate.js';

// DOM References
const mainContent = document.getElementById('main-content');
const sidebarMenu = document.getElementById('sidebarMenu');
const themeSelector = document.getElementById('theme-selector');
// Toggle logging
const enableLogging = true;
export function log(...args) {
  if (enableLogging) console.log(...args);
}
export function warn(...args) {
  if (enableLogging) console.warn(...args);
}
// Helper Functions
function setupThemeSelector() {
    const { themes } = pageConfig;
    if (!themes || !themeSelector) return;

    themeSelector.innerHTML = themes.map(theme => `<option value="${theme.value}">${theme.label}</option>`).join('');
    themeSelector.addEventListener('change', ({ target: { value } }) => document.body.className = value);
}

function initializePage() {
    setMetaTags({ title: metaTitle, description: metaDescription, keywords: metaKeywords, author: metaAuthor });

    createSectionsFromConfig(); // Ensure this function references pageConfig correctly
    setupSidebarMenu();
    setupThemeSelector();

    // Populate personal info
    populatePersonalInfo('fullname', 'email', 'contact-info', FullName, mail, contactInfo);

    // Render Bio Section
    populateContainer(pageConfig.sections.bio.containerId, [bio], createBioSection);

    // Populate languages after bio section is rendered
    const languagesContainer = document.querySelector('#languages');
    if (languagesContainer) {
        populateLanguages('languages', languagesData);
    } else {
        warn('Languages container not found inside the bio section.');
    }

    // Populate other sections
    populateAccordion(pageConfig.sections.skills.accordionId, skills, createSkillItem);
    populateAccordion(pageConfig.sections.certifications.accordionId, certifications, createCertificationItem);
    populateContainer(pageConfig.sections.experience.containerId, experience, item => createTimelineItem(item, 'color-3'));
    populateContainer(pageConfig.sections.education.containerId, education, item => createTimelineItem(item, 'color-3'));
    populateTestimonials(pageConfig.sections.testimonials.containerId, testimonials.feedback);
    
    // Initialize Carousel
    initializeCarousel(pageConfig.sections.testimonials.carouselSelector, pageConfig.sections.testimonials.prevButtonId, pageConfig.sections.testimonials.nextButtonId);
    populateFooter(pageConfig.sections.footer.containerId, footer);
}

function setupSidebarMenu() {
    sidebarMenu.innerHTML = Object.entries(pageConfig.sections)
        .filter(([, sectionData]) => sectionData.displayInMenu)
        .map(([, { label, containerId }]) => `<li><a href="#${containerId}">${label}</a></li>`)
        .join('');
}

// Event Listener
document.addEventListener('DOMContentLoaded', () => {
    try {
        initializePage();
    } catch (error) {
        console.error(`Initialization Error: ${error.message}`);
    }
});
