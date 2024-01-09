const navFollowings = document.querySelector("#followings");
const headerElement = document.querySelector("#header");

let image = `<img src="../img/avatar2.jpg" style="width:5%; border-radius: 50%;">`;

async function init() {
  if (await api.getInfo()) {
    appendFollowings();
    changeAvatar();
  } else {
    localStorage.clear();
    location.href = "login.html";
  }
}

init();

headerElement.addEventListener(
  "click",
  () => (location.href = "dashboard.html")
);

async function appendFollowers() {
  try {
    let followers = await api.getFollowers(localStorage.id);
    followers = followers.followers;
    //   for (let index = 0; index < Math.min(followers.length, 5); index++) {
    //     const element = followers[index];
    //   }
    console.log(followers[0].follower);
  } catch (error) {
    console.log(error);
  }
}
async function appendFollowings() {
  try {
    let followings = await api.getFollowings(localStorage.id);
    followings = followings.followings;
    var imageTemplate = `<div class="">
  <div class="d-flex" style="flex-direction: column;align-content: center;align-items: center;justify-content: center;">
  <img src="../img/avatar2.jpg" style="width:5%; border-radius: 50%;">
  <span>Texte</span>
  </div>
  </div>`;
    for (let index = 0; index < Math.min(followings.length, 5); index++) {
      const element = followings[index];
      var image = imageTemplate;
      if (element.following.image) {
        image = image.replace(
          'src="../img/avatar2.jpg"',
          'src="https://symfony-instawish.formaterz.fr' +
            element.following.image +
            '"'
        );
      }
      navFollowings.innerHTML += image;
    }
  } catch (error) {
    console.log(error);
  }
  //
}
function changeAvatar() {
  if (document.querySelector("#avatar")) {
    document.querySelector("#avatar").src =
      "https://symfony-instawish.formaterz.fr" + localStorage.imageUrl;
  }
}
async function formAddPost() {
  description.classList.remove("is-invalid");
  picture.classList.remove("is-invalid");
  try {
    let bodyFormData = new FormData(document.querySelector("#formAdd"));
    let jsonObject = {};
    jsonObject["description"] = bodyFormData.get("description");
    jsonObject["picture"] = bodyFormData.get("picture");

    console.log(jsonObject["picture"].name);

    var check = await window.api.addPost(jsonObject);
    console.log(check);
    if (check.status) {
      location.href = "../ui/dashboard.html";
      //   alert("Token generated");
    } else {
      description.classList.add("is-invalid");
      picture.classList.add("is-invalid");
    }
  } catch (error) {
    description.classList.add("is-invalid");
    picture.classList.add("is-invalid");
  }
}
