/*
 */

// visibility filters
var filters = {
    /*
    all: function (todos) {
        return todos;
    },
    active: function (todos) {
        return todos.filter(todo => !todo.completed);
    },
    completed: function (todos) {
        return todos.filter(todo => todo.completed);
    }
    */
}

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
// global reference to remote data
var listsRef = db.ref('Lists');
var usersRef = db.ref('Users');
var projectsRef = db.ref('Projects')
var storageRef = firebase.storage().ref();
var categoriesRef = db.ref('Categories');
// connect Firebase to Vue
Vue.use(VueFire);

// instance of Vue app
var app = new Vue({
    // initial tracked app state
    
    data: {

    },

    // local representations of firebase data
    firebase: {

        projects: projectsRef,
    },

    // methods that can be treated as data from within HTML code
    computed: {
        // return todos that match the currently selected filter
        /*
        filteredTodos: function() {
            return filters[this.visibility](this.todos);
        },

        // return count of the remaining active todo items
        remaining: function() {
            return filters.active(this.todos).length;
        }
        */

    },

    // methods that can be called from within HTML code, typically through input elements
    methods: {

        goBack: function()
        {
            location.href = "projectmanager.html";
        }
    }
});


// mount
app.$mount('#changetracker')
