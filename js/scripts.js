/* Treehouse FSJS Techdegree
 * Project 5 - Public API Requests
 * scripts.js */

const NUM_USERS = 12;
const randomUserURL = `https://randomuser.me/api/?results=${NUM_USERS}`;
let users;

async function getUserData() {
	const response = await fetch(randomUserURL);
	return await response.json();
}
/**
 * generates a card div element for each user and appends
 * each card to the main gallery element
 */
function generateMainHTML() {
	users.forEach(user => {
    // create a card div to put the user data into
		const div = document.createElement('div');
		div.classList.add('card');

    // build the user HTML
		const userHTML = `
    
      <div class="card-img-container">
          <img class="card-img" src="${user.picture.medium}" alt="profile picture">
      </div>
      <div class="card-info-container">
          <h3 id="name" class="card-name cap">${user.name.first} ${user.name.last}</h3>
          <p class="card-text">${user.email}</p>
          <p class="card-text cap">${user.location.city}, ${user.location.state}</p>
      </div>
  
    `;

    // add the user HTML to the card div and append it to the gallery div
		div.innerHTML = userHTML;
		document.getElementById('gallery').appendChild(div);
	});
}

function generateModalHTML(user) {}

getUserData().then(data => (users = data.results)).then(generateMainHTML).catch(error => console.error(error));
