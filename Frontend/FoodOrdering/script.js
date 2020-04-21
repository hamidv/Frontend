(function () {
  // variables
  let searchInput = document.querySelector("#searchInput"),
    mainRow = document.querySelector("#RestaurantList"),
    errorMessageElement = document.querySelector("#NotificationMessage"),
    selectSorting = document.querySelector("#dropdown-sort"),
    selectFilter = document.querySelector("#dropdown-filter"),
    allRestaurantsDataCopy = [];

  // getting data using fetch form API
  let getData = () =>
    fetch("http://localhost/data.json").then((data) => data.json());

  // returns a restaurant card
  let getRetaurantCard = (restaurant) => {
    return `<div class="card">
                <img class="card-img-top" src="${restaurant.img}" alt="Card image" />
                <div class="card-body">
                    <h6 class="card-title">${restaurant.name}</h6>
                    <p class="tags">${restaurant.tags}</p>
                    <div class="details">
                        <div class="rating">
                            &#11088;${restaurant.rating}
                        </div>
                        <span class="eta"> ETA ${restaurant.eta} Min</span>
                        <a href="#" class="view-menu">View Menu</a>
                    </div>
                </div>
            </div>`;
  };

  // generate view
  let generateView = (data) =>
    data.map((restaurant) => getRetaurantCard(restaurant));

  // display all the retaurants
  let displayAllRetaurants = () => {
    getData()
      .then((data) => {
        allRestaurantsDataCopy = JSON.parse(JSON.stringify(data));
        mainRow.innerHTML = generateView(data).join("");
      })
      .catch(
        (error) =>
          (errorMessageElement.innerText =
            "Something bad Happend!! We are Working on it")
      );
  };

  // display searched restaurants as per entered text and showing result by tags
  function searchResult() {
    let searchMatchingRestaurants = allRestaurantsDataCopy.filter(
      (restaurant) =>
        restaurant.name
          .toString()
          .toUpperCase()
          .indexOf(searchInput.value.toUpperCase()) > -1
    );
    mainRow.innerHTML = generateView(searchMatchingRestaurants).join("");
    errorMessageElement.innerText =
      searchMatchingRestaurants == 0
        ? `No restaurants found for: ${searchInput.value}`
        : "";

    document.querySelector(".dropdown-filter").innerHTML = "Filter by";
  }

  // debounce function which takes search function and delay
  let debounce = (fn, delay) => {
    let timeout;
    return function () {
      clearTimeout(timeout);
      timeout = setTimeout(() => fn(), delay);
    };
  };

  let search = debounce(searchResult, 400);

  // searching for restaurant by name
  searchInput.addEventListener("keyup", search);

  // sorting all the restaurants
  selectSorting.addEventListener("click", (e) => {
    if (e.target.dataset.value === "Name") {
      let sortByEta = allRestaurantsDataCopy.sort((restaurant1, restaurant2) =>
        restaurant1.name > restaurant2.name ? 1 : -1
      );
      mainRow.innerHTML = generateView(sortByEta).join("");
    } else if (e.target.dataset.value === "ETA") {
      let sortByEta = allRestaurantsDataCopy.sort(
        (restaurant1, restaurant2) => restaurant1.eta - restaurant2.eta
      );
      mainRow.innerHTML = generateView(sortByEta).join("");
    } else if (e.target.innerText === "Rating") {
      let sortByRating = allRestaurantsDataCopy.sort(
        (restaurant1, restaurant2) => restaurant2.rating - restaurant1.rating
      );
      mainRow.innerHTML = generateView(sortByRating).join("");
    }

    document.querySelector(".dropdown-sort").innerHTML =
      "Sorted by: " + e.target.innerHTML;
    document.querySelector(".dropdown-filter").innerHTML = "Filter by";
  });

  // filter the restaurants as per tags
  selectFilter.addEventListener("click", (e) => {
    let filteredRestaurants = allRestaurantsDataCopy.filter(
      (restaurant) =>
        restaurant.tags
          .toString()
          .toUpperCase()
          .indexOf(e.target.dataset.value.toUpperCase()) > -1
    );
    mainRow.innerHTML = generateView(filteredRestaurants).join("");
    errorMessageElement.innerText =
      filteredRestaurants.length == 0
        ? `No restaurants belong to ${e.target.innerText}`
        : "";

    document.querySelector(".dropdown-filter").innerHTML =
      e.target.dataset.value != ""
        ? "Filtered by: " + e.target.innerHTML
        : "Filter by";
  });

  // show all restaurants
  displayAllRetaurants();
})();
