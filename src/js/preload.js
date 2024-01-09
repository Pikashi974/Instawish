const { contextBridge, ipcRenderer } = require("electron");
const fs = require("fs");
const axios = require("axios").default;
const databaseElement = require("../../auth_config.json");

const { URL_ENDPOINT, DATA_SOURCE, DATABASE, COLLECTION, CONTENT_TYPE } =
  databaseElement;

/**
 *
 * app_registration     POST       /api/register  : form (email, password, username , profilePicture = FILE )
 * @param {JSON} jsonObject
 */
function postRegister(jsonObject) {
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
      "\r\n\r\n\r\n-----011000010111000001101001--\r\n",
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

function getFollowers(idUser) {
  var options = {
    method: "GET",
    url: URL_ENDPOINT + "follow/followers/" + idUser,
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
function getFollowings(idUser) {
  var options = {
    method: "GET",
    url: URL_ENDPOINT + "follow/followings/" + idUser,
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

process.once("loaded", () => {
  contextBridge.exposeInMainWorld("api", {
    getPage,
    postRegister,
    loginCheck,
    getFollowers,
    getFollowings,
    getInfo,
  });
});

/**
 * app_add_comment      POST            /api/comment/add/{idPOST}  : json (content)
 * app_remove_comment   POST        /api/comment/remove/{idCOMMENT}
 * app_edit_comment     POST       /api/comment/edit/{idCOMMENT} : json(content)
 * app_follow           POST      /api/follow/add/{idUSER}
 * app_unfollow         POST       /api/follow/remove/{idUSER}
 * app_followers        GET         /api/follow/followers/{idUSER}
 * app_followings       GET        /api/follow/followings/{idUSER}
 * app_home_user        GET         /api/home/{idUSER} :   tous les postes d'un user
 * app_liked            ANY        /api/liked/{idPOST}  : LIKE/Unlike
 * app_add_post         POST       /api/post/add         : form (description, picture = FILE)
 * app_remove_post      POST        /api/post/remove/{idPOST}
 * app_me   /api/me   GET token -> {id, username, email, photo}
 */
