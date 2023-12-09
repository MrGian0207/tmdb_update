const personPage = {
  hanldeEvents() {
    const urlParams = new URLSearchParams(window.location.search);
    const personId = urlParams.get("id");
    console.log(personId)
    fetch(`https://tmdb-backend-phi.vercel.app/api/people/${personId}`, {
      method: "GET",
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        Object.keys(data).forEach((key) => {
          let field = $(`#${key}`);
          if (field) {
            let info = data[key].charAt(0).toUpperCase() + data[key].slice(1);
            if (key == "dob") {
              const unformattedDate = data[key].split("T")[0];
              info = formatDate(unformattedDate);
            }
            if (key == "biography") {
              let paragraphs = data[key].split("\n");
              if (paragraphs.length < 2) {
                $("#biography").classList.add("no_after");
                $(".read_more").style.display = "none";
              }
              paragraphs.forEach((paragraph, i) => {
                if (paragraph.length > 0) {
                  let p = `<p class='paragraph' style='${
                    i > 2 ? "display: none" : ""
                  }'>${paragraph.slice(0, paragraph.length - 2)}</p>`;
                  $("#biography").insertAdjacentHTML("beforeend", p);
                }
              });
            } else {
              field.innerHTML = info;
            }
          } else if (key == "imageUrl") {
            $("#person_img").src = data[key];
          } else if (key == "castIn") {
            data[key].forEach((child) => {
              let html = `<a href="/movie.html?id=${child.media.id}"><li class="movie_card">
                        <img class="movie_img" src="${child.media.imageUrl}" alt="">
                        <div class="movie_title">${child.media.title}</div>
                      </li></a>`;
              $(".movies_container").insertAdjacentHTML("beforeend", html);
            });
          }
        });
      });

    const readMore = $(".read_more");
    readMore.addEventListener("click", () => {
      const paragraphs = $("#biography").querySelectorAll(".paragraph");
      paragraphs.forEach((p) => {
        p.style.display = "";
      });
      readMore.style.display = "none";
      $("#biography").classList.add("no_after");
    });

    const formatDate = (date) => {
      const d = date.split("-");
      const year = d[0];
      const month = d[1];
      const day = d[2];
      return `${months[month]} ${day}, ${year}`;
    };

    const months = {
      "01": "Jan",
      "02": "Feb",
      "03": "Mar",
      "04": "April",
      "05": "May",
      "06": "June",
      "07": "Jul",
      "08": "Aug",
      "08": "Sep",
      10: "Oct",
      11: "Nov",
      12: "Dec",
    };
  },
  start() {
    this.hanldeEvents();
  },
};

personPage.start();
