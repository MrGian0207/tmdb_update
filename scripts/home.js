const trendingScroller = $(".trending-scroller");

const trending = {
  mountUi: function () {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    fetch("https://tmdb-backend-phi.vercel.app/api/movies", {
      method: "GET",
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        data.forEach((movie) => {
          const dt = new Date(movie.releasedDay);
          const markup = `
       <a href="/movies/${movie.id}" class="movie-card">
        <img class="movie-card-img" src="${
          movie.imageUrl
        }" alt="Card image cap">
        <div class="movie-card-body">
          <h5 class="movie-card-title">${movie.title}</h5>
          <p class="movie-card-text">${dt.toLocaleDateString(
            "en-US",
            options
          )}</p>
        </div 
       </a>
      `;
          trendingScroller.insertAdjacentHTML(`beforeend`, markup);
        });
      })
      .catch((error) => console.log(error));
  },
  handleEvents: function () {},

  start: function () {
    this.mountUi();
    this.handleEvents();
  },
};

trending.start();

const latestTrailerScroller = $(".latest-trailer-scroller");
const backDropBg = $(".backdrop-bg");

const latestTrailer = {
  mountUi: function () {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    fetch("https://tmdb-backend-phi.vercel.app/api/movies", {
      method: "GET",
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        backDropBg.style.backgroundImage = `url("${data[0].backDropImageUrl}")`;
        data.forEach((movie, index) => {
          const markup = `
          <div class="trailer-card" data-index=${index}>
         <div class="img-container">
           <img class="trailer-card-img" src="${
             movie.backDropImageUrl
           }" alt="Card image cap">
           <i class="fa-solid fa-play fa-2xl icon"></i>
         </div>
         <a href="/movies/${movie.id}" class="trailer-card-body">
           <h5 class="trailer-card-title">${movie.title} trailer</h5>
           <p class="trailer-card-text">${new Date(
             movie.releasedDay
           ).toLocaleDateString("en-US", options)}</p>
         </a>
       </div>
      `;
          latestTrailerScroller.insertAdjacentHTML(`beforeend`, markup);
        });

        const trailerCards = [...$$(".latest-trailer-scroller .trailer-card")];
        trailerCards.forEach((card) => {
          const currentIndex = Number(card.dataset.index);
          const playModal = $(".latest-trailer .play-modal");
          const playBox = $(".latest-trailer .play-box");
          const playModalIframe = $(".latest-trailer .play-box iframe");
          const closeButton = $(".play-close");
          card.addEventListener("mouseenter", () => {
            backDropBg.style.backgroundImage = `url("${data[currentIndex].backDropImageUrl}")`;
          });

          const onClose = () => {
            playModal.classList.remove("d-flex");
            playBox.classList.remove("d-flex");
            playModalIframe.src = "";
          };

          const onOpen = () => {
            playModal.classList.add("d-flex");
            playBox.classList.add("d-flex");
          };

          playModal.addEventListener("click", () => {
            onClose();
          });

          closeButton.addEventListener("click", () => {
            onClose();
          });

          playBox.addEventListener("click", (e) => {
            e.stopPropagation();
          });

          card.addEventListener("click", (e) => {
            const imgContainer = e.target.closest(".img-container");
            if (imgContainer) {
              playModalIframe.src = data[currentIndex].trailerUrl;
              onOpen();
            }
          });
        });
      })
      .catch((error) => console.log(error));
  },
  handleEvents: function () {},

  start: function () {
    this.mountUi();
    this.handleEvents();
  },
};

latestTrailer.start();

const homeSearchForm = {
  handleEvents() {
    const formElement = $(".home-search .home-search_form");
    formElement.addEventListener("submit", (event) => {
      event.preventDefault();
      const formData = new FormData(formElement);
      const title = formData.get("title");
      const searchParams = new URLSearchParams();
      searchParams.set("title", title);
      searchParams.set("model", "movies");
      const searchUrl = `search.html?${searchParams.toString()}`;
      window.location.href = searchUrl;
    });
  },
  start() {
    this.handleEvents();
  },
};

homeSearchForm.start();
