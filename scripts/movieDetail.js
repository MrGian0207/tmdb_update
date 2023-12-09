window.addEventListener("scroll", function () {
    var currentScrollPos = document.documentElement.scrollTop;
  
    if (currentScrollPos > this.previousScrollPos && currentScrollPos > 0) {
      const header = $(".main-header");
      header.classList.add("nav-top");
    } else {
      const header = $(".main-header");
      header.classList.remove("nav-top");
    }
    this.previousScrollPos = currentScrollPos;
  });
  ////////////////////////////GET info movie///////////////////////////////////////////
  const background_movie = $(".introduction-media");
  
  // Lấy giá trị của thuộc tính CSS 'background-image'
  const backgroundImageCSS = window.getComputedStyle(background_movie).getPropertyValue('background-image');
  
  // Sử dụng biểu thức chính quy để trích xuất đường dẫn URL từ chuỗi CSS
  const urlRegex = /url\(['"]?(.*?)['"]?\)/;
  const match = backgroundImageCSS.match(urlRegex);
  
  const urlParams = new URLSearchParams(window.location.search);
  const movie_Id = urlParams.get("id");
  
  const movie_info = $(".poster-info");
  const info = {
      mountUi:function () {
        const options = {
          year: "numeric",
          month: "short",
          day: "numeric",
        };
      fetch(`https://tmdb-backend-phi.vercel.app/api/movies/${movie_Id}`,{
        method: "GET",
      })
        .then((res) => {
          return res.json();
        })
        .then((movie) => {
          
          // Get genre 
          let genresName = "";
          let count = 0;
          const fetchGenres = movie.genres.map(async (genre) => {
              const id = genre.genreId;
              try {
                  const res = await fetch(`https://tmdb-backend-phi.vercel.app/api/genres/${id}`, {
                      method: "GET",
                  });
                  console.log(movie.genres);
                  const result = await res.json();
                  if (count < movie.genres.length-1){
                    genresName += `<a>${result.name},</a> `; 
                    count = count + 1;
                  } else {
                    genresName += `<a>${result.name}</a>`; 
                    count = count + 1;
                  }
                  
              } catch (error) {
                  console.log(error);
              }
          });
          // Gắn đường dẫn backdrop cho background image của info movie
              if (match && match.length > 1) {
                const imageURL = match[1];
  
                // Đổi đường dẫn URL mới
                const newImageURL = `${movie.backDropImageUrl}`
                background_movie.style.backgroundImage = `url("${newImageURL}")`;
              } else {
                console.log('Không tìm thấy đường dẫn URL của hình nền.');
              }
          // Xử lý nội dung của info movie
              Promise.all(fetchGenres).then(() => {
                const dt = new Date(movie.releasedDay);
                const markup = `
                      <img src="${movie.imageUrl}" alt="Poster Movie">
                      <div class="info d-flex flex-column"> 
                        <div class="title d-flex flex-row gap-2">
                            <h2>${movie.title}</h2>
                            <span>(2023)</span>
                        </div>
                        <div class="facts mb-3 d-flex flex-lg-row flex-column gap-4">
                            <span class="release">${dt.toLocaleDateString("en-US",options)}</span>
                            <span class="genres">
                                ${genresName}
                            </span>
                            <span class="runtime">${movie.runTime}</span>
                        </div>
                        <div class="overview">
                            <h3 class="fw-bold fs-5">Overview</h3>
                            <div class="content--overview fs-6 fst-italic">${movie.overview}</div>
                        </div>
                      </div>  
                `;
                movie_info.insertAdjacentHTML(`beforeend`,markup);
              });
        })
        .catch((error) => console.log(error)); 
    },
    start: function (){
      this.mountUi();
    }
  }
  info.start();
  ////////////////////////////////////////////Cast-Person//////////////////////////////////////////////////////////////////////
  const casts = $(".casts");
  const whiteColumn = { 
      mountUi:function () {
      fetch(`https://tmdb-backend-phi.vercel.app/api/movies/${movie_Id}`,{
        method: "GET",
      })
        .then((res) => {
          return res.json();
        })
        .then((movie) => {
                  let actor = "";
  
                  const fetchCasts = movie.casts.map(async (cast) => {
                      const id = cast.id;
                      try {
                          const res = await fetch(`https://tmdb-backend-phi.vercel.app/api/genres/${id}`, {
                              method: "GET",
                          });
                          const result = await res.json();
                          actor += `<li class="card">
                                      <a class="p-0 me-0 w-100" href="#"><img class="h-100 w-100" src="${cast.person.imageUrl}" alt=""></a>
                                      <p><a class="full-name" href="#">${cast.person.fullName}</a></p>
                                      <p class="character">${cast.character}</p>
                                    </li>`;
                      } catch (error) {
                          console.log(error);
                      }
                  });
              //////////////////////////////////////////////////////////////////////////////////////////////////////
              Promise.all(fetchCasts).then(() => {
              const markup = `
                    <div class="casts">
                        <h3>Top Billed Cast</h3>
                        <div id="cast_scroller">
                          <ol class="people_scroller d-flex flex-row p-0">
                                ${actor}                      
                            </ol>
                        </div>
                    </div>
                    <div class="media mb-4 w-100">
                      <h3>Backdrop</h3>
                      <img class="w-100 mb" src="${movie.backDropImageUrl}" alt="">
                    </div>
                    <div class="trailer pb-5">
                        <h3>Trailer</h3>
                        <div class="w-100 d-flex">                    
                          <iframe class="w-100 justify-content-center mx-auto" width="1396" height="672" src="${movie.trailerUrl}" title="Oppenheimer | New Trailer" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
                        </div>
                    </div>
              `;
              casts.insertAdjacentHTML(`beforeend`,markup);
            });
        })
        .catch((error) => console.log(error)); 
    },
      start: function (){
        this.mountUi();
    },
  }
  whiteColumn.start();
  
  //////////////////////////////////////////More-infomation///////////////////////////////////////////////////////////////////
  
  const more_info = $(".more-info");
  const greyColumn = {
    mountUi:function () {
      fetch(`https://tmdb-backend-phi.vercel.app/api/tvs/${movie_Id}`,{
        method: "GET",
      })
        .then((res) => {
          return res.json();
        })
        .then((movie) => {
              //////////////////////////////////////////////////////////////////////////////////////////////////////
              const markup = `
                            <div class="social-contact mb-4 d-flex flex-row gap-3">
                            <a href=""><i class="fa-brands fa-facebook fa-xl"></i></a>
                            <a href=""><i class="fa-brands fa-twitter fa-xl"></i></a>
                            <a href=""><i class="fa-brands fa-instagram fa-xl"></i></a>
                            <div class="line"></div>
                            <a href=""><i class="fa-solid fa-link fa-xl"></i></a>
                            </div>
                            <div class="status">
                              <p class="d-flex flex-column mb-3">
                                <strong>Status</strong>
                                ${movie.status}
                              </p>
                            </div>
                            <div class="original-language">
                              <p class="d-flex flex-column mb-3">
                                <strong>Original Languge</strong>
                                ${movie.originalLanguage}
                              </p>
                            </div>
                            <div class="budget">
                              <p class="d-flex flex-column mb-3">
                                <strong>Budget</strong>
                                ${movie.budget}
                              </p>
                            </div>
                            <div class="revenue">
                              <p class="d-flex flex-column mb-3">
                                <strong>Revenue</strong>
                                ${movie.revenue}
                              </p>
                            </div>
              `;
              more_info.insertAdjacentHTML(`beforeend`,markup);
        })
        .catch((error) => console.log(error)); 
    },
      start: function (){
        this.mountUi();
    },
  }
  greyColumn.start();