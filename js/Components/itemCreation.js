/* itemCreation.js */

import { log, warn } from '../../main.js';
import { pageConfig } from '../../PageData.js';
// Generic Element Creation Utility
export function createElement(type, { className = '', text = '', style = '', attributes = {}, events = {}, children = [] } = {}) {
    log(`Creating element <${type}> with class "${className}"`);
    const element = document.createElement(type);

    if (className) element.className = className;
    if (text) element.textContent = text;
    if (style) element.style.cssText = style;

    Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
    Object.entries(events).forEach(([eventName, handler]) => element.addEventListener(eventName, handler));

    children.forEach((child) => {
        element.appendChild(child instanceof HTMLElement ? child : createElement(...child));
    });

    return element;
}

// Create Bio Section
export function createBioSection({ title, intro, body }) {
    const container = document.createElement('div');
    container.className = 'bio-container';

    const bioTitle = document.createElement('h2');
    bioTitle.className = 'bio-title';
    bioTitle.textContent = title;

    const bioIntro = document.createElement('p');
    bioIntro.className = 'bio-intro';
    bioIntro.textContent = intro;

    container.appendChild(bioTitle);
    container.appendChild(bioIntro);

    body.forEach((paragraph) => {
        const bioBody = document.createElement('p');
        bioBody.className = 'bio-body';
        bioBody.textContent = paragraph;
        container.appendChild(bioBody);
    });

    // Add languages container
    const languagesContainer = document.createElement('div');
    languagesContainer.id = 'languages';
    languagesContainer.className = 'languages-section';
    container.appendChild(languagesContainer);

    return container;
}


// Create Language Skill Element
export function createLanguageSkillElement({ skillName, color, percentage }) {
    return createElement('div', {
        className: 'Language-container',
        children: [
            createElement('div', {
                className: 'progress-wrap',
                children: [
                    createElement('h3', { text: skillName }),
                    createElement('div', {
                        className: 'progress',
                        children: [
                            createElement('div', {
                                className: `progress-bar color-${color}`,
                                style: `width: ${percentage}%;`
                            })
                        ]
                    })
                ]
            })
        ]
    });
}

// Create Skill Item
export function createSkillItem({ skillName, imagePath, description }) {
    const li = document.createElement('li');
    li.className = 'skill-item';

    // Add skill image
    if (imagePath) {
        const skillImage = document.createElement('img');
        skillImage.src = imagePath;
        skillImage.alt = `${skillName} Logo`;
        skillImage.className = 'skill-image'; // Use CSS to style images
        li.appendChild(skillImage);
    }

    // Add skill title
    const skillTitle = document.createElement('span');
    skillTitle.className = 'skill-title';
    skillTitle.textContent = skillName;
    li.appendChild(skillTitle);

    // Add skill description (optional)
    if (description) {
        const skillDescription = document.createElement('p');
        skillDescription.className = 'skill-description';
        skillDescription.textContent = description;
        li.appendChild(skillDescription);
    }

    return li;
}


// Create Certification Item
export function createCertificationItem({ certificationName, image, preview, description }) {
    const li = document.createElement('li');
    li.className = 'certification-item';

    const link = document.createElement('a');
    link.href = preview;
    link.target = '_blank';
    link.setAttribute('aria-label', `View certificate: ${certificationName}`);

    if (image) {
        const img = document.createElement('img');
        img.className = 'certification-img';
        img.src = image;
        img.alt = `Certificate: ${certificationName}`;
        img.loading = 'lazy';
        link.appendChild(img);
    }

    const name = document.createElement('h4');
    name.className = 'certification-name';
    name.textContent = certificationName;
    link.appendChild(name);

    li.appendChild(link);

    if (description) {
        const desc = document.createElement('p');
        desc.className = 'certification-description';
        desc.textContent = description;
        li.appendChild(desc);
    }

    return li;
}



// Create Timeline Item
export function createTimelineItem({ title, subtitle, duration, details = [], tags = [], icon }, colorClass = 'color-3') {
    return createElement('article', {
        className: 'timeline-entry',
        children: [
            // Icon Container
            createElement('div', {
                className: `timeline-icon ${colorClass}`,
                children: [createElement('i', { className: `fa ${icon || ''}` })],
            }),
            // Content Container
            createElement('div', {
                className: 'timeline-label',
                children: [
                    // Title and Subtitle
                    createElement('h2', {
                        className: 'timeline-title',
                        innerHTML: subtitle
                            ? `${title} <span class="timeline-sublabel">${subtitle}</span>`
                            : title,
                    }),
                    // Duration
                    createElement('span', { className: 'duration', text: duration }),
                    // Details
                    ...details.map((detail) =>
                        createElement('p', { className: 'timeline-text', text: detail })
                    ),
                    // Tags
                    createElement('div', {
                        className: 'tags-container',
                        children: tags.map((tag) =>
                            createElement('span', { className: 'badge badge-secondary', text: tag })
                        ),
                    }),
                ],
            }),
        ],
    });
}



/**
 * Creates a single footer item element as HTML string.
 * @param {Object} item - Footer item object with `label`, `content`, and optionally `url`.
 * @returns {string} - HTML string for the footer item.
 */
export function createFooterItem(item) {
    if (!item.content) {
        console.warn('Footer item content is missing:', item);
        return '';
    }

    if (item.url) {
        return `
            <div class="footer-item">
                <a href="${item.url}" target="_blank" rel="noopener noreferrer">${item.content}</a>
            </div>
        `;
    }

    return `<div class="footer-item">${item.content}</div>`;
}
export function createFooterColumn(section) {
    const items = section.data
        .map(item => {
            if (item.link) {
                return `<div class="footer-item">
                            <a href="${item.link}" target="${item.target || '_self'}" rel="noopener noreferrer">${item.text}</a>
                        </div>`;
            }
            return `<div class="footer-item">${item.text}</div>`;
        })
        .join('');

    return `
        <div class="footer-column">
            <h4>${section.label}</h4>
            ${items}
        </div>
    `;
}


// Create Testimonial Element
export function createTestimonialElement({ title, detail }, isActive) {
    return createElement('div', {
        className: `carousel-item ${isActive ? 'active' : ''}`,
        children: [
            createElement('div', {
                className: 'carousel-content',
                children: [
                    createElement('h3', { className: 'testimonial-title', text: title }),
                    createElement('p', { className: 'testimonial-detail', text: detail })
                ]
            })
        ]
    });
}

// Create Category Element
export function createCategoryElement(categoryName, items, createItemCallback) {
    const categoryWrapper = document.createElement('li');
    categoryWrapper.className = 'accordion-category';

    const categoryHeader = document.createElement('div');
    categoryHeader.className = 'category-header';
    categoryHeader.textContent = categoryName;

    const categoryContent = document.createElement('ul');
    categoryContent.className = 'category-content';

    // Add items to the category content
    items.forEach((item) => {
        const itemElement = createItemCallback(item);
        categoryContent.appendChild(itemElement);
    });

    // Toggle visibility of category content
    categoryHeader.addEventListener('click', () => {
        const isExpanded = categoryContent.style.display === 'block';
        categoryContent.style.display = isExpanded ? 'none' : 'block';
    });

    categoryWrapper.appendChild(categoryHeader);
    categoryWrapper.appendChild(categoryContent);

    return categoryWrapper;
}


export function createSectionsFromConfig() {
    const { sections } = pageConfig;

    if (!sections || typeof sections !== 'object') {
        console.warn('Invalid sections configuration in pageConfig');
        return;
    }

    Object.entries(sections).forEach(([sectionKey, sectionData]) => {
        // Ensure we have at least one of `containerId` or `accordionId`
        const containerId = sectionData.containerId || sectionData.accordionId;

        if (!containerId) {
            console.warn(`Section "${sectionKey}" is missing a containerId or accordionId`);
            return;
        }

        // Create section element
        const sectionEl = document.createElement('section');
        sectionEl.id = containerId;
        sectionEl.className = `${sectionKey}-section ${sectionData.extraClasses || ''}`.trim();

        // Add section label as heading, if available
        if (sectionData.label) {
            const heading = document.createElement('h1');
            heading.textContent = sectionData.label;
            sectionEl.appendChild(heading);
        }

        // Add placeholder content for sections with accordions
        if (sectionData.accordionId) {
            const accordion = document.createElement('ul');
            accordion.className = 'accordion';
            accordion.id = sectionData.accordionId;
            sectionEl.appendChild(accordion);
        }

        // Add predefined content if specified
        if (sectionData.content) {
            const contentEl = document.createElement('div');
            contentEl.innerHTML = sectionData.content;
            sectionEl.appendChild(contentEl);
        }

        // Append section to main content
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
            mainContent.appendChild(sectionEl);
        } else {
            console.error('Main content container with ID "main-content" not found');
        }
    });
}


