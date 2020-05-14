/* Treehouse FSJS Techdegree
 * Project 5 - Public API Requests
 * scripts.js */

const NUM_USERS = 'results=12';
const NATIONALITIES = 'nat=au,ca,gb,ie,nz,us';
const randomUserURL = `https://randomuser.me/api/?${NUM_USERS}&${NATIONALITIES}`;
let users;

/**
 * Use the fetch API to retrieve 12 random users
 * @returns {object} JSON object of the retrieved users
 */
async function getUserData() {
	try {
		const response = await fetch(randomUserURL);
		return await response.json();
	} catch (error) {
		throw error;
	}
}

/* === USER CARDS === */
/**
 * generates a card div element for each employee (user) and appends
 * each card to the main gallery element
 */
function generateMainHTML(users) {
	users.forEach((user, index) => {
		// create a card div to put the user data into
		const div = document.createElement('div');
		div.classList.add('card');
		// give the card div a custom data attribute matching its index in the users array
		div.setAttribute('data-index', index);
		// build the HTML
		const userHTML = `
    
      <div class="card-img-container">
          <img class="card-img" src="${user.picture.medium}" alt="profile picture">
      </div>
      <div class="card-info-container">
          <h3 class="card-name cap">${user.name.first} ${user.name.last}</h3>
          <p class="card-text">${user.email}</p>
          <p class="card-text cap">${user.location.city}, ${user.location.country}</p>
      </div>
  
    `;

		div.innerHTML = userHTML;
		document.getElementById('gallery').appendChild(div);
	});
}

/* === MODAL === */
/**
 * generates the html for the employee contact and address details
 */
function generateEmptyModal() {
	const modalSection = document.createElement('section');
	modalSection.classList.add('modal-container');
	modalSection.setAttribute('data-user-index', '');
	const modalHTML = `

    <div class="modal">
        <button type="button" id="modal-close-btn" class="modal-close-btn">close</button>
        <address class="modal-info-container">
          <img id="profile" class="modal-img" src="" alt="profile picture">
          <h3 id="name" class="modal-name cap"></h3>
          <p id="email" class="modal-text"></p>
          <p id="location" class="modal-text cap"></p>
          <div class="modal__address-details">
            <p id="cell" class="modal-text"></p>
            <p id="address" class="modal-text"></p>
            <p id="dob" class="modal-text"></p>
          </div>
        </address>
    </div>

    <div class="modal-btn-container">
        <button type="button" id="modal-prev" class="btn" >Prev</button>
        <button type="button" id="modal-next" class="btn">Next</button>
    </div>
  
  `;

	modalSection.innerHTML = modalHTML;
	modalSection.style.display = 'none';
	document.body.insertBefore(modalSection, document.querySelector('script'));
}

/**
 * Update the modal HTML with a user's data
 * @param {object} user   User object from the users array
 * @param {number} index  index of the user object in the users array
 */
function populateModalWithUserData(user, index) {
  const modal = document.querySelector('.modal-container');
  
  // Update the custom data attribute with the user's index
	modal.setAttribute('data-user-index', index);

	// get a reference to each HTML element that needs to be populated
	const profile = document.getElementById('profile');
	const name = document.getElementById('name');
	const email = document.getElementById('email');
	const location = document.getElementById('location');
	const cell = document.getElementById('cell');
	const address = document.getElementById('address');
	const dob = document.getElementById('dob');

	// populate the HTML elements with the user data
	profile.src = user.picture.large;
	name.textContent = `${user.name.first} ${user.name.last}`;
	email.textContent = user.email;
	location.textContent = user.location.country;
	cell.textContent = user.cell;
  address.innerText = `${user.location.street.number} ${user.location.street.name}
    ${user.location.city}, ${user.location.state}, ${user.nat}
    ${user.location.postcode}`;

	// format the birthday to a local data format
	const birthday = new Date(user.dob.date);
	dob.innerText = `Birthday: ${birthday.toLocaleDateString()}`;
}

/* === SEARCH === */
/** * Generate a search form and add it to the header */
function generateSearchForm() {
	const form = document.createElement('form');
	form.id = 'search-employees';

	// search input
	const input = document.createElement('input');
	input.setAttribute('type', 'search');
	input.setAttribute('id', 'search-input');
	input.placeholder = 'Search employees by name';
	form.appendChild(input);

	// submit button
	const button = document.createElement('button');
	button.setAttribute('type', 'search');
	button.textContent = 'search';
	form.appendChild(button);

	document.querySelector('.search-container').appendChild(form);
}

/** element for displaying when no results found */
function generateElementForShowingFeedback() {
	const p = document.createElement('p');
	p.id = 'feedback';
	p.style.display = 'none';
	document.querySelector('header').appendChild(p);
}

/**
 * Uses search string app user typed in and hides employee cards that 
 * did not match. An empty search string will display all the employees.
 * @param {string} searchStr user input to search for
 */
function searchUsers(searchStr) {
	const cards = document.querySelectorAll('.card');
	let fullName;

	const results = users.filter((user, index) => {
		fullName = `${user.name.first} ${user.name.last}`;
		fullName = fullName.toLowerCase();
		if (fullName.includes(searchStr)) {
			// show card
			cards[index].style.display = '';
			// add user to list
			return user;
		} else {
			// hide card
			cards[index].style.display = 'none';
		}
	});
  // inform user of how many employees were found, if any
  if (searchStr === '') {
    updateFeedback('', false);
  } else if (results.length > 0) {
    updateFeedback(`${results.length} results found`, true);
	} else {
    updateFeedback('Sorry, there was no one found with that name.', true)
	}
}
/**
 * Updates the page with a feedback message. Show or hide message.
 * @param {string} message  Test to put in message
 * @param {Boolean} show    true = show; false = hide
 */
function updateFeedback(message, show) {
  const searchFeedback = document.getElementById('feedback');
  const display = show ? '' : 'none';
  searchFeedback.textContent = message;
  searchFeedback.style.display = display;
}

/** call functions to generate additional page elements */
generateSearchForm();
generateElementForShowingFeedback()
generateEmptyModal();

// call function to get user data from randomUserAPI
// set the global users variable to the array of users
// and then call function to show users on the page
getUserData()
	.then(data => (users = data.results))
	.then(() => generateMainHTML(users))
	.catch(error => {
    console.error(error);
    updateFeedback('Something went wrong with getting the employee directory', true);
  });

/** Listen to all clicks on the document */
document.addEventListener('click', event => {
	const modal = document.querySelector('.modal-container');
	const cards = document.querySelectorAll('.card');

	// open the modal
	if (event.target.closest('.card')) {
		const card = event.target.closest('.card');
		const userIndex = card.dataset.index;
		populateModalWithUserData(users[userIndex], userIndex);
		modal.style.display = '';

		// close the modal
	} else if (event.target.closest('#modal-close-btn')) {
		modal.style.display = 'none';

		// show prev user
	} else if (event.target.closest('#modal-prev')) {
		let prevIndex = modal.dataset.userIndex - 1;
		while (prevIndex > -1 && cards[prevIndex].style.display === 'none') {
			prevIndex--;
		}
		if (prevIndex > -1) {
			populateModalWithUserData(users[prevIndex], prevIndex);
		}

		// show next user
	} else if (event.target.closest('#modal-next')) {
		let nextIndex = +modal.dataset.userIndex + 1;
		while (nextIndex < users.length && cards[nextIndex].style.display === 'none') {
			nextIndex++;
		}
		if (nextIndex < users.length) {
			populateModalWithUserData(users[nextIndex], nextIndex);
		}
	}
});

/** Listen to search form submit */
document.getElementById('search-employees').addEventListener('submit', event => {
	event.preventDefault();
	const searchStr = document.getElementById('search-input').value.toLowerCase();
	searchUsers(searchStr);
});
