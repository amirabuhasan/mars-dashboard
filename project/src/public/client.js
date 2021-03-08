let store = {
  user: { name: 'Student' },
  rovers: ['Curiosity', 'Opportunity', 'Spirit'],
  landingDate: '',
  launchDate: '',
  status: ''
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
  let { rovers } = state;

  return `
        <header></header>
        <main>
            ${Greeting(store.user.name)}
            <section>
                ${Rovers(rovers[0].toLowerCase())}
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

const Rovers = rover => {
  getRoverData(rover);
};

// ------------------------------------------------------  API CALLS
const getRoverData = async rover => {
  try {
    const response = await fetch(`http://localhost:3000/rovers?rover=${rover}`);
    const { landingDate, launchDate, status } = await response.json();
    updateStore(store, { landingDate, launchDate, status });
  } catch (e) {}
};
const getRoverImages = async rover => {
  const page = 1;
  try {
    const response = await fetch(`http://localhost:3000/rovers?rover=${rover}&page=${page}`);
    const data = await response.json();
    console.log(data);
  } catch (e) {}
};
