const { contextBridge, ipcRenderer } = require("electron");
const fs = require("fs");
const FormData = require("form-data");
const axios = require("axios").default;
const databaseElement = require("../../auth_config.json");
const { log } = require("console");

const { URL_ENDPOINT, DATA_SOURCE, DATABASE, COLLECTION, CONTENT_TYPE } =
  databaseElement;

let data64 = "";
/**
 *
 * app_registration     POST       /api/register  : form (email, password, username , profilePicture = FILE )
 * @param {JSON} jsonObject
 */
function postRegister(jsonObject) {
  previewFile(jsonObject["profilePicture"]);
  var options = {
    method: "POST",
    url: URL_ENDPOINT + "register",
    headers: {
      "content-type":
        "multipart/form-data; boundary=---011000010111000001101001",
    },
    data:
      '-----011000010111000001101001\r\nContent-Disposition: form-data; name="username"\r\n\r\n' +
      jsonObject["username"] +
      '\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name="email"\r\n\r\n' +
      jsonObject["email"] +
      '\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name="password"\r\n\r\n' +
      jsonObject["password"] +
      '\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name="profilePicture"; filename="' +
      jsonObject["profilePicture"].name +
      '"\r\nContent-Type: ' +
      jsonObject["profilePicture"].type +
      "\r\n\r\n" +
      data64 +
      "\r\n-----011000010111000001101001--\r\n",
  };

  console.log(jsonObject);

  // return axios
  //   .postForm(URL_ENDPOINT + "register", {
  //     username: jsonObject.username,
  //     password: jsonObject.password,
  //     email: jsonObject.email,
  //     profilePicture: document.querySelector(
  //       "input[name=" + jsonObject.profilePicture + "]"
  //     ).files,
  //   })
  //   .then(function (response) {
  //     return response.data;
  //   })
  //   .catch(function (error) {
  //     console.error(error);
  //   });

  return axios
    .request(options)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      console.error(error);
    });
}

/**
 *  * app_home  GET /api/home :  POST des personnes que l'user follow 
 * <POST> ['id', 'description', 'imageName', 'createdBy' => ['id', 'email', 'profilePicture'], 'likeds' => ['user' => ['id']], 'comments' => ['id', 'content', 'createdAt', 'user' => ['id', 'email', 'profilePicture']]]

 * @returns {JSON}
 */
function getPage() {
  var options = {
    method: "GET",
    url: URL_ENDPOINT + "home",
    headers: {
      Accept: "*/*",
      Authorization: `Bearer ${localStorage.token}`,
    },
  };

  return axios
    .request(options)
    .then(function (response) {
      return response;
    })
    .catch(function (error) {
      console.error(error);
    });
}
/**
 *
 * app_followers        GET         /api/follow/followers/{idUSER}
 *
 * @param {string | number} idUSER
 * @returns {JSON}
 */
function getFollowers(idUSER) {
  var options = {
    method: "GET",
    url: URL_ENDPOINT + "follow/followers/" + idUSER,
    headers: {
      Accept: "*/*",
      Authorization: `Bearer ${localStorage.token}`,
    },
  };

  return axios
    .request(options)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      console.error(error);
    });
}
/**
 * app_followings       GET        /api/follow/followings/{idUSER}
 *
 * @param {string | number} idUSER
 * @returns {JSON}
 */
function getFollowings(idUSER) {
  var options = {
    method: "GET",
    url: URL_ENDPOINT + "follow/followings/" + idUSER,
    headers: {
      Accept: "*/*",
      Authorization: `Bearer ${localStorage.token}`,
    },
  };

  return axios
    .request(options)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      console.error(error);
    });
}
/**
 * app_follow           POST      /api/follow/add/{idUSER}
 * @param {*} idUSER
 * @returns {JSON}
 */
function addFollow(idUSER) {
  var options = {
    method: "POST",
    url: URL_ENDPOINT + "follow//add/" + idUSER,
    headers: {
      Accept: "*/*",
      Authorization: `Bearer ${localStorage.token}`,
    },
  };

  axios
    .request(options)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      console.error(error);
    });
}
/**
 * app_unfollow         POST       /api/follow/remove/{idUSER}
 * @param {*} idUSER
 * @returns {JSON}
 */
function removeFollow(idUSER) {
  var options = {
    method: "POST",
    url: URL_ENDPOINT + "follow/remove/" + idUSER,
    headers: {
      Accept: "*/*",
      Authorization: `Bearer ${localStorage.token}`,
    },
  };

  axios
    .request(options)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      console.error(error);
    });
}
/**
 * app_me   /api/me   GET token -> {id, username, email, photo}
 *
 * @returns {JSON}
 */
function getInfo() {
  var options = {
    method: "GET",
    url: URL_ENDPOINT + "me",
    headers: {
      Accept: "*/*",
      Authorization: `Bearer ${localStorage.token}`,
    },
  };

  return axios
    .request(options)
    .then(function (response) {
      console.log(response);
      return response.data;
    })
    .catch(function (error) {
      console.error(error);
      location.href = "/login";
    });
}

/**
 *
 * ** api_login_check ANY  /api/login_check  : json (password, username) -> token
 * @param {string} jsonData
 * @return {JSON}
 */
function loginCheck(jsonData) {
  var options = {
    method: "POST",
    url: URL_ENDPOINT + "login_check",
    headers: {
      Accept: "*/*",
      "Content-Type": "application/" + CONTENT_TYPE,
    },
    data: JSON.parse(jsonData),
  };

  return axios
    .request(options)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      console.error(error);
    });
}

/**
 * app_get_users  GET /api/users  : -> liste

 */
function getAllUsers() {
  var options = {
    method: "GET",
    url: URL_ENDPOINT + "users",
    headers: {
      Accept: "*/*",
      Authorization: `Bearer ${localStorage.token}`,
    },
  };

  return axios
    .request(options)
    .then(function (response) {
      console.log(response);
      return response.data;
    })
    .catch(function (error) {
      console.error(error);
    });
}
/**
 * app_home_user        GET         /api/home/{idUSER} :   tous les postes d'un user
 *
 * @param {string | number} idUSER
 * @return {JSON}
 */
function getPostUser(idUSER) {
  var axios = require("axios").default;

  var options = {
    method: "GET",
    url: URL_ENDPOINT + "home/" + idUSER,
    headers: {
      Authorization: `Bearer ${localStorage.token}`,
    },
  };

  return axios
    .request(options)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      console.error(error);
    });
}
/**
 * app_add_post         POST       /api/post/add         : form (description, picture = FILE)
 *
 * @param {JSON} jsonObject
 * @return {JSON}
 */
async function addPost(jsonObject) {
  await previewFile(jsonObject["picture"]);
  // // console.log(data64);
  // var addDesc = "";
  // if (jsonObject["description"]) {
  //   addDesc =
  //     '-----011000010111000001101001\r\nContent-Disposition: form-data; name="description"\r\n\r\n' +
  //     jsonObject["description"] +
  //     '\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name="picture"; filename="';
  // } else {
  //   addDesc =
  //     '-----011000010111000001101001\r\nContent-Disposition: form-data; name="picture"; filename="';
  // }
  // var options = {
  //   method: "POST",
  //   url: URL_ENDPOINT + "post/add",
  //   headers: {
  //     Accept: "*/*",
  //     "Content-Type":
  //       "multipart/form-data; boundary=---011000010111000001101001",
  //     Authorization: `Bearer ${localStorage.token}`,
  //   },
  //   data:
  //     addDesc +
  //     jsonObject["picture"].name +
  //     '"\r\nContent-Type: ' +
  //     jsonObject["picture"].type +
  //     "\r\n\r\n" +
  //     data64 +
  //     "\r\n-----01100001011100001101001--\r\n",
  // };

  // console.log(options);

  // axios
  //   .request(options)
  //   .then(function (response) {
  //     // console.log(response.data);
  //     return response.data;
  //   })
  //   .catch(function (error) {
  //     console.error(error);
  //   });
  const axiosPure = require("axios");
  const FormDataObj = require("form-data");
  let dataConf = new FormDataObj();
  let fileRead = fs.createReadStream(
    jsonObject["picture"].path.replaceAll("\\", "/")
  );
  dataConf.append(
    "description",
    jsonObject["description"] ? jsonObject["description"] : ""
  );
  console.log("Desc done");
  dataConf.append("picture", fileRead);
  // console.log(data64);
  // dataConf.append(
  //   "picture",
  //   Buffer.from(await jsonObject["picture"].arrayBuffer())
  // );
  // dataConf.append("picture", await jsonObject["picture"].stream());
  console.log("Picture done");
  let config = {
    maxBodyLength: Infinity,
    method: "POST",
    url: URL_ENDPOINT + "post/add",
    headers: {
      Accept: "*/*",
      Authorization: `Bearer ${localStorage.token}`,
      ...dataConf.getHeaders(),
    },
    data: dataConf,
  };

  // console.log(config);
  // console.log(dataConf.getHeaders());

  return (
    axios
      // .post(URL_ENDPOINT + "post/add", dataConf, config)
      .request(config)

      .then((response) => {
        console.log(JSON.stringify(response));
        return response.data;
      })
      .catch((error) => {
        console.log(error);
      })
  );
}

/**
 * app_remove_post      POST        /api/post/remove/{idPOST}
 *
 * @param {string | number} idPOST
 * @returns {JSON}
 */
async function removePost(idPOST) {
  let config = {
    maxBodyLength: Infinity,
    method: "POST",
    url: URL_ENDPOINT + "post/remove/" + idPOST,
    headers: {
      Accept: "*/*",
      Authorization: `Bearer ${localStorage.token}`,
    },
  };
  return axios
    .request(config)
    .then((response) => {
      console.log(JSON.stringify(response));
      return response.data;
    })
    .catch((error) => {
      console.log(error);
    });
}
/**
 * app_add_comment      POST  /api/comment/add/{idPOST}  : json (content)
 * @param {JSON} jsonContent
 * @param {string | number} idPOST
 * @return {JSON}
 */
function addComment(jsonContent, idPOST) {
  var options = {
    method: "POST",
    url: URL_ENDPOINT + "comment/add/" + idPOST,
    headers: {
      Accept: "*/*",
      "Content-Type": "application/" + CONTENT_TYPE,
    },
    data: jsonContent,
  };

  axios
    .request(options)
    .then(function (response) {
      console.log(response.data);
      return response.data;
    })
    .catch(function (error) {
      console.error(error);
    });
}
/**
 * app_edit_comment     POST       /api/comment/edit/{idCOMMENT} : json(content)
 * @param {JSON} jsonContent
 * @param {string | number} idCOMMENT
 * @return {JSON}
 */
function editComment(jsonContent, idCOMMENT) {
  var options = {
    method: "POST",
    url: URL_ENDPOINT + "comment/add/" + idCOMMENT,
    headers: {
      Accept: "*/*",
      "Content-Type": "application/" + CONTENT_TYPE,
    },
    data: jsonContent,
  };

  axios
    .request(options)
    .then(function (response) {
      console.log(response.data);
      return response.data;
    })
    .catch(function (error) {
      console.error(error);
    });
}
/**
 * app_remove_comment   POST        /api/comment/remove/{idCOMMENT}
 * @param {string | number} idCOMMENT
 * @return {JSON}
 */
function removeComment(idCOMMENT) {
  var options = {
    method: "POST",
    url: URL_ENDPOINT + "comment/remove/" + idCOMMENT,
    headers: {
      Accept: "*/*",
    },
  };

  axios
    .request(options)
    .then(function (response) {
      console.log(response.data);
      return response.data;
    })
    .catch(function (error) {
      console.error(error);
    });
}
/**
 *
 * app_liked            ANY        /api/liked/{idPOST}  : LIKE/Unlike
 *
 * @param {string | number} idPOST
 * @returns {JSON}
 */
function toggleLike(idPOST) {
  var options = {
    method: "POST",
    url: URL_ENDPOINT + "liked/" + idPOST,
    headers: {
      Accept: "*/*",
    },
  };

  axios
    .request(options)
    .then(function (response) {
      console.log(response.data);
      return response.data;
    })
    .catch(function (error) {
      console.error(error);
    });
}
/**
 *
 *
 * @param {File} file
 * @return {string}
 */
function previewFile(file) {
  const preview = document.querySelector("img");
  const reader = new FileReader();

  reader.addEventListener("load", () => {
    // convert image file to base64 string
    if (preview) {
      preview.src = reader.result;
    }
    console.log(typeof reader.result);
    data64 = reader.result.replace(/data:[^\/]+\/[^\;]+;base64,/gm, "");
    // console.log(data64);
    return data64;
  });

  if (file) {
    reader.readAsDataURL(file);
  }
}

function logout() {
  localStorage.clear();
  location.href = "/src/ui/login.html";
}

process.once("loaded", () => {
  contextBridge.exposeInMainWorld("api", {
    getPage,
    postRegister,
    loginCheck,
    getFollowers,
    getFollowings,
    addFollow,
    removeFollow,
    getInfo,
    getAllUsers,
    getPostUser,
    addPost,
    removePost,
    addComment,
    editComment,
    removeComment,
    toggleLike,
    previewFile,
    logout,
  });
  contextBridge.exposeInMainWorld("fs", fs);
});
