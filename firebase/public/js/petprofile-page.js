/* backend that acutally does stuff */

var database;
var auth;
var storage;
var pet;

function fireConnect(){
  database = firebase.database();
  auth = firebase.auth().currentUser;
  storage = firebase.storage();
}

function toggleSignIn() {
  alert("signing out");
  firebase.auth().signOut();
}

function GetfromURL(){
  var queryStart = window.location.href.indexOf("=") + 1;
  var query = window.location.href.slice(queryStart, window.location.href.length);

    if (query === ""){
      window.location = "https://dragon-monkeys.firebaseapp.com/userprofile-page.html";
    }

    pet = query;

    pet = pet.replace("%20", " ");
    pet = pet.replace("#", "");

    console.log("Pet that will be opened: "+ pet);
}

function initApp() {

  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      fireConnect();
      GetfromURL();

      database.ref('users/' + auth.uid ).once("value").then(function(snapshot) {
        storage.refFromURL("gs://dragon-monkeys.appspot.com/" + auth.uid + "/" + snapshot.child("picture").val()).getDownloadURL().then(function(url) {
          document.getElementById("profile-pic").src = url;
        }).catch(function(error) {
          console.log("profile failed");
          document.getElementById("profile-pic").src = "https://firebasestorage.googleapis.com/v0/b/dragon-monkeys.appspot.com/o/dog.png?alt=media&token=9aeedbd1-8d6b-4c2e-bc2a-d697161e9cff";
        });
      });

      database.ref('users/' + auth.uid + "/pets/pet " + pet ).once("value").then(function(snapshot) {
        storage.refFromURL("gs://dragon-monkeys.appspot.com/" + auth.uid + "/" + snapshot.child("petImg").val()).getDownloadURL().then(function(url) {
          document.getElementById("pet-pic").src = url;
        }).catch(function(error) {
          console.log("image failed");
          document.getElementById("profile-pic").src = "https://firebasestorage.googleapis.com/v0/b/dragon-monkeys.appspot.com/o/dog.png?alt=media&token=9aeedbd1-8d6b-4c2e-bc2a-d697161e9cff";
        });

        var namediv = document.getElementById("pet-name");
        namediv.innerHTML = snapshot.child("petName").val();

        snapshot.forEach(function(pet){
          if(pet.key == "petName"){

          }
          else if(pet.key == "petImg"){

          }
          else {
            console.log(pet.key);

            var statD = document.createElement("div");
            statD.className = "stat";
            statD.innerHTML = pet.key + ": " + pet.val();

            var statList = document.getElementById("stats-list");
            statList.appendChild(statD);
          }
        });

      });


    }
    else{

      window.location = "https://dragon-monkeys.firebaseapp.com"
    }
  });
  document.getElementById('sign-out').addEventListener('click', toggleSignIn, false);
}



window.onload = function() {
  sessionStorage.getItem('uid');
  initApp();
};






/* front-end dynamism */

function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
}
