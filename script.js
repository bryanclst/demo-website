'use strict';


// Component 1: Dropdown menu/hamburger button
const dropdown = document.querySelector('.dropdown');
const nav = document.querySelector('nav');
const logoAndName = document.querySelector('.logo-and-name');

dropdown.addEventListener('click', e=>{
    nav.classList.toggle('active');
    logoAndName.classList.toggle('active');
});

// Component 2: Dark mode toggle
const styleBtn = document.querySelector('.style-btn');
const body = document.querySelector('body');
const header = document.querySelector('header');
const footer = document.querySelector('footer');
const bars = document.querySelectorAll('.bar');
const carouselBtns = document.querySelectorAll('.carousel-btn');
const covidCount = document.querySelector(".covid-count");
const countryCount = document.querySelector(".country-count");


// what to do when the button is clicked
styleBtn.addEventListener('click', e=>{
    if(styleBtn.textContent === 'Dark Mode') {
        styleBtn.textContent = 'Light Mode';
    } else {
        styleBtn.textContent = 'Dark Mode';
    }

    body.classList.toggle('dark');
    header.classList.toggle('dark');
    footer.classList.toggle('dark');
    styleBtn.classList.toggle('dark');
    bars.forEach(e=>{
        e.classList.toggle('dark');
    });

    // check that carouselBtns is not an empty list, since carousel is only on the home page
    if(carouselBtns.length) {
        carouselBtns.forEach(e=>{
            e.classList.toggle('dark');
        });
    }

    // check that covidCount and countryCount are not null
    if(covidCount && countryCount) {
        covidCount.classList.toggle('dark');
        countryCount.classList.toggle('dark');
    }
});

// Component 3: Carousel
const leftBtn = document.querySelector('.left');
const rightBtn = document.querySelector('.right');
const carouselNav = document.querySelector('.carousel-nav');
const carouselItems = Array.from(document.querySelectorAll('.carousel-item'));
const carouselNavItems = Array.from(document.querySelectorAll('.carousel-nav-item'));
const CAROUSEL_SIZE = carouselItems.length;
const carouselImgDesc = document.querySelector('.carousel-img-desc');

// array of image descriptions for text overlay
const descriptions = [
    'Main gym area',
    'Secondary gym area',
    'Waiting area',
];

// check that carousel items are not null, since the carousel is only on the home page
if(leftBtn && rightBtn && carouselNav) {
    leftBtn.addEventListener('click', swipe);
    rightBtn.addEventListener('click', swipe);
    carouselNav.addEventListener('click', navSwitch);
}

function swipe(e) {
    const currentCarouselItem = document.querySelector('.carousel-item.active');
    const currentIndex = carouselItems.indexOf(currentCarouselItem);
    let nextIndex;

    if(e.currentTarget.classList.contains('left')) {
        nextIndex = currentIndex === 0 ? CAROUSEL_SIZE - 1 : currentIndex - 1;
    } else {
        nextIndex = currentIndex === CAROUSEL_SIZE - 1 ? 0 : currentIndex + 1;
    }

    carouselItems[nextIndex].classList.add('active');
    carouselNavItems[nextIndex].classList.add('active');
    carouselItems[currentIndex].classList.remove('active');
    carouselNavItems[currentIndex].classList.remove('active');

    updateDesc();
}

function navSwitch(e) {
    const currentCarouselItem = document.querySelector('.carousel-item.active');
    const currentIndex = carouselItems.indexOf(currentCarouselItem);

    if(!e.target.classList.contains('active')) {
        const nextIndex = carouselNavItems.indexOf(e.target);

        carouselItems[nextIndex].classList.add('active');
        carouselNavItems[nextIndex].classList.add('active');
        carouselItems[currentIndex].classList.remove('active');
        carouselNavItems[currentIndex].classList.remove('active');
    }

    updateDesc();
}

// this function updates the carousel image caption
function updateDesc() {
    const currentCarouselItem = document.querySelector('.carousel-item.active');
    const currentIndex = carouselItems.indexOf(currentCarouselItem);
    
    carouselImgDesc.textContent = descriptions[currentIndex];
}



// COVID API implementation

const url = 'https://api.covid19api.com/summary';
// const url = 'summary.json';

const countryPicker = document.querySelector(".country-picker");
// if the country picker doesn't exist then we're not on the home page, so don't do anything
if(countryPicker) {
    document.addEventListener('DOMContentLoaded', loadCovidData);
}

const errorContainer = document.querySelector(".error-container");


// load daily new cases in the U.S. and get list of countries tracked
async function loadCovidData() {
    try {
        // fetch and resolve response
        const response = await fetch(url);
        if(!response.ok) throw Error(`Error: ${response.url} ${response.statusText}`);
        const summary = await response.json();

        // update U.S. daily cases
        covidCount.textContent = summary.Countries.find(e=>e.CountryCode === "US").NewConfirmed;

        // load countries
        loadCountries(summary);
    } catch(error) {
        showError(error.message);
    }
}

// load tracked countries for country-specific selection
function loadCountries(summary) {
    let option;
    summary.Countries.forEach(country=>{
        option = document.createElement("option");
        option.setAttribute("label", country.Country);
        countryPicker.append(option);
    });

    // add the event listener which updates countryCount with new daily cases of the country selected
    countryPicker.addEventListener("click", e=>{
        // check if clicked element is an option
        if(e.target.matches("option")) {
            if(e.target.index === 0) {
                countryCount.textContent = 'N/A';
            } else {
                // access and update new cases using the index of the option selected
                countryCount.textContent = summary.Countries[e.target.index - 1].NewConfirmed;
            }
        }
    });
}

function showError(message) {
    errorContainer.textContent = `Error: ${message}. Could not get COVID data.`;
    errorContainer.classList.toggle("hidden");
}