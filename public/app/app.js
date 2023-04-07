var userExists = false;
var userFullName = "";
var _db = "";
var _userProfileInfo = {};


$(document).ready(function () {
  try {
    let app = firebase.app();
    initFirebase();
    initListeners();
    valTest();
  } catch (error) {
    console.log("error", error);
  }
});