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
var listsRef = db.ref('Lists');
var usersRef = db.ref('Users');

// connect Firebase to Vue
Vue.use(VueFire);

// instance of Vue app
var app = new Vue({
    // initial tracked app state
    data: {
        // lists: [],
        // users: [],

        // for testing. data of lists and users should come from firebase
        /*
        lists: [
            {
                name: "todo",
                isEditName: 0,
                isAddCard: 0,
                "collapsed": false,
                Cards: [
                    {
                        name: "card1",
                        isEditName: 0,
                        isMoveToList: 0,
                        collapseCard: 1,
                        completed: false,
                        isAddComment: 0,
                        Comments: [],
                        isAddUser: 0,
                        Users: []
                    },
                    {
                        name: "card2",
                        isEditName: 0,
                        isMoveToList: 0,
                        collapseCard: 1,
                        completed: false,
                        isAddComment: 0,
                        Comments: [],
                        isAddUser: 0,
                        Users: []
                    }
                ]
            },
            {
                name: "in progress",
                isEditName: 0,
                isAddCard: 0,
                "collapsed": false,
                Cards: [
                    {
                        name: "card3",
                        isEditName: 0,
                        isMoveToList: 0,
                        collapseCard: 1,
                        completed: false,
                        isAddComment: 0,
                        Comments: [],
                        isAddUser: 0,
                        Users: []
                    },
                    {
                        name: "card4",
                        isEditName: 0,
                        isMoveToList: 0,
                        collapseCard: 1,
                        completed: false,
                        isAddComment: 0,
                        Comments: [],
                        isAddUser: 0,
                        Users: []
                    }
                ]
            },
            {
                name: "done",
                isEditName: 0,
                isAddCard: 0,
                "collapsed": false,
                Cards: [
                    {
                        name: "card5",
                        isEditName: 0,
                        isMoveToList: 0,
                        collapseCard: 1,
                        completed: false,
                        isAddComment: 0,
                        Comments: [],
                        isAddUser: 0,
                        Users: []
                    },
                    {
                        name: "card6",
                        isEditName: 0,
                        isMoveToList: 0,
                        collapseCard: 1,
                        completed: false,
                        isAddComment: 0,
                        Comments: [],
                        isAddUser: 0,
                        Users: []
                    }
                ]
            }
        ],

        users: [
            {
                username: 'testUser1'
            },
            {
                username: 'testUser2'
            },
            {
                username: 'testUser3'
            },
            {
                username: 'testUser4'
            }
        ],
        */

        // variables for lists
        newListName: '',
        updatedListName: '',
        collapseLists: 0,
        expandCollapseListText: 'Collapse List',

        // variables for Cards
        newCardName: '',
        updatedCardName: '',
        moveCardToListName: '',
        newComment: '',
        newUser: '',


        visibility: 'all'
    },

    // local representations of firebase data
    firebase: {
        //todos: todosRef
        lists: listsRef,
        users: usersRef
    },

    // methods that can be treated as data from within HTML code
    computed: {
        // return todos that match the currently selected filter
        filteredTodos: function() {
            return filters[this.visibility](this.todos);
        },

        // return count of the remaining active todo items
        remaining: function() {
            return filters.active(this.todos).length;
        }
    },

    // methods that can be called from within HTML code, typically through input elements
    methods: {

        pushDummyData: function() {
            for(var i = 0; i < this.lists.length; i++) {
                listsRef.push(this.lists[i]);
            }
            for(var i = 0; i < this.users.length; i++) {
                usersRef.push(this.users[i]);
            }
        },

        // change current filter to the given value
        setFilter: function(filter) {
            this.visibility = filter;
        },

        // expand or collapse lists
        toggleExpandCollapseLists: function() {
            this.collapseLists = !this.collapseLists;
            if (this.collapseLists) {
                this.expandCollapseListText = 'Expand List';
            } else {
                this.expandCollapseListText = 'Collapse List';
            }
                    
        },

        // create a new list
        addList: function()
        {
            this.newListName = this.newListName.trim();
            // add new list name into the list array
            app.lists.push({ name: this.newListName, isEditName: 0, isAddCard: 0, 
                            collapsed: false, Cards: []});
            this.newListName = '';

            this.persistDataInFireBase();

        },      

        // delete a list
        deleteList: function(index) {                
            app.lists.splice(index, 1);

            this.persistDataInFireBase();
        },
 
        // show the text box to edit list name
        showEditListInput: function(index) {  
            if (app.lists[index].isEditName == 1) {
                app.lists[index].isEditName = 0;    
            } else {
                app.lists[index].isEditName = 1;
            }

        },        

        // edit list name
        editList: function(index) {  
            var origList = app.lists[index];        // get the original list
            origList.name = this.updatedListName;    // just update the list name
            origList.isEditName = 0;

            app.lists.splice( index, 1, origList );             
            this.updatedListName = '';  // clear the input text box

            this.persistDataInFireBase();
        },  
        
        // move list up
        moveListUp: function(index) { 
            if (index > 0) {  
                // swap the list record between lists[index - 1] and list[index]
                var upperList = app.lists[index - 1];
                var lowerList = app.lists[index];
                app.lists.splice(index - 1, 1, lowerList);
                app.lists.splice(index, 1, upperList);

                this.persistDataInFireBase();
            }            
        },    

       // move list down
       moveListDown: function(index) { 
           var listsLength = app.lists.length;
            if (index < listsLength - 1) {  
                // swap the list record between lists[index] and list[index + 1]
                var upperList = app.lists[index];
                var lowerList = app.lists[index + 1];
                app.lists.splice(index, 1, lowerList);
                app.lists.splice(index + 1, 1, upperList);

                this.persistDataInFireBase();
            }
        },  

        // show the text box to create a new card name
        showAddCardInput: function(index) {  
            console.log("isAddCard1: " + app.lists[index].isAddCard);

            if (app.lists[index].isAddCard == 1) {
                app.lists[index].isAddCard = 0;    
            } else {
                app.lists[index].isAddCard = 1;
            }

            console.log("isAddCard2: " + app.lists[index].isAddCard);

        },        

       // create a new card in current list
       addCard: function(index)
       {
           console.log("index: " + index);
           this.newCardName = this.newCardName.trim();
           // add new card name into the card array
           var curList = app.lists[index];  
           if (curList.Cards == null) {
               curList["Cards"] = [];   // add empty Cards if there is none.   
           }

           app.lists[index].Cards.push({ name: this.newCardName, isEditName: 0,  isMoveToList: 0, 
                                        collapseCard: 1, completed: false, isAddComment: 0, Comments: [],
                                        isAddUser: 0, Users: []});

           this.newCardName = '';
           app.lists[index].isAddCard = 0;  // hide add card name text input

           this.persistDataInFireBase();
       },      

       // delete a card
       deleteCard: function(index, list) {                
           list.Cards.splice(index, 1);

           this.persistDataInFireBase();
       },

       // show the text box to edit card name
       showEditCardInput: function(index, list) {  
           if (list.Cards[index].isEditName == 1) {
                list.Cards[index].isEditName = 0;    
           } else {
                list.Cards[index].isEditName = 1;
           }
       },        

       // edit card name
       editCard: function(index, list) {    
           // get original card
           var origCard = list.Cards[index];
           origCard.name = this.updatedCardName;    // update card name
           origCard.isEditName = 0;

           list.Cards.splice( index, 1, origCard );             
           this.updatedCardName = '';  // clear the input text box

           this.persistDataInFireBase();
       },  


       // move card up
       moveCardUp: function(index, list) {
           console.log("lists: " + JSON.stringify(this.lists));

           console.log("list.Cards: " + JSON.stringify(list.Cards));

           if (index > 0) {  
               // swap the card record between Cards[index - 1] and Cards[index]
               var upperCard = list.Cards[index - 1];
               var lowerCard = list.Cards[index];
               list.Cards.splice(index - 1, 1, lowerCard);
               list.Cards.splice(index, 1, upperCard);

               this.persistDataInFireBase();
           }
       },    

      // move card down
      moveCardDown: function(index, list) { 
          var CardsLength = list.Cards.length;
           if (index < CardsLength - 1) {  
               // swap the card record between Cards[index] and Cards[index + 1]
               var upperCard = list.Cards[index];
               var lowerCard = list.Cards[index + 1];
               list.Cards.splice(index, 1, lowerCard);
               list.Cards.splice(index + 1, 1, upperCard);

               this.persistDataInFireBase();
           }
       },
       
       // show the text box to move card to another list
       showMoveCardToListInput: function(index, list) { 
            if (list.Cards[index].isMoveToList == 1) {
                list.Cards[index].isMoveToList = 0;    
            } else {
                list.Cards[index].isMoveToList = 1;
            }
       },

       // move card to another list
       moveCardToList: function(index, list) {   
           var newListName = this.moveCardToListName.trim();

           // find index of new list
           var newListIndex = 0;
           for (var i = 0; i < app.lists.length; i++) {
               if (app.lists[i].name == newListName) {
                   newListIndex = i;
                   break;
               }
           }

           // add card to new list
           var card = list.Cards[index];
           card.isMoveToList = 0;         // hide text input box
           app.lists[newListIndex].Cards.push(card);

           // remove card from old list
           this.deleteCard(index, list);
            
           this.moveCardToListName = '';  // clear the input text box

           this.persistDataInFireBase();
       },  
    
       // expand or collapse a card
       toggleExpandCollapseCard: function(index, list) {
           if (list.Cards[index].collapseCard == 1) {
            list.Cards[index].collapseCard = 0;
           } else {
            list.Cards[index].collapseCard = 1;
           }
       },

       // show the text box to add comment to a card
       showAddCommentToCardInput: function(card) {
           if (card.isAddComment == 1) {
               card.isAddComment = 0;    
           } else {
               card.isAddComment= 1;
           }
       },
       
       // add new comment to a card
       addCommentToCard: function(card) {

            if (card.Comments == null) {
                card["Comments"] = [];   // add empty Comments if there is none.   
            }
                    
            card.Comments.push({ description: this.newComment});                        

            this.newComment = '';  // clear the input text box
            card.isAddComment = 0;

            this.persistDataInFireBase();
       },  

       // show the dropdown list to add user to a card
       showAddUserToCardInput: function(card) {
        if (card.isAddUser == 1) {
            card.isAddUser = 0;    
        } else {
            card.isAddUser= 1;
        }
       },
    
      // add new user to a card
      addUserToCard: function(card) {
          console.log("new user: " + this.newUser);

          if (card.Users == null) {
            card["Users"] = [];   // add empty Users if there is none.   
          }

          card.Users.push({ username: this.newUser});                        

          this.newUser = '';  // clear the input text box
          card.isAddUser = 0;

          this.persistDataInFireBase();
      },  
      
      // persist data in firebase
      persistDataInFireBase: function() {
        // save data to a string
        var listsStr = JSON.stringify(this.lists);
        var usersStr = JSON.stringify(this.users);

          // delete all data
        listsRef.remove();
        usersRef.remove();
        
        var newLists = JSON.parse(listsStr);
        var newUsers = JSON.parse(usersStr);
        
        // remove .key property before send to firebase
        var keyToDelete = ".key";
        for(var i = 0; i < newLists.length; i++) {
            
            var curList = newLists[i];
            delete curList[keyToDelete];
        
            var cardList = curList.Cards;
            if(cardList != null) {
                for(var j = 0; j < cardList.length; j++) {
        
                    var curCard = cardList[j];
                    delete curCard[keyToDelete];
        
                    var commentList = curCard.Comments;
                    if (commentList != null) {
                        for(var w = 0; w < commentList.length; w++) {
                            
                            var curComment = commentList[w];
                            delete curComment[keyToDelete];                                        
                        }
                    }

                    var userList = curCard.Users;
                    if (userList != null) {
                        for(var w = 0; w < userList.length; w++) {
                            
                            var curUser = userList[w];
                            delete curUser[keyToDelete];                                        
                        }                
                    }
                }
            }
            
        }

        for(var i = 0; i < newUsers.length; i++) {
          
            var curList = newUsers[i];
            delete curList[keyToDelete];

        }             

          // save all data in firebase
        for(var i = 0; i < newLists.length; i++) {
            listsRef.push(newLists[i]);
        }
        for(var i = 0; i < newUsers.length; i++) {
            usersRef.push(newUsers[i]);
        }

        // refresh page
        location.href = 'projectmanager.html';   
    },      

    }
});


// mount
app.$mount('#todoapp')
