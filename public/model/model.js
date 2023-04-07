function initListeners() { }

function updateUserInfo(userObj) {
  let id = firebase.auth().currentUser.uid;
  _db.collection("Users").doc(id).update(userObj).then(() => {
    console.log("updated doc")
  })
  .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log("Error updating" + errorMessage);
  });
}

function initFirebase() {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      _db = firebase.firestore();
      console.log("Auth changed Logged in");
      if (user.displayName) {
        $(".name").html(user.displayName);
      }
      $(".load").prop("disabled", false);
      $("#loginButton").removeClass("displayEle");
      $("#loginButton").addClass("hideEle");
      $("#logoutButton").removeClass("hideEle");
      $("#logoutButton").addClass("displayEle");
      $("#loginCallout").removeClass("displayEle");
      $("#loginCallout").addClass("hideEle");
      $("#userGallery").removeClass("hideEle");
      $("#userGallery").addClass("displayEle");
      $("#createForm").removeClass("hideEle");
      $("#createForm").addClass("displayEle");
      userExists = true;
    } else {
      _db = "";
      _userProfileInfo = {};
      console.log("Auth changed Logged out");
      $(".name").html("");
      $(".load").attr("disabled", true);
      $("#loginButton").removeClass("hideEle");
      $("#loginButton").addClass("displayEle");
      $("#logoutButton").removeClass("displayEle");
      $("#logoutButton").addClass("hideEle");
      $("#loginCallout").removeClass("hideEle");
      $("#loginCallout").addClass("displayEle");
      $("#userGallery").removeClass("displayEle");
      $("#userGallery").addClass("hideEle");
      $("#createForm").removeClass("displayEle");
      $("#createForm").addClass("hideEle");
      userExists = false;
      userFullName = "";
    }
  });
}

function signIn() {
  firebase
    .auth()
    .signInAnonymously()
    .then(() => {
      console.log("Signed in");
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log("Error signing in" + errorMessage);
    });
}

function signOut() {
  firebase
    .auth()
    .signOut()
    .then(() => {
      console.log("Signed out");
    })
    .catch((error) => {
      console.log("Error signing out" + errorMessage);
    });
}

function createAccount() {
  let fName = $("#fName").val();
  let lName = $("#lName").val();
  let email = $("#email").val();
  let password = $("#password").val();
  let fullName = fName + " " + lName;
  let userObj = {
    firstName: fName,
    lastName: lName,
    email: email,
    lists: []
  }

  console.log(
    "create" + " " + fName + " " + lName + " " + email + " " + password
  );

  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Signed in
      var user = userCredential.user;
      console.log("Account Created");
      alert("Account Created Successfully")
      firebase.auth().currentUser.updateProfile({
        displayName: fullName,
      });

      _db.collection("Users").doc(user.uid).set(userObj).then((doc) => {
        console.log("doc added");
        _userProfileInfo = userObj;
        console.log("Create userInfo", _userProfileInfo);

      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log("Error" + " " + errorMessage);
      });

      userFullName = fullName;
      $(".name").html(userFullName);
      $("#fName").val("");
      $("#lName").val("");
      $("#email").val("");
      $("#password").val("");
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log("Error" + " " + errorMessage);
    });
}

function login() {
  let email = $("#userEmail").val();
  let password = $("#userPass").val();

  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Signed in
      var user = userCredential.user;
      $("#userEmail").val("");
      $("#userPass").val("");
      _db.collection("Users").doc(user.uid).get().then((doc) => {
        console.log(doc.data());
        _userProfileInfo = doc.data();
        console.log("Login userInfo", _userProfileInfo);
        alert("Successfully Logged in!")
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log("Error logging in " + errorMessage);
      });
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log("Error logging in " + errorMessage);
    });
};

function addMainList() {
  let newListName = $("#listname").val();
  let newListObj = {
    name: newListName,
    listItems: []
  }

  _userProfileInfo.lists.push(newListObj);
  updateUserInfo(_userProfileInfo);
};