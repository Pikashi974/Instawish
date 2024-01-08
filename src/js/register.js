const username = document.querySelector("[name=username]");
const password = document.querySelector("[name=password]");
const image = document.querySelector("[name=image]");
const email = document.querySelector("[name=email]");

async function init() {
  try {
    var test = await window.api.getPage();
    if (test.status == 200) {
      location.href = "../ui/dashboard.html";
    }
  } catch (error) {}
}

init();

async function getRegistered() {
  username.classList.remove("is-invalid");
  password.classList.remove("is-invalid");
  email.classList.remove("is-invalid");
  img.classList.remove("is-invalid");
  var json = {};
  json.username = username.value;
  json.password = password.value;

  try {
    var check = await window.api.loginCheck(JSON.stringify(json));
    //   console.log(check);
    if (check.token) {
      localStorage.setItem("username", username.value);
      localStorage.setItem("token", check.token);
      let infoClient = await api.getInfo();
      Object.keys(infoClient).forEach((key) =>
        localStorage.setItem(key, infoClient[key])
      );

      location.href = "../ui/dashboard.html";
      //   alert("Token generated");
    } else {
      username.classList.add("is-invalid");
      password.classList.add("is-invalid");
    }
  } catch (error) {
    username.classList.add("is-invalid");
    password.classList.add("is-invalid");
  }
}
