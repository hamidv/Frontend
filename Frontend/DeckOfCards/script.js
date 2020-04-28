(function () {
  let deckContainer = document.querySelector("#deck"),
    suits = ["spades", "diamonds", "clubs", "hearts"],
    cards = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"],
    deck = [];

  const getDeck = () => {
    for (let i = 0; i < suits.length; i++) {
      for (let x = 0; x < cards.length; x++) {
        let card = { Value: cards[x], Suit: suits[i] };
        deck.push(card);
      }
    }

    renderDeck();
  };

  const shuffle = () => {
    // for 1000 turns
    // switch the values of two random cards
    for (let i = 0; i < 1000; i++) {
      let location1 = Math.floor(Math.random() * deck.length);
      let location2 = Math.floor(Math.random() * deck.length);

      let tmp = deck[location1];
      deck[location1] = deck[location2];
      deck[location2] = tmp;
    }

    renderDeck();
  };

  const renderDeck = () => {
    deckContainer.innerHTML = "";

    for (let i = 0; i < deck.length; i++) {
      let card = `
        <div class="card">
            <div class="value">${deck[i].Value}</div>
            <div class="suit ${deck[i].Suit}"></div>
        </div>`;

      deckContainer.innerHTML += card;
    }
  };

  document.querySelector(".shuffle").addEventListener("click", shuffle);

  getDeck();
})();
