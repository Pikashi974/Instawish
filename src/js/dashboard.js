const navFollowings = document.querySelector("#followings");
const headerElement = document.querySelector("#header");
const description = document.querySelector("input[name='description']");
const picture = document.querySelector("input[name='picture']");
const postList = document.querySelector("#posts");
const logoutButton = document.querySelector("#logoutButton");
const myPosts = document.querySelector("#myPosts");
const discover = document.querySelector("#discover");

let image = `<img src="/src/img/avatar2.jpg" style="width:5%; border-radius: 50%;">`;
let data64,
  followers,
  posts,
  followings = "";

async function init() {
  if (await api.getInfo()) {
    changeAvatar();
    appendFollowings();
    appendFollowers();
    posts = await api.getPage();
    posts = posts.data;
    addPosts(posts);
  } else {
    api.logout();
  }
}

init();

headerElement.addEventListener("click", () => (location.href = "/dashboard"));
picture.addEventListener("change", () => {
  if (picture.files[0]) {
    api.previewFile(picture.files[0]);
  }
});
myPosts.addEventListener("click", async () => {
  await showPosts(localStorage.id);
});
discover.addEventListener("click", getListUsers);
logoutButton.addEventListener("click", () => {
  api.logout();
});

async function appendFollowers() {
  try {
    followers = await api.getFollowers(localStorage.id);
    followers = followers.followers;
    //   for (let index = 0; index < Math.min(followers.length, 5); index++) {
    //     const element = followers[index];
    //   }
    // console.log(followers[0].follower);
  } catch (error) {
    console.log(error);
  }
}
async function appendFollowings() {
  try {
    followings = await api.getFollowings(localStorage.id);
    followings = followings.followings;
    var imageTemplate = `<div class="">
  <div class="d-flex" style="flex-direction: column;align-content: center;align-items: center;justify-content: center;">
  <img src="/src/img/avatar2.jpg" style="width:5%; border-radius: 50%;">
  <span>Texte</span>
  </div>
  </div>`;
    for (let index = 0; index < Math.min(followings.length, 5); index++) {
      const element = followings[index];
      var image = imageTemplate;
      if (element.following.image) {
        image = image.replace(
          'src="/src/img/avatar2.jpg"',
          'src="https://symfony-instawish.formaterz.fr' +
            element.following.image +
            '"'
        );
      }
      image = image.replace("Texte", element.following.email);
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

    console.log(jsonObject);

    var check = await window.api.addPost(jsonObject);
    console.log(check);
    if (check) {
      location.href = "/dashboard";
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
// function addFollowables() {}
async function addPosts(posts) {
  try {
    for (let index = 0; index < posts.length; index++) {
      const element = posts[index];
      let imageUser = "/src/img/avatar2.png";
      if (element.createdBy.imageUrl) {
        imageUser =
          "https://symfony-instawish.formaterz.fr" + element.createdBy.imageUrl;
      }
      let imagePost = "";
      if (element.imageUrl) {
        imagePost = "https://symfony-instawish.formaterz.fr" + element.imageUrl;
      }
      let nbComments = element.comments.length;
      let liked = element.likeds.find(
        (element) => element.user.id == localStorage.id
      )
        ? "liked"
        : "";
      var card = `<div class="card mb-3" id="post${element.id}" value="${element.id}">
  <div class="header">
    <img src="${imageUser}" style="width:10%; border-radius: 50%; z-index: 1;">
    <div class="border-round" style=" display: flex;
  position: relative;
  left: -5%;
  align-items: center;">
      <span style="left: 10%; position: relative;">${element.createdBy.username}</span>
    </div>
  </div>
  <div class="card-body">
    <img class="border-round" src="${imagePost}" style="width:-webkit-fill-available;">
    <hr>
    <div>
    <p class="card-text">${element.description}</p>
        </div>
  </div>
  <div class="card-footer text-muted">
    <a class="notification" onclick="showMessages('${element.id}')">
      <i class="bi bi-chat-left"></i>
      <span class="badge" id="nbComments${element.id}">${nbComments}</span>
    </a>
    <a class="notification ${liked}" id="buttonLike${element.id}" onclick="toggleLike('${element.id}')">
      <i class="bi bi-heart"></i>
      <span class="badge" id="nbLikes${element.id}">${element.likeds.length}</span>
    </a>
    <div class="d-none" id="listeComments${element.id}">
    </div>
    <div class="input-group mb-3">
      <input type="text" class="form-control" placeholder="Commentez cette image" aria-label="Commentez cette image" id="commentPoste${element.id}">
      <button class="btn notification" type="button" onclick="sendMessage('${element.id}')">
      <i class="bi bi-send"></i>
      </button>
    </div>

  </div>
</div>
`;
      // switch (nbComments) {
      //   case 0:
      //     card = card.replace("Commentaire", "Aucun commentaire");
      //     break;
      //   case 1:
      //     card = card.replace("Commentaire", `Voir ${nbComments} commentaire`);
      //     break;
      //   default:
      //     card = card.replace(
      //       "Commentaire",
      //       `Voir les ${nbComments} commentaires`
      //     );
      //     break;
      // }
      postList.innerHTML += card;
    }
  } catch (error) {
    console.log(error);
  }
}
async function showPosts(id) {
  postList.innerHTML = "";
  let postObject = await api.getPostUser(id);
  // postObject = postObject.data;
  console.log(postObject);
  addPosts(postObject);
}

function showMessages(id) {
  let postSelected = posts.find((element) => element.id == id);
  let comments = postSelected.comments;
  let divComments = document.querySelector(`#listeComments${id}`);
  if (divComments.classList.contains("d-none")) {
    divComments.innerHTML = "";
    for (let index = 0; index < comments.length; index++) {
      const element = comments[index];
      const date = new Date(element.createdAt.timestamp);
      divComments.innerHTML += `
      <div class="comment mt-4 text-justify float-left">
        <img src="${
          "https://symfony-instawish.formaterz.fr" + element.user.imageUrl
        }" alt="" class="rounded-circle" width="40" height="40">
        <h4>${element.user.email}</h4>
        <span>${date.getDate()} ${date.toLocaleString("default", {
        month: "long",
      })} ${date.getFullYear()} ${date.toLocaleTimeString()}</span>
        <br>
        <p>${element.content}</p>
      </div>
      `;
    }
  }
  divComments.classList.toggle("d-none");
}
async function sendMessage(id) {
  let texte = document.querySelector(`#commentPoste${id}`).value;
  let check = await api.addComment(texte, id);
  location.reload();
}
async function toggleLike(id) {
  let request = await api.toggleLike(id);
  let valueLike = document.querySelector(`#nbLikes${id}`);
  let buttonLike = document.querySelector(`#buttonLike${id}`);
  buttonLike.classList.toggle("liked");
  if (request.liked == 1) {
    valueLike.innerHTML = parseInt(valueLike.innerHTML) + 1;
  } else {
    valueLike.innerHTML = parseInt(valueLike.innerHTML) - 1;
  }
}
async function getListUsers() {
  let listUsers = await api.getAllUsers();
  let idFollowings = followings.map((element) => element.following.id);
  let listeSuggestions = Object.keys(listUsers).filter(
    (element) => idFollowings.includes(listUsers[element].id) == false
  );
  console.log(listeSuggestions);
}
