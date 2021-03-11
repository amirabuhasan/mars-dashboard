let store = {
  user: { name: 'Student' },
  rovers: ['Curiosity', 'Opportunity', 'Spirit'],
  data: null,
  selectedRover: 'Curiosity',
  photos: []
};

// add our markup to the page
const root = document.getElementById('root');

const updateStore = (store, newState) => {
  store = Object.assign(store, newState);
  render(root, store);
};

const render = async (root, state) => {
  root.innerHTML = App(state);
};

// create content
const App = state => {
  let { selectedRover, data, photos, rovers } = state;
  if (data === null) {
    getRoverData(selectedRover);
  }

  return `
        <header></header>
        <main>
            ${Greeting(store.user.name)}
            <section>
                <div class="RoverName">
                  <h3>${selectedRover}</h3>
                  <label>
                    Select a rover:
                    <select id="SelectRover" name="rovers" onchange="onChange(this)">
                      ${rovers.map(
                        r =>
                          `<option value=${r} ${
                            selectedRover === r ? 'selected' : ''
                          }>${r}</option>`
                      )}
                    </select>
                  </label>
                </div>
                ${RoverInfo(data)}
                ${RoverPhotos(photos)}
            </section>
        </main>
        <footer></footer>
    `;
};

// listening for load event because page should load before any JS is called
window.addEventListener('load', () => {
  render(root, store);
});
// ------------------------------------------------------  COMPONENTS
const onChange = ({ value }) => {
  getRoverData(value);
};
// Pure function that renders conditional information -- THIS IS JUST AN EXAMPLE, you can delete it.
const Greeting = name => {
  return `<h1 class="Greeting">${name ? `Welcome, ${name}` : 'Hello'}!</h1>`;
};

const RoverInfo = data => {
  if (!data) {
    return `<div class="RoverInfo">Loading rover info...</div>`;
  }
  const { landingDate, launchDate, status } = data;
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
    </div>
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
      ${photos.map(p => {
        return `<img class="RoverPhoto" src=${p.imgSrc} />`;
      })}
    </div>
  `;
};

// ------------------------------------------------------  API CALLS
const getRoverData = async rover => {
  try {
    const response = await fetch(`http://localhost:3000/rovers?rover=${rover}`);
    const data = await response.json();
    const { landingDate, launchDate, status, maxDate, maxSol } = data;
    updateStore(store, {
      data: { landingDate, launchDate, status, maxDate },
      selectedRover: rover
    });
    await getRoverPhotos(rover, maxSol);
  } catch (e) {}
};
const getRoverPhotos = async (rover, sol, page = 1) => {
  try {
    const response = await fetch(
      `http://localhost:3000/photos?rover=${rover}&sol=${sol}&page=${page}`
    );
    const data = await response.json();
    updateStore(store, { photos: data.photos });
  } catch (e) {}
};
