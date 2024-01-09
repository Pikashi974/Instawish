const navFollowings = document.querySelector("#followings");
const headerElement = document.querySelector("#header");
const description = document.querySelector("input[name='description']");
const picture = document.querySelector("input[name='picture']");
const postList = document.querySelector("#posts");

let image = `<img src="../img/avatar2.jpg" style="width:5%; border-radius: 50%;">`;
let data64,
  followers,
  followings = "";
async function init() {
  if (await api.getInfo()) {
    changeAvatar();
    appendFollowings();
    appendFollowers();
    addPosts();
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
picture.addEventListener("change", () => {
  if (picture.files[0]) {
    api.previewFile(picture.files[0]);
  }
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

    console.log(jsonObject["picture"].name);

    var check = await window.api.addPost(jsonObject);
    console.log(check);
    if (check) {
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
// function addFollowables() {}
async function addPosts() {
  try {
    let posts = await api.getPage();
    posts = posts.data;
    let card_post = `<div class="card mb-3">
  <div class="header">
    <img src="../img/avatar2.jpg" style="width:10%; border-radius: 50%; z-index: 1;">
    <div class="border-round" style=" display: flex;
  position: relative;
  left: -5%;
  align-items: center;">
      <span style="left: 10%; position: relative;">Texte</span>
    </div>
  </div>
  <div class="card-body">
    <img class="border-round" src="" style="width:-webkit-fill-available;">
    <div>
    <p class="card-text">Description</p>
        <p class="card-text">Commentaire</p>
        </div>
  </div>
  <div class="card-footer text-muted">
  </div>
</div>
`;
    for (let index = 0; index < posts.length; index++) {
      const element = posts[index];
      var card = card_post;
      if (element.createdBy.imageUrl) {
        card = card.replace(
          'src="../img/avatar2.jpg"',
          'src="https://symfony-instawish.formaterz.fr' +
            element.createdBy.imageUrl +
            '"'
        );
        card = card.replace("Texte", element.createdBy.username);

        card = card.replace("Description", element.description);
        let nbComments = element.comments.length;
        switch (nbComments) {
          case 0:
            card = card.replace("Commentaire", "Aucun commentaire");
            break;
          case 1:
            card = card.replace(
              "Commentaire",
              `Voir ${nbComments} commentaire`
            );
            break;
          default:
            card = card.replace(
              "Commentaire",
              `Voir les ${nbComments} commentaires`
            );
            break;
        }
      }
      if (element.imageUrl) {
        card = card.replace(
          'src=""',
          'src="https://symfony-instawish.formaterz.fr' + element.imageUrl + '"'
        );
      }
      postList.innerHTML += card;
    }
  } catch (error) {
    console.log(error);
  }
}
