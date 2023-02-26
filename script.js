// element selection
const addMatchBtn = document.querySelector(".lws-addMatch");
const matchContainer = document.querySelector(".all-matches");

// action identifiers
const ADD_MATCH = "add-match";
const INCREMENT = "increment";
const DECREMENT = "decrement";
const DELETE_MATCH = "deleteMatch";
const RESET_ALL = "reset";

/* state */
const initialState = [
  {
    id: 1,
    total: 0,
  },
];

/* reducer */
const matchReducer = (state = initialState, action) => {
  const { type, payload } = action;
  const newState = structuredClone(state);

  switch (type) {
    case ADD_MATCH:
      newState.push(payload);
      return newState;

    case DELETE_MATCH:
      const index = newState.findIndex(match => match.id === payload.id);
      newState.splice(index, 1);
      return newState;

    case INCREMENT:
      return newState.map(match => {
        if (match.id === payload.id) {
          match.total += payload.value;
        }

        return match;
      });

    case DECREMENT:
      return newState.map(match => {
        if (match.id === payload.id) {
          match.total =
            match.total - payload.value < 0 ? 0 : match.total - payload.value;
        }

        return match;
      });

    case RESET_ALL:
      return newState.map(match => {
        match.total = 0;
        return match;
      });

    default:
      return state;
  }
};

const store = Redux.createStore(matchReducer);

//actions

//add-match
function addMatch() {
  const state = store.getState();
  const id = state[state.length - 1] ? state[state.length - 1].id + 1 : 1;
  return {
    type: ADD_MATCH,
    payload: {
      id,
      total: 0,
    },
  };
}

//delete
function deleteMatch(id) {
  return {
    type: DELETE_MATCH,
    payload: { id },
  };
}

//increment value
function increment(id, value) {
  return {
    type: INCREMENT,
    payload: {
      id,
      value,
    },
  };
}

//increment value
function decrement(id, value) {
  return {
    type: DECREMENT,
    payload: {
      id,
      value,
    },
  };
}

//reset all
function reset() {
  return {
    type: RESET_ALL,
  };
}

//add new match
const newAddedMatch = match => {
  const { id, total } = match;
  return `
      <div class="match">
          <div class="wrapper">
            <button class="lws-delete" onclick="deleteOne(${id})">
              <img src="./image/delete.svg" alt="" />
            </button>
            <h3 class="lws-matchName">Match ${id}</h3>
          </div>
          <div class="inc-dec">
            <form  onsubmit='incrementValue(event, ${id})'class="incrementForm">
              <h4>Increment</h4>
              <input type="number" name="increment" class="lws-increment" />
            </form>
            <form onsubmit='decrementValue(event, ${id})' class="decrementForm">
              <h4>Decrement</h4>
              <input type="number" name="decrement" class="lws-decrement" />
            </form>
          </div>
          <div class="numbers">
            <h2 class="lws-singleResult">${total}</h2>
          </div>
        </div>
  
  `;
};

//render function
function render() {
  const matches = store.getState();
  const matchEl = matches.map(match => newAddedMatch(match));
  matchContainer.innerHTML = matchEl;
}

store.subscribe(render);
render();

//add match event
addMatchBtn.addEventListener("click", () => store.dispatch(addMatch()));

/* delete-match */
function deleteOne(id) {
  store.dispatch(deleteMatch(id));
}

/* increment-value */
function incrementValue(event, id) {
  event.preventDefault();
  const value = Math.abs(parseInt(event.target[0].value));

  store.dispatch(increment(id, value));
}

/* decrement-value */
function decrementValue(event, id) {
  event.preventDefault();
  const value = Math.abs(parseInt(event.target[0].value));

  store.dispatch(decrement(id, value));
}

/* function reset */
function resetHandler() {
  store.dispatch(reset());
}
