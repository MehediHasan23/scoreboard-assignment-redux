//selected element
const addMatchBtn = document.querySelector(".lws-addMatch");
const allMatchContainer = document.querySelector(".all-matches");
const incrementField = document.querySelector(".lws-increment");
const decrementFiled = document.querySelector(".lws-decrement");
const resetBtn = document.querySelector(".lws-reset");
const matchCount = document.querySelector(".lws-matchName");
const result = document.querySelector(".lws-singleResult");

//initialize state
const initialState = {
  match: 1,
  total: 0,
};

//reducer function
const matchReducer = (state = initialState, action) => {
  if (action.type === "add-match") {
    return {
      ...state,
      match: state.match + 1,
    };
  } else if (action.type === "increment") {
    const incValue = action.payload;
    return {
      ...state,
      total: state.total + incValue,
    };
  } else if (action.type === "decrement") {
    let decValue = state.total - action.payload;
    if (decValue < 0) {
      decValue = 0;
    }
    return {
      ...state,
      total: decValue,
    };
  } else if (action.type === "reset") {
    return {
      ...state,
      total: 0,
      match: 0,
    };
  } else {
    return state;
  }
};

const store = Redux.createStore(matchReducer);

//render UI function
function render() {
  const { match, total } = store.getState();
  matchCount.innerHTML = `MATCH ${match}`;
  result.innerHTML = total;
}

store.subscribe(render);
render();

//increment or decrement event handler
function incrementOrDecrement(handler) {
  if (handler.name === "increment") {
    handler.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        store.dispatch({
          type: "increment",
          payload: parseInt(e.target.value),
        });
      }
    });
  } else {
    handler.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        store.dispatch({
          type: "decrement",
          payload: parseInt(e.target.value),
        });
      }
    });
  }
}

//reset function
function resetHandler(resetBtnEl) {
  resetBtnEl.addEventListener("click", function (e) {
    [...allMatchContainer.children].forEach(element => {
      [...element.children].forEach(el => {
        if (el.className === "inc-dec") {
          el.children[0].children[1].value = "";
          el.children[1].children[1].value = "";
        }
      });
    });
  });
}

//add match
addMatchBtn.addEventListener("click", function () {
  store.dispatch({
    type: "add-match",
  });

  const div = document.createElement("div");
  div.classList.add("match");
  div.innerHTML = `
  <div class="wrapper">
  <button class="lws-delete">
    <img src="./image/delete.svg" alt="" />
  </button>
  <h3 class="lws-matchName">Match 1</h3>
</div>
<div class="inc-dec">
  <div class="incrementForm">
    <h4>Increment</h4>
    <input type="number" name="increment" class="lws-increment" />
  </div>

  <div class="decrementForm">
    <h4>Decrement</h4>
    <input type="number" name="decrement" class="lws-decrement" />
  </div>
</div>
<div class="numbers">
  <h2 class="lws-singleResult">120</h2>
</div>
 
  
    `;
  allMatchContainer.appendChild(div);

  //select element
  const incrementField = div.querySelector(".lws-increment");
  const decrementFiled = div.querySelector(".lws-decrement");
  const matchCount = div.querySelector(".lws-matchName");

  //increase or decrease operation
  incrementOrDecrement(incrementField);
  incrementOrDecrement(decrementFiled);
});

//increase or decrease operation
incrementOrDecrement(incrementField);
incrementOrDecrement(decrementFiled);

// reset input
resetHandler(resetBtn);
