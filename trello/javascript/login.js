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
        username: '',
        email: '',
        },

    // local representations of firebase data
    firebase: {
        users:usersRef,
    },
    methods: {
        copyObject: function(obj) {        
            var copyObjStr = JSON.stringify(obj);  
            var copyObj = JSON.parse(copyObjStr);      
            return copyObj;
        },
        deleteAttribute: function(obj, keyToDelete) {
            delete obj[keyToDelete];
        },
        signup: function()
        {
            location.href = "signup.html";      
        },
        check : function(){
            console.log('in check');
            var matched = false;
            for(var i = 0; i<this.users.length; i++)
            {
                if(this.username == this.users[i]['username'] || this.email == this.users[i]['email'] )
                {
                    matched =true;         
                    var origList = this.users[i];        // get the original user

                    // copy the user
                    var updatedList = this.copyObject(origList);
        
                    // delete the '.key' attribute
                    this.deleteAttribute(updatedList, '.key');   
        
                    // update the logged in status 
                    updatedList.loggedin = true;   
        
                    // update to Firebase
                    usersRef.child(origList['.key']).update(updatedList);            
                    location.href = "projectmanager.html";
                }
            }
        },
    }
});

// mount Vue app within specific HTML element
app.$mount('#app')
