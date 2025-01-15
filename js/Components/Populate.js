/* Populate.js */

import { log, warn } from '../../main.js';
import {
    createElement,
    createLanguageSkillElement,
    createFooterItem,
    createCategoryElement,
    createTestimonialElement,
    createFooterColumn 
} from './itemCreation.js';

// Set Meta Tags
export function setMetaTags({ title = 'Default Title', description = '', keywords = '', author = '' }) {
    log('Setting meta tags...');
    document.title = title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', description);
    document.querySelector('meta[name="keywords"]')?.setAttribute('content', keywords);
    document.querySelector('meta[name="author"]')?.setAttribute('content', author);
}

// Generic Population Utility
export function populateContainer(containerId, items, createElementCallback) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.warn(`No container found with ID "${containerId}"`);
        return;
    }

    container.innerHTML = ''; // Clear the container

    items.forEach((item, index) => {
        const element = createElementCallback(item, index);
        if (element instanceof HTMLElement) {
            container.appendChild(element); // Append the actual DOM element
        } else {
            console.warn('Invalid element returned from createElementCallback:', element);
        }
    });
}

// Populate Languages
export function populateLanguages(containerId, languages) {
    const container = document.getElementById(containerId);
    if (!container) {
        warn(`Languages container with ID "${containerId}" not found.`);
        return;
    }

    container.innerHTML = ''; // Clear existing content

    languages.forEach(language => {
        const element = createLanguageSkillElement(language);
        container.appendChild(element);
    });
}


// Populate Footer
export function populateFooter(containerId, footerData) {
    console.log('Populating footer...');
    const footerContainer = document.getElementById(containerId);

    if (!footerContainer) {
        console.warn(`No footer container found with ID "${containerId}"`);
        return;
    }

    if (!footerData || !Array.isArray(footerData) || footerData.length === 0) {
        console.warn('Invalid or empty footer data array');
        footerContainer.innerHTML = '<p>No footer content available</p>';
        return;
    }

    // Generate footer columns for each section except "copyright-text"
    const footerColumns = footerData
        .filter(section => section.label !== 'copyright-text' && section.data)
        .map(section => createFooterColumn(section))
        .join('');

    // Generate copyright section
    const copyrightSection = footerData
        .filter(section => section.label === 'copyright-text' && section.data)
        .flatMap(section => section.data) // Flatten the `data` array
        .map(item => `<div>${item}</div>`)
        .join('');

    // Populate footer
    footerContainer.innerHTML = `
        <div class="footer-columns">
            ${footerColumns}
        </div>
        <div class="footer-copyright">
            ${copyrightSection}
        </div>
    `;
}



// Populate Personal Info
export function populatePersonalInfo(fullNameId, emailId, contactInfoId, fullName, email, contactText) {
    log('Populating personal info...');
    
    // Set full name
    const fullNameEl = document.getElementById(fullNameId);
    if (fullNameEl) fullNameEl.textContent = fullName;

    // Set email
    const emailEl = document.getElementById(emailId);
    if (emailEl) {
        emailEl.textContent = email;
        emailEl.setAttribute('href', `mailto:${email}`);
    }

    // Set contact info
    const contactInfoEl = document.getElementById(contactInfoId);
    if (contactInfoEl) contactInfoEl.textContent = contactText;
}

// Populate Accordion
export function populateAccordion(containerId, dataObj, createItemCallback) {
    const accordion = document.getElementById(containerId);
    if (!accordion) {
        console.warn(`No accordion container found with ID "${containerId}"`);
        return;
    }

    accordion.innerHTML = ''; // Clear existing content

    Object.entries(dataObj).forEach(([category, items]) => {
        // Create category container
        const categoryContainer = document.createElement('li');
        categoryContainer.className = 'accordion-category';

        // Add category header
        const categoryHeader = document.createElement('div');
        categoryHeader.className = 'category-header';
        categoryHeader.textContent = category.replace(/_/g, ' '); // Format category name
        categoryContainer.appendChild(categoryHeader);

        // Add category content
        const categoryContent = document.createElement('ul');
        categoryContent.className = 'category-content';

        items.forEach(item => {
            const certificationItem = createItemCallback(item);
            categoryContent.appendChild(certificationItem);
        });

        categoryContainer.appendChild(categoryContent);
        accordion.appendChild(categoryContainer);
    });
}




// Populate Testimonials
export function populateTestimonials(containerId, testimonialsArr) {
    log('Populating testimonials...');
    populateContainer(containerId, testimonialsArr, (item, index) => createTestimonialElement(item, index === 0));
}

// Initialize Carousel
export function initializeCarousel(carouselSelector, prevButtonId, nextButtonId, interval = 3000) {
    const carouselElement = $(carouselSelector);
    carouselElement.carousel({ interval });

    const prevButton = document.getElementById(prevButtonId);
    const nextButton = document.getElementById(nextButtonId);

    prevButton?.addEventListener('click', () => {
        log(`"${prevButtonId}" clicked -> carousel prev`);
        carouselElement.carousel('prev');
        carouselElement.carousel('pause');
    });

    nextButton?.addEventListener('click', () => {
        log(`"${nextButtonId}" clicked -> carousel next`);
        carouselElement.carousel('next');
        carouselElement.carousel('pause');
    });

    document.addEventListener('click', (event) => {
        const isClickInside = event.target.closest(`#${prevButtonId}`) || event.target.closest(`#${nextButtonId}`);
        if (!isClickInside) {
            log('Click outside nav buttons, resuming carousel');
            carouselElement.carousel('cycle');
        }
    });
}
