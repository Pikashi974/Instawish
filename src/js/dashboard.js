const navFollowings = document.querySelector("#followings");

function init() {
  appendFollowings();
}

init();

async function appendFollowers() {
  let followers = await api.getFollowers(localStorage.id);
  followers = followers.followers;
  var image = `<img src="../img/avatar2.jpg" style="width:5%; border-radius: 50%;">`;
  //   for (let index = 0; index < Math.min(followers.length, 5); index++) {
  //     const element = followers[index];
  //   }
  console.log(followers[0].follower);
}
async function appendFollowings() {
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
        'src="' + element.following.image + '"'
      );
    }
    navFollowings.innerHTML += image;
  }
  console.log(followings[0].following);
}
