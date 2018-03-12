/*
 * Used Professor Duvall's code as a baseline
 *
 * @author Pratik Mulpury
 */

// set up for Firebase
var config = {
    apiKey: "AIzaSyALCV8Td0bxq7yx010JOTZExuprMW9LNOM",
    authDomain: "trello-290-28956.firebaseapp.com",
    databaseURL: "https://trello-290-28956.firebaseio.com",
    projectId: "trello-290-28956",
    storageBucket: "trello-290-28956.appspot.com",
    messagingSenderId: "237477910372"
  };

// global access to initialized app database
var db = firebase.initializeApp(config).database();
// global reference to remote storage
var storageRef = firebase.storage().ref();
// global reference to remote data
var usersRef = db.ref('Users');
var projectsRef = db.ref('Projects');
// connect Firebase to Vue
Vue.use(VueFire);

// app Vue instance
var app = new Vue({
    // app initial state
    data: {
        // user entered data, managed locally before adding to database
        newImageTitle: '',
        newusername: '',
        newemail: '',
        },

    // local representations of firebase data
    firebase: {
        users:usersRef,
        projects:projectsRef
    },
    methods: {
        save : function(){
            console.log("save");
            this.storeImage();
        },
        storeImage:function () {
            // get input element user used to select local image
            console.log("storeimage");
            var input = document.getElementById('files');
            // have all fields in the form been completed
            if (this.newImageTitle && this.newusername && this.newemail && input.files.length > 0) {
                var file = input.files[0];
                // get reference to a storage location and
                storageRef.child('images/' + file.name)
                          .put(file)
                          .then(snapshot => this.addUser(snapshot.downloadURL));
                // reset input values so user knows to input new data
                input.value = '';
            }
        },
        skip: function()
        {
            location.href = "login.html";
        },
        addUser : function(url) {
            // now that image has been stored in Firebase, create a reference to it in database
            console.log("add user");
            usersRef.push({
                    username: this.newusername,
                    email: this.newemail,
                    url: url,
                    imagetitle: this.newImageTitle,
                    loggedin: 'false'
            });
            // reset input values so user knows to input new data
            this.newImageTitle = '';
            location.href = "login.html";
        },
            
    }
});

// mount Vue app within specific HTML element
app.$mount('#app')
