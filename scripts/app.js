const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const bars = $(".bars");
const mobileSideBar = $(".mobile-nav-sidebar");

const userContext = {
  context: {},
  handleEvents() {
    const token = this.tokenFormCookies("token");
    const userInfo = sessionStorage.getItem("userInfo");

    const nameContainer = $(".big-header .auth .name-container");
    window.addEventListener("load", () => {
      if (token) {
        if (userInfo) {
          const userInfoData = JSON.parse(userInfo);
          this.context = userInfo;
          nameContainer.innerHTML = userInfoData.userName;
          this.toggleAuthHeader(true);
          return;
        } else {
          fetch("https://tmdb-backend-phi.vercel.app/api/resign", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          })
            .then(async (response) => {
              const res = await response.json();
              if (response.ok) {
                nameContainer.innerHTML = res.userName;
                this.setCookie("token", res.token, 7);
                this.context = res;
                sessionStorage.setItem("userInfo", JSON.stringify(res));

                this.toggleAuthHeader(true);
              } else {
                this.toggleAuthHeader(false);
                this.clearCookie("token");
              }
            })
            .catch((error) => {
              console.log(error);
              this.toggleAuthHeader(false);
              this.clearCookie("token");
            });
        }
      } else {
        if(userInfo){
          sessionStorage.removeItem("userInfo");
        }
        this.toggleAuthHeader(false);
      }
    });
  },
  tokenFormCookies(name) {
    const cookies = document.cookie.split("; ");
    for (const cookie of cookies) {
      const [cookieName, cookieValue] = cookie.split("=");
      if (cookieName === name) {
        return cookieValue;
      }
    }
    return null;
  },
  setCookie(name, value, days) {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    const cookie = `${name}=${encodeURIComponent(
      value
    )};expires=${expires.toUTCString()};path=/`;
    document.cookie = cookie;
  },
  clearCookie(name) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  },
  toggleAuthHeader(boolean) {
    const unAuthBigHeader = $(".big-header .unauth");
    const authBigHeader = $(".big-header .auth");
    const unAuthMobileHeader = $(".mobile-header .unauth");
    const authMobileHeader = $(".mobile-header .auth");
    const mobileHeaderLogOutbtn = $(".mobile-header .logout-btn");
    const bigHeaderLogOutbtn = $(".big-header .logout-btn");
    const joinNowSection = $(".join-now")
    if (boolean === true) {
      unAuthBigHeader.classList.remove("d-flex");
      unAuthBigHeader.classList.add("d-none");
      authBigHeader.classList.remove("d-none");
      authBigHeader.classList.add("d-flex");
      unAuthMobileHeader.classList.remove("d-flex");
      unAuthMobileHeader.classList.add("d-none");
      authMobileHeader.classList.remove("d-none");
      authMobileHeader.classList.add("d-flex");
      joinNowSection.classList.add("d-none")

      mobileHeaderLogOutbtn.addEventListener("click", () => {
        this.clearCookie("token");
        window.location.reload();
      });

      bigHeaderLogOutbtn.addEventListener("click", () => {
        this.clearCookie("token");
        window.location.reload();
      });
    } else {
      unAuthBigHeader.classList.add("d-flex");
      unAuthBigHeader.classList.remove("d-none");
      authBigHeader.classList.add("d-none");
      authBigHeader.classList.remove("d-flex");
      unAuthMobileHeader.classList.add("d-flex");
      unAuthMobileHeader.classList.remove("d-none");
      authMobileHeader.classList.add("d-none");
      authMobileHeader.classList.remove("d-flex");
      joinNowSection.classList.add("d-block")
    }
  },
  start: function () {
    this.handleEvents();
  },
};

userContext.start();

const header = {
  isMobileSideBarOpen: false,
  handleEvents: function () {
    window.addEventListener("resize", () => {
      if (window.innerWidth >= 992) {
        this.isMobileSideBarOpen = false;
        mobileSideBar.classList.remove("slide-out-left");
        mobileSideBar.classList.remove("slide-in-left");
      }
    });

    bars.addEventListener("click", () => {
      if (
        ![...mobileSideBar.classList].includes(`slide-in-left`) &&
        ![...mobileSideBar.classList].includes(`slide-out-left`) &&
        !this.isMobileSideBarOpen
      ) {
        mobileSideBar.classList.add("slide-in-left");
      } else if (
        [...mobileSideBar.classList].includes(`slide-out-left`) &&
        !this.isMobileSideBarOpen
      ) {
        mobileSideBar.classList.remove("slide-out-left");
        mobileSideBar.classList.add("slide-in-left");
      } else {
        mobileSideBar.classList.remove("slide-in-left");
        mobileSideBar.classList.add("slide-out-left");
      }
      this.isMobileSideBarOpen = !this.isMobileSideBarOpen;
    });
  },

  start: function () {
    this.handleEvents();
  },
};

header.start();


