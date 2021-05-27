import './sass/main.scss';
import fetchCountry from './js/fetchCountries.js';
import { debounce } from 'lodash';
import countryListTemplate from './template/countries-list.hbs';
import countryCardTemplate from './template/country-card.hbs';

import { error } from '@pnotify/core';
import '@pnotify/core/dist/BrightTheme.css';


const input = document.querySelector('.input-js');
const wrapperCountries = document.querySelector('.wrapper-for-countries')

input.addEventListener('input', debounce(takeValueOnInput, 500));

function takeValueOnInput(e) {
    clearContainer();
    let inputValue = e.target.value.trim();

    if (!input.value || input.value === ' ') return;

    fetchCountry(inputValue).then(countries => {

        if (countries.length > 10) {
            error({
                text: 'Too many matches found. Please enter a more specific query!',
                mode: 'light',
                shadow: true,
                closer: true,
                sticker: false,
                hide: true,
                delay: 2000,
            });
            return;
        }

        if (countries.length >= 2 && countries.length <= 10) {
            renderCountryList(countries);
        }
        if (countries.length === 1) {
            renderCountryCard(countries);
            clearInput();
        }
    })
        .catch(showFetchError);
};

function renderCountryList(countries) {
    const template = countryListTemplate(countries);
    wrapperCountries.innerHTML = template;
};

function renderCountryCard(countryName) {
    const templateCard = countryCardTemplate(countryName);
    wrapperCountries.innerHTML = templateCard;
};

function clearContainer() {
    wrapperCountries.innerHTML = '';
};

function clearInput() {
    input.value = '';
};

function showFetchError(err) {
    error({
        text: `${err}`,
        mode: 'dark',
        closer: true,
        shadow: true,
        sticker: false,
        hide: true,
        delay: 2000,
    });
};