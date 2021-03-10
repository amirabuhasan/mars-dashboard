let store = {
  user: { name: 'Student' },
  rovers: ['Curiosity', 'Opportunity', 'Spirit'],
  data: null,
  selectedRover: 'Curiosity'
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
  let { selectedRover, data } = state;
  if (data === null) {
    getRoverData(selectedRover);
  }

  return `
        <header></header>
        <main>
            ${Greeting(store.user.name)}
            <section>
                <div>
                  <h3>${selectedRover}</h3>
                </div>
                ${RoverInfo(data)}
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

// Pure function that renders conditional information -- THIS IS JUST AN EXAMPLE, you can delete it.
const Greeting = name => {
  if (name) {
    return `
            <h1>Welcome, ${name}!</h1>
        `;
  }

  return `
        <h1>Hello!</h1>
    `;
};

const RoverInfo = data => {
  if (!data) {
    return `<div>Loading...</div>`;
  }
  const { landingDate, launchDate, status } = data;
  return `
    <div>
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

// ------------------------------------------------------  API CALLS
const getRoverData = async rover => {
  try {
    const response = await fetch(`http://localhost:3000/rovers?rover=${rover}`);
    const data = await response.json();
    const { landingDate, launchDate, status, maxDate } = data;
    updateStore(store, { data: { landingDate, launchDate, status, maxDate } });
  } catch (e) {}
};
const getRoverImages = async rover => {
  const page = 1;
  try {
    const response = await fetch(`http://localhost:3000/rovers?rover=${rover}&page=${page}`);
    const data = await response.json();
  } catch (e) {}
};
