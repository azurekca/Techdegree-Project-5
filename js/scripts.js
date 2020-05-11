/* Treehouse FSJS Techdegree
 * Project 5 - Public API Requests
 * scripts.js */

const NUM_USERS = 12;
const randomUserURL = `https://randomuser.me/api/?results=${NUM_USERS}`;
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
/**
 * generates a card div element for each user and appends
 * each card to the main gallery element
 */
function generateMainHTML() {
	users.forEach((user, index) => {
    // create a card div to put the user data into
		const div = document.createElement('div');
		div.classList.add('card');
    // give the card div a custom data attribute matching its index in the users array
    div.setAttribute('data-index', index)
    // build the user HTML
		const userHTML = `
    
      <div class="card-img-container">
          <img class="card-img" src="${user.picture.medium}" alt="profile picture">
      </div>
      <div class="card-info-container">
          <h3 class="card-name cap">${user.name.first} ${user.name.last}</h3>
          <p class="card-text">${user.email}</p>
          <p class="card-text cap">${user.location.city}, ${user.location.state}</p>
      </div>
  
    `;

    // add the user HTML to the card div and append it to the gallery div
		div.innerHTML = userHTML;
    document.getElementById('gallery').appendChild(div);
	});
}

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
    ${user.location.street.number}
    ${user.location.street.name}, 
    ${user.location.city},
    ${user.location.state}
    ${user.location.postcode}
    `;
  dob.innerText = `Birthday: ${user.dob.date}`; // need to format the birthday
}

// call function to get user data from randomUserAPI
// set the global users variable to the array of users
// and then call function to show users on the page
getUserData()
  .then(data => (users = data.results))
  .then(generateMainHTML)
  .catch(error => console.error(error));

/** call function to generate and hide the user details modal */ 
generateEmptyModal();


/** Listen to all clicks on the document */ 
document.addEventListener('click', (event) => {
  const modal = document.querySelector('.modal-container');

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
    const prevIndex = modal.dataset.userIndex - 1;
    if (prevIndex > -1) {
      populateModalWithUserData(users[prevIndex], prevIndex);
    }

    // show next user
  } else if (event.target.closest('#modal-next')) {
    console.log('next');
    const nextIndex = +modal.dataset.userIndex + 1;
    if (nextIndex < users.length) {
      populateModalWithUserData(users[nextIndex], nextIndex);
    }

    // do nothing, this is here for testing
  } else {
    console.log('nothing important was clicked');
  }
});