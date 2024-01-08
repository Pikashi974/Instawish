const username = document.querySelector("[name=username]");
const password = document.querySelector("[name=password]");

function init() {}

init();

async function getLogin() {
  var json = `{'username': '${username.value}', 'password': '${password.value}'}`;
  console.log(json);
  console.log(JSON.parse(json));
  var check = await window.api.loginCheck(json);
  if (check.token) {
    alert("Token generated");
  } else {
    username.classList.add("is-invalid");
    password.classList.add("is-invalid");
  }
}
