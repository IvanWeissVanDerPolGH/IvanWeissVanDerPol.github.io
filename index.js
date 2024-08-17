import {
    Name, LastName, FullName, mail, metaTitle, metaDescription, metaKeywords, metaAuthor, contactInfo, githubUsername, bio, languages, certifications, education, experience, footer, skills, testimonials
} from './data.js';
import { URLs } from './user-data/urls.js';

const enableLogging = true; // Set this to false to disable logs

/**
 * Set the meta tags and title dynamically
 */
function setMetaTags() {
    if (enableLogging) console.log('Setting meta tags');
    document.title = metaTitle;
    document.querySelector('meta[name="description"]').setAttribute('content', metaDescription);
    document.querySelector('meta[name="keywords"]').setAttribute('content', metaKeywords);
    document.querySelector('meta[name="author"]').setAttribute('content', metaAuthor);
}

/**
 * Improved element creation function that can also attach events.
 */
function createElement(type, { className, text, style, attributes, events, children } = {}) {
    if (enableLogging) console.log(`Creating element: ${type}, className: ${className}`);
    const element = document.createElement(type);
    if (className) element.className = className;
    if (text) element.textContent = text;
    if (style) element.setAttribute('style', style);
    Object.entries(attributes || {}).forEach(([key, value]) => element.setAttribute(key, value));
    Object.entries(events || {}).forEach(([event, handler]) => element.addEventListener(event, handler));
    (children || []).forEach(child => element.appendChild(createElement(...child)));
    return element;
}

/**
 * Function to handle generic container population.
 */
function populateContainer(containerId, items, createElementCallback) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`No container found with ID ${containerId}`);
        return;
    }
    container.innerHTML = ''; // Clear container
    items.forEach((item, index) => {
        if (enableLogging) console.log(`Appending item to container: ${containerId}, item:`, item, 'index:', index);
        container.appendChild(createElementCallback(item, index));
    });
}

/**
 * Example of a generic createElementCallback
 */
function createBioItem(item) {
    return createElement('p', { text: item, className: 'bio_item' });
}

/**
 * Creates a language skill element with a progress bar.
 */
function createLanguageSkillElement(language) {
    if (enableLogging) console.log('Creating language skill element:', language);
    const { skillName: LangName, color, percentage } = language;
    const skillContainer = createElement('div', {
        className: 'language_skill_container',
        children: [
            ['div', {
                className: 'progress_wrap',
                children: [
                    ['h3', { text: LangName, className: 'language_name' }],
                    ['div', {
                        className: 'progress',
                        children: [
                            ['div', {
                                className: `progress_bar progress_bar_color_${color}`,
                                attributes: { style: `width: ${percentage}%` }
                            }]
                        ]
                    }]
                ]
            }]
        ]
    });
    return skillContainer;
}

function createSkillItem(skill) {
    if (enableLogging) console.log('Creating skill item:', skill);
    const { skillName, imagePath, description } = skill;

    const listItem = document.createElement('li');
    listItem.className = 'skill_item';

    const imageContainer = document.createElement('div');
    if (imagePath) {
        const image = document.createElement('img');
        image.className = 'skill_logo';
        image.setAttribute('src', imagePath);
        image.setAttribute('alt', `Logo of ${skillName}`);
        image.setAttribute('loading', 'lazy');
        imageContainer.appendChild(image);
    }
    listItem.appendChild(imageContainer);

    const textContainer = document.createElement('div');
    const skillNameSpan = document.createElement('span');
    skillNameSpan.className = 'skill_name';
    skillNameSpan.textContent = skillName;
    textContainer.appendChild(skillNameSpan);

    const descriptionP = document.createElement('p');
    descriptionP.className = 'skill_description';
    descriptionP.textContent = description || '';  // Set to empty string if no description
    textContainer.appendChild(descriptionP);

    listItem.appendChild(textContainer);

    return listItem;
}

function createCertificationItem(certification) {
    if (enableLogging) console.log('Creating certification item:', certification);
    const { certificationName = '', image = '', preview = '#', description = '' } = certification || {};

    const certificationCard = document.createElement('li');
    certificationCard.className = 'cert_item';

    const link = document.createElement('a');
    link.setAttribute('href', preview);
    link.setAttribute('target', '_blank');
    certificationCard.appendChild(link);

    if (image) {
        const img = document.createElement('img');
        img.setAttribute('src', image);
        img.setAttribute('alt', `Image of ${certificationName}`);
        img.setAttribute('class', 'cert_image');
        img.setAttribute('loading', 'lazy');
        link.appendChild(img);
    }

    const nameElement = document.createElement('h4');
    nameElement.textContent = certificationName;
    nameElement.className = 'cert_name';
    link.appendChild(nameElement);

    if (description) {
        const descriptionElement = document.createElement('p');
        descriptionElement.textContent = description;
        link.appendChild(descriptionElement);
    }

    return certificationCard;
}

function createExperienceItem(experience) {
    if (enableLogging) console.log('Creating experience item:', experience);
    const { title, subtitle, duration, details, tags, icon, institution_logo, project_logo, institution_website } = experience;

    const experienceEntry = document.createElement('article');
    experienceEntry.className = 'experience_article';

    const experienceInner = document.createElement('div');
    experienceInner.className = 'experience_inner';

    const header = document.createElement('div');
    header.className = 'header';

    const titleHTML = document.createElement('h2');
    titleHTML.innerHTML = `${title} <span class="timeline_sublabel">${subtitle}</span>`;
    header.appendChild(titleHTML);

    const imageContainer = document.createElement('div');
    imageContainer.className = 'image_container';

    if (institution_logo && institution_logo !== "") {
        const institutionLogo = document.createElement('img');
        institutionLogo.setAttribute('src', institution_logo);
        institutionLogo.setAttribute('alt', 'Institution Logo');
        institutionLogo.setAttribute('class', 'work_logo');
        imageContainer.appendChild(institutionLogo);
    }

    if (project_logo && project_logo !== "") {
        const projectLogo = document.createElement('img');
        projectLogo.setAttribute('src', project_logo);
        projectLogo.setAttribute('alt', 'Project Logo');
        projectLogo.setAttribute('class', 'work_logo');
        imageContainer.appendChild(projectLogo);
    }

    header.appendChild(imageContainer);

    const experienceLabel = document.createElement('div');
    experienceLabel.className = 'experience_label';

    const durationSpan = document.createElement('span');
    durationSpan.className = 'experience_duration';
    durationSpan.textContent = duration;
    experienceLabel.appendChild(durationSpan);

    details.forEach(detail => {
        const detailParagraph = document.createElement('p');
        detailParagraph.className = 'experience_detail';
        detailParagraph.textContent = detail;
        experienceLabel.appendChild(detailParagraph);
    });

    const tagsDiv = document.createElement('div');
    tags.forEach(tag => {
        const tagSpan = document.createElement('span');
        tagSpan.className = 'experience_tag';
        tagSpan.textContent = tag;
        tagsDiv.appendChild(tagSpan);
    });
    experienceLabel.appendChild(tagsDiv);

    if (Array.isArray(institution_website)) {
        const websiteDiv = document.createElement('div');
        institution_website.forEach(website => {
            const websiteLink = document.createElement('a');
            websiteLink.setAttribute('href', website.url);
            websiteLink.textContent = website.urlText;
            websiteDiv.appendChild(websiteLink);
        });
        experienceLabel.appendChild(websiteDiv);
    }

    experienceInner.appendChild(header);
    experienceInner.appendChild(experienceLabel);
    experienceEntry.appendChild(experienceInner);

    return experienceEntry;
}

function createEducationItem(education) {
    if (enableLogging) console.log('Creating education item:', education);
    const { title, subtitle, duration, details, tags, education_institution_logo, institution_website } = education;

    const educationEntry = document.createElement('article');
    educationEntry.className = 'education_article';

    const educationInner = document.createElement('div');
    educationInner.className = 'education_inner';

    const header = document.createElement('div');
    header.className = 'header';

    const imageContainer = document.createElement('div');
    imageContainer.className = 'image_container';

    if (education_institution_logo && education_institution_logo !== "") {
        const institutionLogo = document.createElement('img');
        institutionLogo.setAttribute('src', education_institution_logo);
        institutionLogo.setAttribute('alt', 'Education Institution Logo');
        institutionLogo.setAttribute('class', 'edu_logo');
        imageContainer.appendChild(institutionLogo);
    }

    const titleHTML = document.createElement('h2');
    titleHTML.innerHTML = `${title} <span class="timeline_sublabel">${subtitle}</span>`;
    header.appendChild(titleHTML);

    header.appendChild(imageContainer); // Moved imageContainer to the right of the text

    const educationLabel = document.createElement('div');
    educationLabel.className = 'education_label';

    const durationSpan = document.createElement('span');
    durationSpan.className = 'education_duration';
    durationSpan.textContent = duration;
    educationLabel.appendChild(durationSpan);

    details.forEach(detail => {
        const detailParagraph = document.createElement('p');
        detailParagraph.className = 'education_detail';
        detailParagraph.textContent = detail;
        educationLabel.appendChild(detailParagraph);
    });

    const tagsDiv = document.createElement('div');
    tags.forEach(tag => {
        const tagSpan = document.createElement('span');
        tagSpan.className = 'education_tag';
        tagSpan.textContent = tag;
        tagsDiv.appendChild(tagSpan);
    });
    educationLabel.appendChild(tagsDiv);

    if (Array.isArray(institution_website)) {
        const websiteDiv = document.createElement('div');
        institution_website.forEach(website => {
            const websiteLink = document.createElement('a');
            websiteLink.setAttribute('href', website.url);
            websiteLink.textContent = website.urlText;
            websiteDiv.appendChild(websiteLink);
        });
        educationLabel.appendChild(websiteDiv);
    }

    educationInner.appendChild(header);
    educationInner.appendChild(educationLabel);
    educationEntry.appendChild(educationInner);

    return educationEntry;
}

/**
 * Creates an HTML element for a testimonial.
 * @param {Object} testimonial _ An object containing the title and detail of a testimonial.
 * @param {boolean} isActive _ A boolean indicating if the testimonial is active.
 * @returns {HTMLElement} _ A DOM element representing the testimonial.
 */
function createTestimonialElement(testimonial, isActive) {
    if (enableLogging) console.log('Creating testimonial element:', testimonial, 'isActive:', isActive);
    const wrapper = document.createElement('div');
    wrapper.className = `carousel-item ${isActive ? 'active' : ''}`;

    const contentWrapper = document.createElement('div');
    contentWrapper.className = 'carousel-content';

    const title = document.createElement('h3');
    title.textContent = testimonial.title;
    title.className = 'testimonial-title';

    const detail = document.createElement('p');
    detail.textContent = testimonial.detail;
    detail.className = 'testimonial-detail';

    contentWrapper.appendChild(title);
    contentWrapper.appendChild(detail);
    wrapper.appendChild(contentWrapper);

    return wrapper;
}

function createFooterItem(item) {
    if (enableLogging) console.log('Creating footer item:', item);
    const { intro_text, footer_links } = item;

    // Create a container for the footer item
    const footerDiv = document.createElement('div');
    footerDiv.className = 'footer';

    // If there's an intro_text, create a div for it
    if (intro_text) {
        const introDiv = document.createElement('div');
        introDiv.className = 'footer_intro'; // Add a class for styling
        introDiv.textContent = intro_text; // Set the intro text
        footerDiv.appendChild(introDiv); // Append intro text to the footer
    }

    // Create the navigation for the footer
    footer_links.forEach(linkGroup => {
        const colDiv = document.createElement('div');
        colDiv.className = 'col';

        // Create the column title
        if (linkGroup.label) {
            const colTitle = document.createElement('p');
            colTitle.className = 'col_title';
            colTitle.textContent = linkGroup.label;
            colDiv.appendChild(colTitle);
        }

        // Create the navigation for the column
        const nav = document.createElement('nav');
        nav.className = 'col_list';
        const ul = document.createElement('ul');

        // Check if data is defined before calling forEach
        if (linkGroup.data && Array.isArray(linkGroup.data)) {
            // Populate the list with links
            linkGroup.data.forEach(linkItem => {
                const li = document.createElement('li');
                const a = document.createElement('a');
                a.textContent = linkItem.text;
                if (linkItem.link) {
                    a.setAttribute('href', linkItem.link);
                    if (linkItem.target) {
                        a.setAttribute('target', linkItem.target);
                    }
                }
                if (linkItem.icon) {
                    const icon = document.createElement('i');
                    icon.className = `fa ${linkItem.icon}`; // Add icon class
                    a.prepend(icon); // Add icon before the text
                }
                if (linkItem.cta) {
                    const ctaSpan = document.createElement('span');
                    ctaSpan.textContent = ` (${linkItem.cta})`; // Add CTA text
                    a.appendChild(ctaSpan); // Append CTA to the link
                }
                li.appendChild(a);
                ul.appendChild(li);
            });
        } else {
            if (enableLogging) console.warn('Data is not defined or is not an array for footer item:', item);
        }
        nav.appendChild(ul);
        colDiv.appendChild(nav);
        footerDiv.appendChild(colDiv); // Append the column div to the footer div
    });

    return footerDiv; // Return the constructed footer div
}

/**
 * Create and return a GitHub card element.
 */
function createGitHubCard(username) {
    if (enableLogging) console.log('Creating GitHub card for username:', username);
    const githubCardDiv = document.getElementById('github_card');
    githubCardDiv.setAttribute('username', username);
    return githubCardDiv;
}

/**
 * Create and return a category element.
 */
function createCategoryElement_certifications(categoryName, items, createItemCallback) {
    if (enableLogging) console.log('Creating category element:', categoryName);
    const listItem = createElement('li', { className: 'category_item' });
    const linkDiv = createElement('div', { className: 'link', children: [['p', { text: categoryName }]] });
    const sublist = createElement('ul', { className: 'cert_sublist', style: 'display: none;' });

    listItem.appendChild(linkDiv);
    listItem.appendChild(sublist);

    // Populate the sublist with items
    items.forEach(item => {
        sublist.appendChild(createItemCallback(item));
    });

    // Add click event to toggle the submenu display
    linkDiv.addEventListener('click', () => {
        const isDisplayed = sublist.style.display === 'grid' || sublist.style.display === '';
        sublist.style.display = isDisplayed ? 'none' : 'grid';
    });

    return listItem;
}

function createCategoryElement_skills(categoryName, items, createItemCallback) {
    if (enableLogging) console.log('Creating category element:', categoryName);
    const listItem = createElement('li', { className: 'category_item' });
    const linkDiv = createElement('div', { className: 'link', children: [['p', { text: categoryName }]] });
    const sublist = createElement('ul', { className: 'skill_sublist', style: 'display: none;' });

    listItem.appendChild(linkDiv);
    listItem.appendChild(sublist);

    // Populate the sublist with items
    items.forEach(item => {
        sublist.appendChild(createItemCallback(item));
    });

    // Add click event to toggle the submenu display
    linkDiv.addEventListener('click', () => {
        const isDisplayed = sublist.style.display === 'grid' || sublist.style.display === '';
        sublist.style.display = isDisplayed ? 'none' : 'grid';
    });

    return listItem;
}


function populateTestimonials(containerId, testimonials, enableLogging = false) {
    if (enableLogging) console.log('Populating testimonials');
    populateContainer(containerId, testimonials, (item, index) => {
        if (enableLogging) console.log('Creating testimonial item:', item, 'at index:', index);
        return createTestimonialElement(item, index === 0);
    });
}

function populateSkillsAccordion(containerId, skills, enableLogging = false) {
    const skillsAccordion = document.getElementById(containerId);
    skillsAccordion.className = 'skills_list'; // Add class for styling
    Object.keys(skills).forEach(category => {
        if (skills[category]) {
            const categoryElement = createCategoryElement_skills(category.replace(/_/g, ' '), skills[category], createSkillItem);
            skillsAccordion.appendChild(categoryElement);
        } else {
            if (enableLogging) console.warn(`Undefined skill category: ${category}`);
        }
    });
}

function populateCertificationsAccordion(containerId, certifications, enableLogging = false) {
    const certificationsAccordion = document.getElementById(containerId);
    Object.keys(certifications).forEach(category => {
        if (certifications[category]) {
            const categoryElement = createCategoryElement_certifications(category.replace(/_/g, ' '), certifications[category], createCertificationItem);
            certificationsAccordion.appendChild(categoryElement);
        } else {
            if (enableLogging) console.warn(`Undefined certification category: ${category}`);
        }
    });
}

function populatePersonalInfo(fullNameId, emailId, contactInfoId, fullName, email, contactInfo, enableLogging = false) {
    if (enableLogging) console.log('Populating personal info');
    document.getElementById(fullNameId).textContent = fullName;
    const emailElement = document.getElementById(emailId);
    emailElement.textContent = email;
    emailElement.setAttribute('href', `mailto:${email}`);
    document.getElementById(contactInfoId).textContent = contactInfo;
}
document.addEventListener("DOMContentLoaded", () => {
    try {
        if (enableLogging) console.log('Document loaded, initializing...');

        // Set meta tags
        setMetaTags();

        // Populate personal info
        populatePersonalInfo('fullname', 'email', 'contact_info', FullName, mail, contactInfo, enableLogging);

        // Create GitHub card
        createGitHubCard(githubUsername);

        // Populate bio
        populateContainer('bio', bio, createBioItem);

        // Populate languages
        populateContainer('languages', languages, createLanguageSkillElement);

        // Populate skills accordion
        populateSkillsAccordion('skills_list', skills, enableLogging);

        // Populate certifications accordion
        populateCertificationsAccordion('cert_list', certifications, enableLogging);

        // Populate experience
        populateContainer('experience', experience, createExperienceItem);

        // Populate education
        populateContainer('education', education, createEducationItem);

        // Populate testimonials
        populateTestimonials('testimonialItems', testimonials.feedback, enableLogging);

        // Populate footer
        populateContainer('footer', footer, createFooterItem);

        // Initialize carousel with autoplay
        initializeCarouselWithAutoPlay('#testimonialCarousel', 'prevTestimonial', 'nextTestimonial', 5000000000, enableLogging);

    } catch (error) {
        console.error(`Error during initialization: ${error.message}`);
        console.error(`Error occurred at line: ${error.lineNumber}, column: ${error.columnNumber}`);
        console.error(`Stack trace: ${error.stack}`);
    }
});

/**
 * Initialize the carousel with autoplay functionality.
 */
function initializeCarouselWithAutoPlay(carouselSelector, prevButtonSelector, nextButtonSelector, interval , enableLogging = false) {
    const carouselElement = document.querySelector(carouselSelector);
    const items = carouselElement.querySelectorAll('.carousel-item');
    let currentIndex = 0;
    let carouselInterval;

    function showItem(index) {
        items.forEach((item, i) => {
            item.classList.remove('active');
            item.style.display = 'none'; // Hide non-active items
        });

        items[index].classList.add('active');
        items[index].style.display = 'flex'; // Show active item
    }

    function nextItem() {
        currentIndex = (currentIndex + 1) % items.length;
        showItem(currentIndex);
    }

    function prevItem() {
        currentIndex = (currentIndex - 1 + items.length) % items.length;
        showItem(currentIndex);
    }

    document.getElementById(prevButtonSelector).addEventListener('click', () => {
        if (enableLogging) console.log('Previous testimonial button clicked');
        prevItem();
        resetInterval();
    });

    document.getElementById(nextButtonSelector).addEventListener('click', () => {
        if (enableLogging) console.log('Next testimonial button clicked');
        nextItem();
        resetInterval();
    });

    function resetInterval() {
        clearInterval(carouselInterval);
        carouselInterval = setInterval(nextItem, interval);
    }

    carouselElement.addEventListener('mouseover', () => {
        clearInterval(carouselInterval);
    });

    carouselElement.addEventListener('mouseleave', () => {
        carouselInterval = setInterval(nextItem, interval);
    });

    carouselInterval = setInterval(nextItem, interval);

    showItem(currentIndex);
}


document.addEventListener('DOMContentLoaded', function () {
    const certHeader = document.querySelector('.certifications-header');
    const certList = document.querySelector('.certifications_list');
    const skillsHeader = document.querySelector('.skills-header');
    const skillsList = document.querySelector('.skills_list');

    certHeader.addEventListener('click', function () {
        certList.style.display = certList.style.display === 'grid' ? 'none' : 'grid';
    });

    skillsHeader.addEventListener('click', function () {
        skillsList.style.display = skillsList.style.display === 'grid' ? 'none' : 'grid';
    });
});