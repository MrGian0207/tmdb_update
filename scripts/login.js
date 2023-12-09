const signupForm = {
  handleEvents() {
    const isAuthed = userContext.tokenFormCookies("token");
    if (isAuthed) {
      return (window.location.href = "/");
    }
    const formElement = $(".signin_form");
    formElement.addEventListener("submit", (event) => {
      event.preventDefault();
      if (this.validateForm()) {
        const formData = new FormData(formElement);
        const body = {
          userName: formData.get("userName"),
        };
        fetch("https://tmdb-backend-phi.vercel.app/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            'X-Auth-Password': `${formData.get("password")}`,
          },
          body: JSON.stringify(body),
        })
          .then(async (response) => {
            const res = await response.json();
            if (response.ok) {
              console.log(res);
              this.showSuccessToast("Login successful!");
              userContext.setCookie("token", res.token, 7);
              window.location.href = "/";
            } else {
              this.showErrorToast(res);
            }
          })
          .catch((error) => {
            console.log(error);
            this.showErrorToast("failed");
          });
      }
    });
  },
  validateForm() {
    const usernameInput = $(".signin_form .username_field");
    console.log(usernameInput);
    const passwordInput = $(".signin_form .password_field");

    this.resetValidationStyles();

    let isValid = true;

    if (usernameInput.value.trim() === "") {
      isValid = false;
      this.showError(usernameInput, "Username is required.");
    }

    if (passwordInput.value.length < 4) {
      isValid = false;
      this.showError(
        passwordInput,
        "Password should be at least 4 characters long."
      );
    }
    return isValid;
  },
  resetValidationStyles() {
    const inputs = $$(".signin_form input");
    inputs.forEach((input) => {
      input.classList.remove("error");
      const errorMessage = input.parentNode.querySelector(".error-message");
      if (errorMessage) {
        errorMessage.remove();
      }
    });
  },
  showError(input, message) {
    const errorMessage = document.createElement("span");
    errorMessage.classList.add("error-message");
    errorMessage.textContent = message;

    input.classList.add("error");
    input.parentNode.appendChild(errorMessage);
  },
  showSuccessToast(message) {
    this.showToast(message, "bg-success");
  },
  showErrorToast(message) {
    const toastMessage = `Error: ${message}`;
    this.showToast(toastMessage, "bg-danger");
  },
  showToast(message, toastClass) {
    const toastBody = $(".toast-body");
    toastBody.classList.add(toastClass, "toast-in-out");
    toastBody.innerHTML = `${message}`;
    setTimeout(() => {
      toastBody.classList.remove("toast-in-out");
    }, 2000);
  },
  start() {
    this.handleEvents();
  },
};

signupForm.start();
