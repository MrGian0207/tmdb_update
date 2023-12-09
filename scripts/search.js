const searchFilter = {
  getCurrentModel() {
    const urlParams = new URLSearchParams(window.location.search);
    const model = urlParams.get("model");
    return model;
  },
  getTitle() {
    const urlParams = new URLSearchParams(window.location.search);
    const title = urlParams.get("title");
    return title;
  },
  options: [
    {
      label: "Movies",
      model: "movies",
      count: 0,
    },
    {
      label: "TV Show",
      model: "shows",
      count: 0,
    },
  ],
  curretnActiveIndex() {
    const activeIndex = this.options.findIndex(
      (opt) => this.getCurrentModel() === opt.model
    );
    return activeIndex;
  },
  handleEvents: async function () {
    const searchFilterList = $(".filter-option-list");

    const content = await Promise.all(
      this.options.map(async (option, index) => {
        try {
          const response = await fetch(
            `https://tmdb-backend-phi.vercel.app/api/${option.model}byfilter`,
            {
              method: "POST",
              body: JSON.stringify({
                title: this.getTitle(),
              }),
            }
          );

          const data = await response.json();
          const totalCount = data.totalCount;

          return `
          <li class="filter-option ${
            index === this.curretnActiveIndex() ? "active" : ""
          }" data-index=${index}>
              <div class="search_tab">${option.label}</div>
              <span>${totalCount}</span>
          </li>
        `;
        } catch (error) {
          console.error("Error:", error);
          throw error;
        }
      })
    );

    searchFilterList.innerHTML = content.join("");
  },
  onFilterOptionClick() {
    const searchFilterList = $(".filter-option-list");
    searchFilterList.addEventListener("click", (e) => {
      const filterOption = e.target.closest(".filter-option:not(.active)");
      if (filterOption) {
        const clickedIndex = Number(filterOption.dataset.index);
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set("model", this.options[clickedIndex].model);
        window.history.pushState(
          {},
          "",
          `${window.location.pathname}?${urlParams}`
        );
        this.handleEvents();
      }
    });
  },

  start: function () {
    this.handleEvents();
    this.onFilterOptionClick();
  },
};

searchFilter.start();

const searchResults = {
  pageNumber: 1,
  pageSize: 10,
  handleEvents() {
    const searchResultsList = $(".search-results-list");
    fetch(
      `https://tmdb-backend-phi.vercel.app/api/${searchFilter.getCurrentModel()}byfilter`,
      {
        method: "POST",
        body: JSON.stringify({
          title: searchFilter.getTitle(),
          pageNumber: this.pageNumber,
          pageSize: this.pageSize,
        }),
      }
    )
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data)
        const options = {
          year: "numeric",
          month: "short",
          day: "numeric",
        };

        const content = [...data.media].map((media) => {
          const dt = new Date(media.releasedDay);
          return `
          <div class="search-results-option d-flex">

            <div class="poster">
              <a
                  href="${searchFilter.getCurrentModel()}.html/${media.id}"
                >
                  <img
                    loading="lazy"
                    src="${media.imageUrl}"
                    alt="${media.title}"
                  />
                </a>
            </div>

            <div class="details">
              <div class="title">

                  <a
                    href="${searchFilter.getCurrentModel()}.html/${media.id}"
                    ><h2>${media.title}</h2></a
                  >

                <span class="release_date"
                  >${dt.toLocaleDateString("en-US", options)}</span
                >
              </div>

              <div class="overview">
                <p>${media.overview}</p>
              </div>
            </div>

        </div>
      `;
        });
        searchResultsList.innerHTML = content.join(" ");
      });
  },
  onChangeModel() {
    let previousUrl = "";
    const _this = this;
    const observer = new MutationObserver(function (mutations) {
      if (window.location.href !== previousUrl) {
        previousUrl = window.location.href;
        _this.pageNumber = 1
        _this.handleEvents();
      }
    });
    const config = { subtree: true, childList: true };

    // start listening to changes
    observer.observe(document, config);
  },
  loadMoreContent() {
    const loadMoreButton = $(".load_more button");
    const searchResultsList = $(".search-results-list");
    loadMoreButton.addEventListener("click", () => {
      ++this.pageNumber;
      fetch(
        `https://tmdb-backend-phi.vercel.app/api/${searchFilter.getCurrentModel()}byfilter`,
        {
          method: "POST",
          body: JSON.stringify({
            title: searchFilter.getTitle(),
            pageNumber: this.pageNumber,
            pageSize: this.pageSize,
          }),
        }
      )
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          const options = {
            year: "numeric",
            month: "short",
            day: "numeric",
          };

          data.media.forEach((media) => {
            const dt = new Date(media.releasedDay);
            const markup = `
            <div class="search-results-option d-flex">
  
              <div class="poster">
                <a
                    href="${searchFilter.getCurrentModel()}.html/${media.id}"
                  >
                    <img
                      loading="lazy"
                      src="${media.imageUrl}"
                      alt="${media.title}"
                    />
                  </a>
              </div>
  
              <div class="details">
                <div class="title">
  
                    <a
                      href="${searchFilter.getCurrentModel()}.html/${media.id}"
                      ><h2>${media.title}</h2></a
                    >
  
                  <span class="release_date"
                    >${dt.toLocaleDateString("en-US", options)}</span
                  >
                </div>
  
                <div class="overview">
                  <p>${media.overview}</p>
                </div>
              </div>
  
          </div>
        `;
            searchResultsList.insertAdjacentHTML(`beforeend`, markup);
          });
        });
    });
  },
  start() {
    this.handleEvents();
    this.onChangeModel();
    this.loadMoreContent();
  },
};
searchResults.start();
