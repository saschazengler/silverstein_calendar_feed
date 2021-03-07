import { convert_country_code, country_codes } from './iso_3166.js';

const apple_all = document.getElementsByClassName('apple-all')[0];
const apple_canada = document.getElementsByClassName('apple-canada')[0];
const apple_united_states = document.getElementsByClassName('apple-united-states')[0];
const apple_european = document.getElementsByClassName('apple-europe')[0];

const google_all = document.getElementsByClassName('google-all')[0];
const google_canada = document.getElementsByClassName('google-canada')[0];
const google_united_states = document.getElementsByClassName('google-united-states')[0];
const google_european = document.getElementsByClassName('google-europe')[0];

const all_buttons = [apple_all, apple_canada, apple_united_states, apple_european, google_all, google_canada, google_united_states, google_european];

all_buttons.forEach(button => {
    button.addEventListener('click', (event) => {save_new_click(event.target.className)});
})


async function save_new_click(button_name) {    
    const response = await fetch(`/calendar/${button_name}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(res => {
        if (!res.ok) {
            throw 'Error';
        };
        return response.json();
    })
    .catch(err => console.log(err));
};


const url = 'https://ipinfo.io';


async function api_connector(url, method) {
    const response = await fetch(url, {
        method: `${method}`,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer 3dd950f5a064a6`,
            'Accept': 'application/json'
        }
    })
    return response.json();
};


function get_user_location() {
    api_connector(url, 'GET')
        .then(data => {          
            const user_data = {
                city: data.city,
                country: convert_country_code(country_codes, data.country)
            };
            add_user_location(user_data);
        })
        .catch(err => console.log(err));
};


async function add_user_location(user_data) {
    const response = await fetch('/location', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user_data)
    })
    .then(res => res.json())
    .catch(err => console.log(err));
}


window.onload = get_user_location();