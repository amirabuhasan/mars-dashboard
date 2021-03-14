let store = Immutable.Map({
  user: { name: 'Student' },
  rovers: ['Curiosity', 'Opportunity', 'Spirit'],
  data: null,
  selectedRover: 'Curiosity',
  photos: []
});

// add our markup to the page
const root = document.getElementById('root');

const updateStore = (store, newState) => {
  const updatedStore = store.merge(store, newState);
  render(root, updatedStore);
  return updatedStore;
};

const render = async (root, state) => {
  root.innerHTML = App(state.toJS());
};

// create content
const App = state => {
  let { selectedRover, data, photos, rovers, user } = state;
  return `
        <header></header>
        <main>
            ${Greeting(user.name)}
            <section>
                <div class="RoverName">
                  <h3>${selectedRover}</h3>
                  <label>
                    Select a rover:
                    <select id="SelectRover" name="rovers" onchange="onChange(this, updateStore)">
                      ${rovers
                        .map(
                          r =>
                            `<option value=${r} ${
                              selectedRover === r ? 'selected' : ''
                            }>${r}</option>`
                        )
                        .join('')}
                    </select>
                  </label>
                </div>
                ${RoverInfo(data, photos)}
            </section>
        </main>
        <footer></footer>
    `;
};

// listening for load event because page should load before any JS is called
window.addEventListener('load', () => {
  render(root, store);
  getRoverData('Curiosity', updateStore);
});
// ------------------------------------------------------  COMPONENTS
const onChange = ({ value }, update) => {
  getRoverData(value, update);
};
// Pure function that renders conditional information -- THIS IS JUST AN EXAMPLE, you can delete it.
const Greeting = name => {
  return `<h1 class="Greeting">${name ? `Welcome, ${name}` : 'Hello'}!</h1>`;
};

const RoverInfo = (data, photos) => {
  if (!data) {
    return `<div class="RoverInfo">Loading rover info...</div>`;
  }
  const { landingDate, launchDate, maxDate, status } = data;
  return `
    <div class="RoverInfo">
      <div>
        <span>Landing Date: ${landingDate}</span>
      </div>
      <div>
        <span>Launch Date: ${launchDate}</span>
      </div>
      <div>
        <span>Current status: ${status}</span>
      </div>
      <div>
        <span>Date photos taken: ${maxDate}</span>
      </div>
    </div>
     ${RoverPhotos(photos)}
  `;
};

const RoverPhotos = photos => {
  if (!photos || photos.length === 0) {
    return `
    <div>Loading photos...</div>
    `;
  }
  return `
    <div class="RoverPhotos">
      ${photos
        .map(p => {
          return `<img class="RoverPhoto" src=${p.imgSrc} />`;
        })
        .join('')}
    </div>
  `;
};

// ------------------------------------------------------  API CALLS
const getRoverData = async (rover, update) => {
  try {
    update(store, {
      data: null,
      photos: [],
      selectedRover: rover
    });
    const response = await fetch(`http://localhost:3000/rovers?rover=${rover}`);
    const data = await response.json();
    const { landingDate, launchDate, status, maxDate, maxSol } = data;
    const newStore = update(store, {
      data: { landingDate, launchDate, status, maxDate }
    });
    await getRoverPhotos(rover, maxSol, update, newStore);
  } catch (e) {}
};
const getRoverPhotos = async (rover, sol, update, store) => {
  try {
    const response = await fetch(`http://localhost:3000/photos?rover=${rover}&sol=${sol}`);
    const data = await response.json();
    update(store, { photos: data.photos });
  } catch (e) {}
};
