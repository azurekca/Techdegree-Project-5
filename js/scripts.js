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
 * generates a card div element for each user and appends
 * each card to the main gallery element
 */
function generateMainHTML(users) {
	users.forEach((user, index) => {
		// create a card div to put the user data into
		const div = document.createElement('div');
		div.classList.add('card');
		// give the card div a custom data attribute matching its index in the users array
		div.setAttribute('data-index', index);
		// build the user HTML
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

		// add the user HTML to the card div and append it to the gallery div
		div.innerHTML = userHTML;
		document.getElementById('gallery').appendChild(div);
	});
}

/* === MODAL === */
function generateEmptyModal() {
	const modalDiv = document.createElement('div');
	modalDiv.classList.add('modal-container');
	modalDiv.setAttribute('data-user-index', '');
	const modalHTML = `

    <div class="modal">
        <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
        <div class="modal-info-container">
            <img id="profile" class="modal-img" src="" alt="profile picture">
            <h3 id="name" class="modal-name cap"></h3>
            <p id="email" class="modal-text"></p>
            <p id="location" class="modal-text cap"></p>
            <hr>
            <p id="cell" class="modal-text"></p>
            <p id="address" class="modal-text"></p>
            <p id="dob" class="modal-text"></p>
        </div>
    </div>

    <div class="modal-btn-container">
        <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
        <button type="button" id="modal-next" class="modal-next btn">Next</button>
    </div>
  
  `;
	// add the hteml to the new div
	modalDiv.innerHTML = modalHTML;
	// hide the new div
	modalDiv.style.display = 'none';
	document.body.insertBefore(modalDiv, document.querySelector('script'));
}

function populateModalWithUserData(user, index) {
	const modal = document.querySelector('.modal-container');
	modal.setAttribute('data-user-index', index);

	// get a reference to each modal element that needs to be populated
	const profile = document.getElementById('profile');
	const name = document.getElementById('name');
	const email = document.getElementById('email');
	const location = document.getElementById('location');
	const cell = document.getElementById('cell');
	const address = document.getElementById('address');
	const dob = document.getElementById('dob');

	// populate the modal with the user data
	profile.src = user.picture.large;
	name.innerText = `${user.name.first} ${user.name.last}`;
	email.innerText = user.email;
	location.innerText = user.location.country;
	cell.innerText = user.cell;
	address.innerText = `
    ${user.location.street.number} ${user.location.street.name} 
    ${user.location.city}, ${user.location.state}, ${user.nat}
    ${user.location.postcode}
    `;

	// format the birthday
	const birthday = new Date(user.dob.date);
	dob.innerText = `Birthday: ${birthday.toLocaleDateString()}`;
}

/* === SEARCH === */
// create a search form and add to DOM
function generateSearchForm() {
	// create a form with a search input and search button
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

  // <p> element for displaying when no results found
  const p = document.createElement('p');
  form.appendChild(p);
  
	// append form to page-header div
	document.querySelector('.search-container').appendChild(form);
}

// filter users based on search string
function searchUsers(searchStr) {
  const cards = document.querySelectorAll('.card');
  const searchFeedback = document.querySelector('#search-employees p');
  let feedback;
  let fullName;

  const results = users.filter((user, index) => {
    fullName = `${user.name.first} ${user.name.last}`;
    fullName = fullName.toLowerCase();
    // add user to results if search string is within full name
    // note that an empty search returns true
    if (fullName.includes(searchStr)) {
      // show card
      cards[index].style.display = '';
      // add user to list
      return user;
    } else {
      // hide card
      cards[index].style.display = 'none';
    }
  })

  if (results.length > 0) {
    feedback = `${results.length} results found`;
  } else {
    feedback = 'Sorry, there was no one found with that name.'
  }
  searchFeedback.textContent = feedback;

}

// call function to get user data from randomUserAPI
// set the global users variable to the array of users
// and then call function to show users on the page
getUserData()
	.then(data => (users = data.results))
	.then(() => generateMainHTML(users))
	.catch(error => console.error(error));

/** call function to generate and hide the user details modal */
generateSearchForm();
generateEmptyModal();

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
      prevIndex--
    }
		if (prevIndex > -1) {
			populateModalWithUserData(users[prevIndex], prevIndex);
		}

		// show next user
	} else if (event.target.closest('#modal-next')) {
    let nextIndex = +modal.dataset.userIndex + 1;
    while (nextIndex < users.length && cards[nextIndex].style.display === 'none') {
      nextIndex++
    }
		if (nextIndex < users.length) {
			populateModalWithUserData(users[nextIndex], nextIndex);
    }
  }
});

function checkIfDisplayed(index) {
  
  
  return index;
}


/** Listen to search form submit */
document.getElementById('search-employees').addEventListener('submit', event => {
  event.preventDefault();
  const searchStr = document.getElementById('search-input').value.toLowerCase();
  searchUsers(searchStr);
})