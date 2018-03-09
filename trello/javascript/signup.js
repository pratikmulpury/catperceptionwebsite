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
        newUsername: '',
        newEmail: '',
        newImageTitle: ''
        },

    // local representations of firebase data
    firebase: {
        users:usersRef,
        projects:projectsRef
    },
    methods: {
        // upload new user to firebase
        save: function(){
            console.log('save function called');
            
            var input = document.getElementById('files');            
            if (this.newUsername && this.newEmail && this.newImageTitle && input.files.length > 0) {
                console.log('save function if statement called: ');
                
                var file = input.files[0];
                // create new user with the username, new email, image title and image
                storageRef.child('Users/' + this.newUsername + '/username')
                .put(this.newUsername)

                storageRef.child('Users/' + this.newUsername + '/email')
                .put(this.newEmail)

                storageRef.child('Users/' + this.newUsername + '/images/title')
                .put(this.newImageTitle)

                storageRef.child('Users/' + this.newUsername + '/images/url')
                .put(file)

                // navigation to login page
                location.href = 'login.html';                
            }
            
        }

    }
});

// mount Vue app within specific HTML element
app.$mount('#app')
