const firebaseConfig = {
    apiKey: "AIzaSyCFbrOT92rd_qrFzTSaT1EGLUJmpasSsLE",
    authDomain: "chat-app-26002.firebaseapp.com",
    projectId: "chat-app-26002",
    storageBucket: "chat-app-26002.appspot.com",
    messagingSenderId: "1016046294293",
    appId: "1:1016046294293:web:eec46e95ac4977ee0e451c",
    measurementId: "G-NKRTY2WSW9"
};

// Initialize Firebase
var app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = app.firestore();

// const inputDOM = () => {
//     const email = document.getElementById("email").value;
//     const password = document.getElementById("password").value;
//     const userName = document.getElementById("userName").value;
//     const signUpBtn = document.getElementById("signUp");
//     const errorMessage = document.getElementById("errors");
// }

function signUp() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const errorMessage = document.getElementById("errors");

    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(() => {
            location.replace("./welcome.html");
        })
        .catch((error) => {
            errorMessage.innerHTML = error;
        });
}

function signIn() {
    const email = document.getElementById("inputEmail").value;
    const password = document.getElementById("inputPassword").value;
    const errorMessage = document.getElementById("errors");

    firebase.auth().signInWithEmailAndPassword(email, password)
        .then(() => {
            location.replace("./welcome.html");
        })
        .catch((error) => {
            errorMessage.innerHTML = error;
        });
}

function logOut() {
    auth.signOut();
}

firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        document.getElementById("user-id").innerHTML = user.email;
        console.log(document.getElementById("userName"));
        db.collection("users").doc(user.uid).set({
            name: "",
            email: user.email
        }).then(() => {
            // console.log("Database Updated Succecfully with uid = " + user.uid);
        }).catch((error) => {
            console.error("Error adding document: " + error);
        });
    } else {
        auth.signOut();
    }
});


// for team information


let teamName;
let teamCategory;
let teamMembers;
const createTeam = document.getElementById('create-team');
var instructions = document.getElementById('instructions');

// setting Class for team info Start

class TeamInfo {
    constructor(name, category, members) {
        this.name = name;
        this.category = category;
        this.members = members;
    }
    toString() {
        return this.name + ', ' + this.state + ', ' + this.country;
    }
}

// Firestore data converter
var teamConverter = {
    toFirestore: function (team) {
        return {
            adminName: team.name,
            category: team.category,
            members: team.members
        };
    },
    fromFirestore: function (snapshot, options) {
        const data = snapshot.data(options);
        return new TeamInfo(data.name, data.category, data.members);
    }
};

// setting Class for team info Over

createTeam.addEventListener('click', () => {
    teamName = document.getElementById('team-name').value;
    teamCategory = document.getElementById('team-category').value;
    teamMembers = document.getElementById('team-members').value;

    // console.log(teamName);
    if ((teamName != '') || (teamCategory != '') || (teamMembers != '')) {
        db.collection("Teams").doc()
        .withConverter(teamConverter)
        .set(new TeamInfo(teamName, teamCategory, teamMembers)).then(() => {
            console.log("Team Updated Successfully!")
        }).catch((error) => {
            console.log("Document got error: " + error);
        });

        $('#exampleModalCenter').modal('hide');
        document.getElementById('team-name').value = '';
        document.getElementById('team-category').value = '';
        document.getElementById('team-members').value = '';
    }
    else if ((teamName == '') || (teamCategory == '') || (teamMembers == '')) {
        instructions.innerHTML = 'Please Provide the Complete Information!';
    }
});

function showData() {
    let getFromLocalS = localStorage.getItem('team1');

    if (getFromLocalS == null) {
        var arr1 = [];
    }
    else {
        var getArrayFromlocalS = localStorage.getItem('team1');
        arr1 = JSON.parse(getArrayFromlocalS);
    }

    let html = '';
    let addedTeams = document.getElementById('added-teams');
    arr1.forEach((item) => {
        html += `<fieldset class="scheduler-border">
                <div class="team-title ">
                <h4>${item.name}</h4>
                <button class="btn dot-menu stng-btn" onclick="setting()" ><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-gear-fill" viewBox="0 0 16 16">
                <path d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872l-.1-.34zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z"/>
              </svg></button>
                <p>${item.category}</p> </div>
                <div class="members-name"><b>Members:</b> ${item.members} and Others</div>
                </div>
                </fieldset>`;
    });

    addedTeams.innerHTML = html;
}