document.querySelector('.search-box button').addEventListener('click', () => {
  const query = document.querySelector('.search-box input').value;
});


document.querySelectorAll('.movie-card').forEach(card => {
  card.addEventListener('mouseenter', () => {
  });
});


const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

menuToggle.addEventListener('click', () => {
  navLinks.classList.toggle('active');
  menuToggle.classList.toggle('active');
  

  document.body.classList.toggle('no-scroll');
});


document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('active');
    menuToggle.classList.remove('active');
    document.body.classList.remove('no-scroll');
  });
});


document.addEventListener('click', (e) => {
  if (!navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
    navLinks.classList.remove('active');
    menuToggle.classList.remove('active');
    document.body.classList.remove('no-scroll');
  }
});



// Fetch Now Playing Movies for Hero Slider
async function fetchHeroMovies() {
  const response = await fetch(`${BASE_URL}/movie/now_playing?api_key=${API_KEY}`);
  const data = await response.json();
  return data.results.slice(0, 10); // Get top 5 movies
}

// Hero Slider Function (single definition)
async function displayHeroSlider() {
  const movies = await fetchHeroMovies();
  const slider = document.getElementById('heroSlider');
  const dotsContainer = document.getElementById('sliderDots');

  // Create Slides
  slider.innerHTML = movies.map(movie => `
    <div class="slide" style="background-image: linear-gradient(to right, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%), url('https://image.tmdb.org/t/p/original${movie.backdrop_path}')">
      <div class="slide-content" style="background-color: #0000008d">
        <h1>${movie.title}</h1>
        <p>${movie.overview.substring(0, 150)}...</p>
        <div class="hero-buttons">
          <button class="play-btn">▶ Play</button>
          <button class="info-btn">ℹ️ More Info</button>
        </div>
      </div>
    </div>
  `).join('');

  // Create Dots
  dotsContainer.innerHTML = movies.map((_, index) => `
    <div class="dot ${index === 0 ? 'active' : ''}" data-index="${index}"></div>
  `).join('');

  // Initialize Slider
  let currentSlide = 0;
  const slides = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.dot');

  function updateSlider() {
    slider.style.transform = `translateX(-${currentSlide * 100}%)`;
    dots.forEach(dot => dot.classList.remove('active'));
    dots[currentSlide].classList.add('active');
  }

  // Auto-rotate every 5 seconds
  let slideInterval = setInterval(() => {
    currentSlide = (currentSlide + 1) % slides.length;
    updateSlider();
  }, 5000);

  // Next/Prev Controls
  document.querySelector('.slider-next').addEventListener('click', () => {
    clearInterval(slideInterval);
    currentSlide = (currentSlide + 1) % slides.length;
    updateSlider();
    slideInterval = setInterval(autoRotate, 5000); // Fixed this line
  });

  document.querySelector('.slider-prev').addEventListener('click', () => {
    clearInterval(slideInterval);
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    updateSlider();
    slideInterval = setInterval(autoRotate, 5000); // Fixed this line
  });

  // Dot Navigation
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      clearInterval(slideInterval);
      currentSlide = parseInt(dot.dataset.index);
      updateSlider();
      slideInterval = setInterval(autoRotate, 5000); // Fixed this line
    });
  });

  function autoRotate() {
    currentSlide = (currentSlide + 1) % slides.length;
    updateSlider();
  }
}

// Call on page load
window.addEventListener('DOMContentLoaded', displayHeroSlider);

document.querySelectorAll('.genre-card').forEach(card => {
  card.addEventListener('mouseenter', () => {
    card.style.boxShadow = `0 10px 20px ${getComputedStyle(card).backgroundColor}50`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.boxShadow = 'none';
  });
});

const API_KEY = '38d01855c73113431d5d64e22d399ac4'; // Replace with your key
const BASE_URL = 'https://api.themoviedb.org/3';

// Fetch Popular Movies
async function fetchPopularMovies() {
  try {
    const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}`);
    const data = await response.json();
    displayMovies(data.results);
  } catch (error) {
    console.error("Error fetching movies:", error);
  }
}


function displayMovies(movies) {
  const movieGrid = document.getElementById('popularMovies');
  movieGrid.innerHTML = movies.map(movie => `
    <div class="movie-card" onclick="window.location.href='movie.html?id=${movie.id}'">
      <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
      <div class="movie-info">
        <h3>${movie.title}</h3>
        <span>⭐ ${movie.vote_average.toFixed(1)}</span>
      </div>
    </div>
  `).join('');
}


window.onload = fetchPopularMovies;

async function searchMovies() {
  const query = document.getElementById('searchInput').value;
  if (!query) return;

  try {
    const response = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}`);
    const data = await response.json();
    displayMovies(data.results);
  } catch (error) {
    console.error("Error searching movies:", error);
  }
}


async function fetchMovieDetails(movieId) {
  const response = await fetch(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}`);
  const data = await response.json();
  return data;
}

async function fetchTrailer(movieId) {
  const response = await fetch(`${BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}`);
  const data = await response.json();
  const trailer = data.results.find(video => video.type === 'Trailer');
  return trailer ? `https://www.youtube.com/embed/${trailer.key}` : null;
}

// Initialize all movie sections
window.addEventListener('DOMContentLoaded', () => {
  displayHeroSlider();
  displayTrendingMovies();
  displayComingSoonMovies();
});


async function fetchGenres() {
  const response = await fetch(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}`);
  const data = await response.json();
  return data.genres;
}

async function displayGenres() {
  const genres = await fetchGenres();
  const genresContainer = document.getElementById('genresFilter');
  genresContainer.innerHTML = genres.map(genre => `
    <button onclick="fetchMoviesByGenre(${genre.id})">${genre.name}</button>
  `).join('');
}

const movieCache = {};

async function fetchWithCache(url) {
  if (movieCache[url]) return movieCache[url];
  
  const response = await fetch(url);
  const data = await response.json();
  movieCache[url] = data;
  return data;
}

// Fetch Trending Movies
async function fetchTrendingMovies() {
  const response = await fetch(`${BASE_URL}/trending/movie/week?api_key=${API_KEY}`);
  const data = await response.json();
  return data.results;
}

// Display Trending Movies
async function displayTrendingMovies() {
  const movies = await fetchTrendingMovies();
  const container = document.getElementById('trendingMovies');
  
  container.innerHTML = movies.map(movie => `
    <div class="trending-card">
      <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
      <div class="trending-overlay">
        <h4>${movie.title}</h4>
        <span>⭐ ${movie.vote_average.toFixed(1)}</span>
      </div>
    </div>
  `).join('');
}

// Fetch Upcoming Movies
async function fetchUpcomingMovies() {
  const response = await fetch(`${BASE_URL}/movie/upcoming?api_key=${API_KEY}`);
  const data = await response.json();
  return data.results;
}

// Display Coming Soon Movies
async function displayComingSoonMovies() {
  const movies = await fetchUpcomingMovies();
  const container = document.getElementById('comingSoonMovies');
  
  container.innerHTML = movies.slice(0, 12).map(movie => `
    <div class="coming-soon-card">
      <img src="https://image.tmdb.org/t/p/w300${movie.poster_path}" alt="${movie.title}">
      <div class="coming-soon-date">
        ${new Date(movie.release_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
      </div>
      <div class="coming-soon-info">
        <h4>${movie.title}</h4>
      </div>
    </div>
  `).join('');
}

// Initialize the page
async function init() {
  await displayGenreFilters();
  await fetchMoviesByGenre('all'); // Load popular movies by default

  document.getElementById('loadingScreen').style.display = 'none';
}

window.onload = init;

// Fetch movies by genre (or all if genreId === 'all')
async function fetchMoviesByGenre(genreId = 'all') {
  try {
    const url = genreId === 'all' 
      ? `${BASE_URL}/movie/popular?api_key=${API_KEY}`
      : `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}`;
    
    const response = await fetch(url);
    const data = await response.json();
    displayMovies(data.results);
  } catch (error) {
    console.error("Error fetching movies by genre:", error);
  }
}


// Fetch all movie genres
async function fetchGenres() {
  try {
    const response = await fetch(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}`);
    const data = await response.json();
    return data.genres;
  } catch (error) {
    console.error("Error fetching genres:", error);
    return [];
  }
}

// Display genre filters
async function displayGenreFilters() {
  const genres = await fetchGenres();
  const genreContainer = document.getElementById('genreFilters');
  
  // Add "All" button first
  genreContainer.innerHTML = `
    <button class="genre-btn active" data-id="all">All</button>
    ${genres.map(genre => `
      <button class="genre-btn" data-id="${genre.id}">${genre.name}</button>
    `).join('')}
  `;
  
  // Add click event listeners
  document.querySelectorAll('.genre-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.genre-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const genreId = btn.dataset.id;
      fetchMoviesByGenre(genreId);
    });
  });
}

let selectedGenres = [];

function toggleGenre(genreId) {
  if (selectedGenres.includes(genreId)) {
    selectedGenres = selectedGenres.filter(id => id !== genreId);
  } else {
    selectedGenres.push(genreId);
  }
  fetchMoviesByGenre(selectedGenres.join(','));
}

// Function to show movie details
async function showMovieDetails(movieId) {
  // Fetch movie details
  const movie = await fetch(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&append_to_response=videos,credits`)
    .then(res => res.json());

  // Fetch similar movies
  const similar = await fetch(`${BASE_URL}/movie/${movieId}/similar?api_key=${API_KEY}`)
    .then(res => res.json());

  // Update URL (for sharing)
  window.history.pushState({}, '', `movie.html?id=${movieId}`);

  // Render details
  document.getElementById('movieDetails').innerHTML = `
    <section class="movie-hero" style="background-image: url('https://image.tmdb.org/t/p/original${movie.backdrop_path}')">
      <div class="hero-overlay"></div>
      <div class="movie-poster">
        <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
      </div>
      <div class="movie-info">
        <h1>${movie.title} <span>(${new Date(movie.release_date).getFullYear()})</span></h1>
        
        <div class="meta">
          <span class="rating">⭐ ${movie.vote_average.toFixed(1)}</span>
          <span>${movie.runtime} min</span>
          <span>${movie.genres.map(g => g.name).join(', ')}</span>
        </div>

        <h3>Overview</h3>
        <p>${movie.overview}</p>

        <div class="cta-buttons">
          <button class="watch-trailer" data-youtube-id="${movie.videos?.results[0]?.key}">
            ▶ Play Trailer
          </button>
          <button class="add-favorites">+ My List</button>
        </div>
      </div>
    </section>

    <section class="cast-section">
      <h2>Cast</h2>
      <div class="cast-grid">
        ${movie.credits.cast.slice(0, 10).map(actor => `
          <div class="actor-card">
            <img src="${actor.profile_path ? `https://image.tmdb.org/t/p/w200${actor.profile_path}` : 'placeholder-actor.jpg'}" alt="${actor.name}">
            <h4>${actor.name}</h4>
            <p>${actor.character}</p>
          </div>
        `).join('')}
      </div>
    </section>

    <section class="similar-movies">
      <h2>You May Also Like</h2>
      <div class="movie-grid">
        ${similar.results.slice(0, 5).map(movie => `
          <div class="movie-card" onclick="showMovieDetails(${movie.id})">
            <img src="https://image.tmdb.org/t/p/w300${movie.poster_path}" alt="${movie.title}">
          </div>
        `).join('')}
      </div>
    </section>
  `;

  // Add trailer modal functionality
  document.querySelector('.watch-trailer')?.addEventListener('click', (e) => {
    const youtubeId = e.target.dataset.youtubeId;
    if (youtubeId) {
      document.body.insertAdjacentHTML('beforeend', `
        <div class="trailer-modal">
          <div class="modal-content">
            <iframe src="https://www.youtube.com/embed/${youtubeId}?autoplay=1" frameborder="0" allowfullscreen></iframe>
            <button class="close-modal">×</button>
          </div>
        </div>
      `);
      
      document.querySelector('.close-modal').addEventListener('click', () => {
        document.querySelector('.trailer-modal').remove();
      });
    }
  });
}

// On page load (for details page)
if (window.location.pathname.includes('movie.html')) {
  const urlParams = new URLSearchParams(window.location.search);
  const movieId = urlParams.get('id');
  if (movieId) showMovieDetails(movieId);
}
