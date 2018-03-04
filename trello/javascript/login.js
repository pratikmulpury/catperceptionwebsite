/*
 *  A simple todo list app.
 *
 * @author Robert Duvall
 */

// visibility filters
var filters = {
    all: function (todos) {
        return todos;
    },
    active: function (todos) {
        return todos.filter(todo => !todo.completed);
    },
    completed: function (todos) {
        return todos.filter(todo => todo.completed);
    }
}

// set up for Firebase
var config = {
    apiKey: "AIzaSyALCV8Td0bxq7yx010JOTZExuprMW9LNOM",
    authDomain: "trello-290-28956.firebaseapp.com",
    databaseURL: "https://trello-290-28956.firebaseio.com",
    projectId: "trello-290-28956",
    storageBucket: "",
    messagingSenderId: "237477910372"
};
// global access to initialized app database
var db = firebase.initializeApp(config).database();
// global reference to remote data
var todosRef = db.ref('todos');
// connect Firebase to Vue
Vue.use(VueFire);

// instance of Vue app
var app6 = new Vue({
    el: '#getusername',
    data: {
      username: 'Hello Vue!',
      message: 'Test Message'
    },
    computed:{
        username:{
            get: function(){ 
                return store.state.name; 
            }, 
            set: function(newName){ 
                debugger;
                store.dispatch('addName',newName);
            }
        }
    },

    watch: {
        'username.value': function(newVal, oldVal) {
          console.log('value changed from ' + oldVal + ' to ' + newVal);
      }
    }

  })
