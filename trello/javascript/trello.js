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
var app = new Vue({
    // initial tracked app state
    data: {
        lists: [],
        newTodo: '',
        visibility: 'all'
    },

    // local representations of firebase data
    firebase: {
        todos: todosRef
    },

    // methods that can be treated as data from within HTML code
    computed: {
        // return todos that match the currently selected filter
        filteredTodos () {
            return filters[this.visibility](this.todos);
        },

        // return count of the remaining active todo items
        remaining () {
            return filters.active(this.todos).length;
        }
    },

    // methods that can be called from within HTML code, typically through input elements
    methods: {
        // change current filter to the given value
        setFilter (filter) {
            this.visibility = filter;
        },
        addList()
        {

        },      
        // add newly entered todo item if it exists and clear it to prepare for the next one
        addTodo () {
            this.newTodo = this.newTodo.trim();
            if (this.newTodo) {
                todosRef.push({
                    title: this.newTodo,
                    completed: false
                }).then((data, err) => { if (err) { console.log(err) }});
                // text input displays this value, so clear it to indicate ready to type a new one
                this.newTodo = '';
            }
        },

        // remove given todo from the list
        removeTodo (todo) {
            //this.todos.splice(this.todos.indexOf(todo), 1);
            todosRef.child(todo['.key']).remove();
        },

        // remove all completed todos from the list
        removeCompleted () {
            // this.todos = filters.active(this.todos)
            // very readable, "slow" way to remove many items
            //filters.completed(this.todos).forEach(todo => this.removeTodo(todo));
            // "batch" updates for more efficient use of database
            todosRef.orderByChild("completed")
                    .equalTo(true)
                    .once('value')
                    .then(snapshot => {
                        var updates = {};
                        // assigning node to null is the same as calling remove would be
                        snapshot.forEach(child => updates[child.key] = null);
                        // remove all in one asynchonous call
                        todosRef.update(updates);
                     })
                    .catch(err => console.log(err));
        },

        // replaces v-model since that only represents local version of the object
        toggleTodo (todo) {
            todosRef.child(todo['.key']).update({ completed: !todo.completed });
        }
    }
});


// define custom filter to correctly pluralize the word
Vue.filter('pluralize', function (n) {
    return n === 1 ? 'item' : 'items';
});

// mount
app.$mount('#todoapp')
