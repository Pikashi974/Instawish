const username = document.querySelector("[name=username]");
const password = document.querySelector("[name=password]");
const password2 = document.querySelector("[name=password2]");
const image = document.querySelector("[name=profilePicture]");
const email = document.querySelector("[name=email]");
const registerForm = document.querySelector("#registerForm");

async function init() {}

init();

async function getRegistered() {
  username.classList.remove("is-invalid");
  password.classList.remove("is-invalid");
  password2.classList.remove("is-invalid");
  email.classList.remove("is-invalid");
  image.classList.remove("is-invalid");
  if (
    password.value.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/) &&
    password.value == password2.value
  ) {
    try {
      let bodyFormData = new FormData(document.querySelector("#registerForm"));
      let jsonObject = {};
      jsonObject["username"] = bodyFormData.get("username");
      jsonObject["email"] = bodyFormData.get("email");
      jsonObject["password"] = bodyFormData.get("password");
      jsonObject["profilePicture"] = bodyFormData.get("profilePicture");

      console.log(jsonObject["profilePicture"].name);

      var check = await window.api.postRegister(jsonObject);
      console.log(check);
      if (check.status && check.status == "User created!") {
        location.href = "/src/ui/login.html";
        //   alert("Token generated");
      } else {
        username.classList.add("is-invalid");
        password.classList.add("is-invalid");
        password2.classList.add("is-invalid");
        email.classList.add("is-invalid");
        image.classList.add("is-invalid");
      }
    } catch (error) {
      username.classList.add("is-invalid");
      password.classList.add("is-invalid");
      password2.classList.add("is-invalid");
      email.classList.add("is-invalid");
      image.classList.add("is-invalid");
    }
  } else {
    username.classList.add("is-invalid");
    password.classList.add("is-invalid");
    password2.classList.add("is-invalid");
    email.classList.add("is-invalid");
    image.classList.add("is-invalid");
  }
}
