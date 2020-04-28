/**
 *
 * Manipulating the DOM exercise.
 * Exercise programmatically builds navigation,
 * scrolls to anchors from navigation,
 * and highlights section in viewport upon scrolling.
 *
 * Dependencies: None
 *
 * JS Version: ES2015/ES6
 *
 * JS Standard: ESlint
 *
 */

/* Define Global Variables */
const sections = document.getElementsByTagName("section");
const navbarList = document.getElementById("navbar__list");
const navbarMenu = document.querySelector(".navbar__menu");
/* End Global Variables */

/* Start Helper Functions */
const createNavItems = (container, isMenu = false) => {
  for (let section of sections) {
    let hrefVal = "javascript:void(0)";
    if (isMenu) {
      hrefVal = "#" + section.id;
    }
    const li = `<li><a href='${hrefVal}' class='menu__link' data-target='${section.id}'>${section.dataset.nav}</a></li>`;
    container.innerHTML += li;
  }
};
const navItemClick = (e) => {
  if (e.target.nodeName === "A") {
    const selectedSection = document.getElementById(e.target.dataset.target);
    setActiveSection(selectedSection);

    window.scrollTo(0, selectedSection.offsetTop);
  }
};
const menuItemClick = (e) => {
  if (e.target.nodeName === "A" && e.target.className !== "closebtn") {
    const selectedSection = document.getElementById(e.target.dataset.target);
    setActiveSection(selectedSection);
  }
};
const setActiveSection = (section) => {
  const prevSection = document.querySelector(".your-active-class");

  if (section && prevSection && section.id != prevSection.id) {
    prevSection.classList.remove("your-active-class");
    navbarList.querySelector("[data-target=" + prevSection.id + "]").classList.remove("active");
    document.querySelector("#sidenav [data-target=" + prevSection.id + "]").classList.remove("active");

    section.classList.add("your-active-class");
    navbarList.querySelector("[data-target=" + section.id + "]").classList.add("active");
    document.querySelector("#sidenav [data-target=" + section.id + "]").classList.add("active");
  } else {
    if (!navbarList.querySelector("[data-target=" + section.id + "]").classList.contains("active")) {
      navbarList.querySelector("[data-target=" + section.id + "]").classList.add("active");
    }
    if (!document.querySelector("#sidenav [data-target=" + section.id + "]").classList.contains("active")) {
      document.querySelector("#sidenav [data-target=" + section.id + "]").classList.add("active");
    }
  }
};
const openNav = () => {
  document.getElementById("sidenav").style.width = "250px";
};
const closeNav = () => {
  document.getElementById("sidenav").style.width = "0";
};
/* End Helper Functions */

/* Begin Main Functions */
// build the nav
navbarList.innerHTML = "";
createNavItems(navbarList);

// Build menu
const navbarMenuSpan = document.createElement("span");
navbarMenuSpan.setAttribute("onclick", "openNav()");
navbarMenuSpan.innerHTML = "&#9776";
navbarMenu.insertAdjacentElement("afterbegin", navbarMenuSpan);

const sideNavFragment = document.createDocumentFragment();

const divSideNav = document.createElement("div");
divSideNav.setAttribute("id", "sidenav");
divSideNav.setAttribute("class", "sidenav");

const sideNavList = document.createElement("ul");
sideNavList.innerHTML = `<a href="javascript:void(0)" class="closebtn" onclick="closeNav()">&times;</a>`;
createNavItems(sideNavList, true);
divSideNav.appendChild(sideNavList);

sideNavFragment.appendChild(divSideNav);
document.body.appendChild(sideNavFragment);

// Scroll to section on link click
divSideNav.addEventListener("click", menuItemClick);

// Add class 'active' to section when near top of viewport
navbarList.addEventListener("click", navItemClick);

// Scroll to anchor ID using scrollTO event
window.addEventListener("scroll", (e) => {
  const section = [...sections].filter((section) => section.getBoundingClientRect().y >= 0)[0];
  setActiveSection(section);
});
  /* End Main Functions */

/* Begin Events */
setActiveSection(sections[0]);

/* End Events */
