
let big = document.getElementById("bigSidebar");
let mini = document.getElementById("miniSidebar");
let menuBtn = document.getElementById("menu");
let toggleBtn = document.getElementById("toggle");
let menuList = $(".menu-list");
const apiKey = "eba8b9a7199efdcb0ca1f96879b83c44";
const searchInput = document.getElementById('searchInput');
const movieContainer = document.getElementById('moviesContainer');
let nameInput = document.getElementById('name');
let phoneInput = document.getElementById('phone');
let emailInput = document.getElementById('email');
let ageInput = document.getElementById('age');
let passwordInput = document.getElementById('password');
let repasswordInput = document.getElementById('repassword');
let submitBtn = document.getElementById('submit');
//===============>regex
const nameRegex = /^[A-Z][A-Za-z0-9 ]{3,}$/;
const emailRegex = /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/;
const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
const ageRegex = /^(1[7-9]|[2-9]\d)$/;
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
//validate Form
function validate(regex, input) {
  if (regex.test(input.value)) {
    input.nextElementSibling.classList.add("invisible");
    input.classList.remove("is-invalid");
    input.classList.add("is-valid");
    return true;
  } else {
    input.nextElementSibling.classList.remove("invisible");
    input.classList.remove("is-valid");
    input.classList.add("is-invalid");
    return false;
  }
}
// repassword validation
function validateRepassword(passwordInput, repasswordInput) {
  if (
    passwordInput.value === repasswordInput.value &&
    repasswordInput.value !== ""
  ) {
    repasswordInput.nextElementSibling.classList.add("invisible");
    repasswordInput.classList.remove("is-invalid");
    repasswordInput.classList.add("is-valid");
    return true;
  } else {
    repasswordInput.nextElementSibling.classList.remove("invisible");
    repasswordInput.classList.remove("is-valid");
    repasswordInput.classList.add("is-invalid");
    return false;
  }
}
//submit state
function updateSubmitState() {
  let hasError =
    !validate(nameRegex, nameInput) ||
    !validate(emailRegex, emailInput) ||
    !validate(phoneRegex, phoneInput) ||
    !validate(ageRegex, ageInput) ||
    !validate(passwordRegex, passwordInput) ||
    !validateRepassword(passwordInput, repasswordInput);

  if (hasError) {
    submitBtn.classList.add("submit-error")
  } else {
    submitBtn.classList.remove("submit-error");
  }
  return !hasError;
}

//Input Events
nameInput.addEventListener("input", () => {
  validate(nameRegex, nameInput);
  updateSubmitState();
});

emailInput.addEventListener("input", () => {
  validate(emailRegex, emailInput);
  updateSubmitState();
});

phoneInput.addEventListener("input", () => {
  validate(phoneRegex, phoneInput);
  updateSubmitState();
});

ageInput.addEventListener("input", () => {
  validate(ageRegex, ageInput);
  updateSubmitState();
});

passwordInput.addEventListener("input", () => {
  validate(passwordRegex, passwordInput);
  updateSubmitState();
});

repasswordInput.addEventListener("input", () => {
  validateRepassword(passwordInput, repasswordInput);
  updateSubmitState();
});

//  clear function
function clearForm() {
  nameInput.value = "";
  phoneInput.value = "";
  emailInput.value = "";
  ageInput.value = "";
  passwordInput.value = "";
  repasswordInput.value = "";

  nameInput.classList.remove("is-valid");
  phoneInput.classList.remove("is-valid");
  emailInput.classList.remove("is-valid");
  ageInput.classList.remove("is-valid");
  passwordInput.classList.remove("is-valid");
  repasswordInput.classList.remove("is-valid");
}

// sidebar
menuBtn.addEventListener("click", function () {
  if (!big.classList.contains("active")) {
    big.classList.add("active");
    toggleBtn.classList.remove("fa-align-justify");
    toggleBtn.classList.add("fa-xmark");
    mini.style.left = "250px";
    menuList.slideDown(4000);
  }

  else {
    big.classList.remove("active");
    toggleBtn.classList.remove("fa-xmark");
    toggleBtn.classList.add("fa-align-justify");
    mini.style.left = "0px";
    menuList.slideDown(3000);
  }
});
//sidebar With APIs
const sidebarItems = document.querySelectorAll(".menu-list li");

sidebarItems.forEach(item => {
  item.addEventListener("click", async () => {
    const apiUrl = item.getAttribute("data-api");
    if (!apiUrl) return;
    const url = apiUrl.includes("api_key") ? `${apiUrl}` : `${apiUrl}&api_key=${apiKey}`;
    const res = await fetch(url);
    const data = await res.json();
    displayMovies(data.results);
    sidebarItems.forEach(i => i.classList.remove("active"));
    item.classList.add("active");
  });
});
//  stars
function getStars(vote) {
  let stars = '';
  const starsNumber = 5;
  let rating = vote / 2;
  for (let i = 1; i <= starsNumber; i++) {
    if (rating >= 1) {
      stars += '<i class="fa-solid fa-star"></i>';
    }
    else if (rating >= 0.5) {
      stars += `<i class="fa-solid fa-star-half-stroke"></i>`;
    }
    else {
      stars += '<i class="fa-regular fa-star"></i>'
    }
    rating -= 1;
  }
  return stars;
}
//display Movies
function displayMovies(movies) {
  movieContainer.innerHTML = ``;
  movies.forEach(item => {
    const poster = item.poster_path ?
      `https://image.tmdb.org/t/p/w500${item.poster_path}`
      : `https://via.placeholder.com/500x750?text=No+Image`;
    const title = item.title = item.name || item.title;
    const description = item.overview;
    const releaseDate = item.release_date || item.first_air_date;
    const rating = item.vote_average.toFixed(1);
    const stars = getStars(item.vote_average || 0);
    movieContainer.innerHTML += `<div class="col-lg-4 col-md-6 col-sm-12">
        <div class="movie-card">
            <img src="${poster}" alt="Movie" class="w-100">
            <div class="overlay overflow-hidden pt-5">
                <h1 class="title text-center display-6 mb-4">${title}</h1>
                <p class="paragraph fw-light">${description}</p>
                <p>Released Date: ${releaseDate}</p>
                <div class="stars">${stars}</div>
                <div class="rate">${rating}</div>
            </div>
        </div>
    </div>
        `
  });
}
// Movies API 
async function showMovies() {
  const response = await fetch(`https://api.themoviedb.org/3/trending/all/day?api_key=${apiKey}`);
  const data = await response.json();
  displayMovies(data.results);
}
showMovies();
//search Movies
async function searchMovie(query) {
  if (!query) return showMovies();
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}`;
  const response = await fetch(url);
  const data = await response.json();
  console.log(data.results);
  displayMovies(data.results);
}
//Event for search
searchInput.addEventListener('input', () => {

  const movieName = searchInput.value.trim();
  searchMovie(movieName);
});

//scroll up
$(window).scroll(function () {
  if ($(this).scrollTop() > 200) {
    $('#scrollUp').fadeIn();
  } else {
    $('#scrollUp').fadeOut();
  }
});

$('#scrollUp').click(function (e) {
  e.preventDefault();
  $('html, body').animate({ scrollTop: 0 }, 500);
});

