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
var projectsRef = db.ref('Projects');
var storageRef = firebase.storage().ref();
var categoriesRef = db.ref('Categories');
// connect Firebase to Vue
Vue.use(VueFire);

// instance of Vue app
var app = new Vue({
    // initial tracked app state
    
    data: {
        // variables for lists
        newDescription: '',
        newTodo: '',
        assignedCategory: '',
        backgroundcolor: '',
        newusername :'',
        newemail: '',
        newImageTitle:'',
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
        visibility: 'all',
    },

    // local representations of firebase data
    firebase: {
        lists: listsRef,
        users: usersRef,
        projects: projectsRef,
        categories: categoriesRef
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

        editBackgroundColor: function()
        {

            var origProject = app.projects[0];        // get the original list

            // copy the list
            var updatedProject = this.copyObject(origProject);

            // delete the '.key' attribute
            this.deleteAttribute(updatedProject, '.key');   

            // update the list name
            updatedProject.color = this.backgroundcolor;   

            // update to Firebase
            projectsRef.child(origProject['.key']).update(updatedProject);            
            
            this.backgroundcolor = '';  // clear the input text box
        },
        
        update: function(){
            var currentuser = -5;
            for(var i = 0; i < this.users.length; i++)
            {
                if(this.users[i]['loggedin'] === true)
                {
                    currentuser = i;
                }
            }
            var origList = this.users[currentuser];        // get the original user
            // copy the user
            var updatedList = this.copyObject(origList);
            var origList2 = this.copyObject(origList);

            // delete the '.key' attribute
            this.deleteAttribute(updatedList, '.key');        
            if(this.newusername && this.newusername != this.users[currentuser]['username'])   
            {
                console.log("username");
                // update the username
                updatedList.username = this.newusername;   
            }         
            if(this.newemail && this.newemail != this.users[currentuser]['email'])   
            {
                console.log("email");
                // update the email
                updatedList.email = this.newemail;   
            }         
            var input = document.getElementById('files');
            if(this.newImageTitle &&  input.files.length > 0)   
            {
                console.log("image stuff");
                // update the image information
                var file = input.files[0];
                // get reference to a storage location and
                storageRef.child('images/' + file.name)
                          .put(file)
                          .then(snapshot => this.addUser(snapshot.downloadURL,updatedList));
                updatedList.imagetitle = this.newImageTitle;
            }                

            console.log(updatedList);
            usersRef.child(origList['.key']).update(updatedList);  
            this.newusername = "";
            this.newemail = "";
            this.newImageTitle = "";
            this.updateUserNameInCards(origList2.username, updatedList.username);
        },
      
        // update user name who has been assigned to cards
        updateUserNameInCards(origUserName, newUserName) {
            console.log(origUserName+'origusername');
            console.log(newUserName+'newusername');

            for(var i = 0; i < app.lists.length; i++) {
                var list = app.lists[i];
                // get cards in this list
                var cards = list.Cards;
                console.log(list+'list');
                console.log(cards+'cards');
                var cardsKeys = Object.keys(cards);
                console.log(cardsKeys);
                for(var j = 0; j < cardsKeys.length; j++) {
                    console.log('entered first for loop');
                    var card = cards[cardsKeys[j]];
                    // loop through each user
                    var users = card.Users;
                    var usersKeys = Object.keys(users);
                    for(var w = 0; w < usersKeys.length; w++) {
                        console.log('entered second for loop');
                        var user = users[usersKeys[w]];
                        console.log("user"+user);
                        console.log(user.username);
                        // if match if found
                        if(user.username == origUserName) {
                            console.log("final if executed");
                            // update user name for this assigned user
                            var cardKey = cardsKeys[j];
                            var userKey = usersKeys[w];
                            listsRef.child(list['.key']).child('Cards').child(cardKey)
                            .child('Users').child(userKey).update({username: newUserName});                     
                        }
                    }
                }
            }
        },
        addUser : function(url,updatedList) {
            // now that image has been stored in Firebase, create a reference to it in database
            updatedList.url = url;
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

            // add new list to Firebase
            var newList = { name: this.newListName, isEditName: 0, isAddCard: 0, 
                collapsed: false, Cards: []};
            listsRef.push(newList);

            this.newListName = '';

        },      

        // delete a list
        deleteList: function(index) {                
            var deletedList = app.lists[index];
            listsRef.child(deletedList['.key']).remove();

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

            // copy the list
            var updatedList = this.copyObject(origList);

            // delete the '.key' attribute
            this.deleteAttribute(updatedList, '.key');   

            // update the list name
            updatedList.name = this.updatedListName;   
            updatedList.isEditName = 0;

            // update to Firebase
            listsRef.child(origList['.key']).update(updatedList);            
            
            this.updatedListName = '';  // clear the input text box

        },  
        
        // move list up
        moveListUp: function(index) { 
            if (index > 0) {  
                // swap the list record between lists[index - 1] and list[index]
                var upperList = app.lists[index - 1];
                var lowerList = app.lists[index];

                // create copy of these two lists
                var upperListCopy = this.copyObject(upperList);
                var lowerListCopy = this.copyObject(lowerList);

                // delete the .key attribute
                this.deleteAttribute(upperListCopy, '.key'); 
                this.deleteAttribute(lowerListCopy, '.key'); 

                // swap the position of these two lists and update to Firebase
                listsRef.child(lowerList['.key']).update({Cards: []});  // first reset Cards in each list
                listsRef.child(upperList['.key']).update({Cards: []});  // otherwise, Cards will be carried over to new list 
                
                listsRef.child(lowerList['.key']).update(upperListCopy);     // then swap lists       
                listsRef.child(upperList['.key']).update(lowerListCopy);            
            }            
        },    

       // move list down
       moveListDown: function(index) { 
           var listsLength = app.lists.length;
            if (index < listsLength - 1) {  
                // swap the list record between lists[index] and list[index + 1]
                var upperList = app.lists[index];
                var lowerList = app.lists[index + 1];

                // create copy of these two lists
                var upperListCopy = this.copyObject(upperList);
                var lowerListCopy = this.copyObject(lowerList);

                // delete the .key attribute
                this.deleteAttribute(upperListCopy, '.key'); 
                this.deleteAttribute(lowerListCopy, '.key'); 

                //console.log("upperListCopy: " + JSON.stringify(upperListCopy));
                //console.log("lowerListCopy: " + JSON.stringify(lowerListCopy));

                // swap the position of these two lists and update to Firebase
                listsRef.child(lowerList['.key']).update({Cards: []});  // first reset Cards in each list
                listsRef.child(upperList['.key']).update({Cards: []});  // otherwise, Cards will be carried over to new list 

                listsRef.child(lowerList['.key']).update(upperListCopy);  // then swap lists
                listsRef.child(upperList['.key']).update(lowerListCopy);            
            }
        },  

        // show the text box to create a new card name
        showAddCardInput: function(index) {  

            if (app.lists[index].isAddCard == 1) {
                app.lists[index].isAddCard = 0;    
            } else {
                app.lists[index].isAddCard = 1;
            }

        },        

       // create a new card in current list
       addCard: function(index)
       {
           console.log("index: " + index);
           this.newCardName = this.newCardName.trim();
           // add new card name into the card array           
           var curList = app.lists[index];  
           var creationdate = new Date();

	

           var deadline = new Date();
           var duration = 31; //In Days
           deadline.setTime(deadline.getTime() + (duration * 24 * 60 * 60 * 1000));

           creationdate = creationdate.toString();
           deadline = deadline.toString();


           console.log(creationdate);
           var newCard = { name: this.newCardName, categorycolor: 'black', CreationDate: creationdate, deadline: deadline, 
                isEditName: 0,  isMoveToList: 0, 
                collapseCard: 1, completed: false, isAddComment: 0, Comments: [],
                isAddUser: 0, Users: [], todisplay: true};
           console.log(newCard);

           // save it to Firebase
           listsRef.child(curList['.key']).child('Cards').push(newCard);

           // track changes
           var trackeddate = new Date();
           trackeddate = trackeddate.toString();
           var trackedchange = "New Card named: '" +  this.newCardName + "' was created on " + trackeddate;
           this.keepTrackOfChanges(trackedchange);

           this.newCardName = '';
           app.lists[index].isAddCard = 0;  // hide add card name text input
       },      

       // delete a card
       deleteCard: function(cardKey, list) {                

           listsRef.child(list['.key']).child('Cards').child(cardKey).remove();

       },

       // show the text box to edit card name
       showEditCardInput: function(cardKey, list) {  
           if (list.Cards[cardKey].isEditName == 1) {
                list.Cards[cardKey].isEditName = 0;    
           } else {
                list.Cards[cardKey].isEditName = 1;
           }
       },        

       // edit card name
       editCard: function(cardKey, list) {    
           // get original card
           var origCard = list.Cards[cardKey];
           var origCardnamecopy = this.copyObject(origCard.name);
           origCard.name = this.updatedCardName;    // update card name
           origCard.isEditName = 0;

           // update card name in Firebase
           listsRef.child(list['.key']).child('Cards').child(cardKey).update(origCard);        

            // track changes
            var trackeddate = new Date();
            trackeddate = trackeddate.toString();
            var trackedchange = " Card name was changed to: '" +  this.updatedCardName + "' from '" +origCardnamecopy +"' on " + trackeddate;
            this.keepTrackOfChanges(trackedchange);
            this.updatedCardName = '';  // clear the input text box
       },  


       // move card up
       moveCardUp: function(cardKey, list) {

           var cardIndex = this.findCardIndex(cardKey, list.Cards);

           if (cardIndex > 0) {  
               // swap the card record between Cards[index - 1] and Cards[index]
               var upperCard = this.getCardFromIndex(cardIndex - 1, list.Cards);
               var uppercardname = this.copyObject(upperCard.name);
               var lowerCard = this.getCardFromIndex(cardIndex, list.Cards);
               var upperCardKey = this.getCardKeyFromIndex(cardIndex - 1, list.Cards);
               var lowerCardKey = this.getCardKeyFromIndex(cardIndex, list.Cards);
               
                // swap the cards
               listsRef.child(list['.key']).child('Cards').child(lowerCardKey).update(upperCard);    
               listsRef.child(list['.key']).child('Cards').child(upperCardKey).update(lowerCard);   
               
                // track changes
                var trackeddate = new Date();
                trackeddate = trackeddate.toString();
                var trackedchange = " Card '" + uppercardname  + "' was moved up from " + (cardIndex-1) + " to " + cardIndex + " on " + trackeddate;
                this.keepTrackOfChanges(trackedchange);

           }

       },    

      // move card down
      moveCardDown: function(cardKey, list) { 
           var cardIndex = this.findCardIndex(cardKey, list.Cards);
           var cardsKeys = Object.keys(list.Cards);

           if (cardIndex < cardsKeys.length - 1) {  
               // swap the card record between Cards[index] and Cards[index + 1]
               var upperCard = this.getCardFromIndex(cardIndex, list.Cards);
               var lowerCard = this.getCardFromIndex(cardIndex + 1, list.Cards);
               var lowercardname = this.copyObject(lowerCard.name);
               var upperCardKey = this.getCardKeyFromIndex(cardIndex, list.Cards);
               var lowerCardKey = this.getCardKeyFromIndex(cardIndex + 1, list.Cards);
               
                // swap the cards
               listsRef.child(list['.key']).child('Cards').child(lowerCardKey).update(upperCard);    
               listsRef.child(list['.key']).child('Cards').child(upperCardKey).update(lowerCard);    
               
                // track changes
                var trackeddate = new Date();
                trackeddate = trackeddate.toString();
                var trackedchange = " Card '" + lowercardname  + "' was moved down from " + (cardIndex) + " to " + (cardIndex+1) + " on " + trackeddate;
                this.keepTrackOfChanges(trackedchange);

           }
       },
       
       // show the text box to move card to another list
       showMoveCardToListInput: function(cardKey, list) { 
            if (list.Cards[cardKey].isMoveToList == 1) {
                list.Cards[cardKey].isMoveToList = 0;    
            } else {
                list.Cards[cardKey].isMoveToList = 1;
            }
       },

      changeAssignedCategory : function(cardKey,list)
      {
            // get original card
            var origCard = list.Cards[cardKey];
            origCard.categoryname = this.assignedCategory;    // update card name
            if(this.assignedCategory === 'easy')
            {
                origCard.categorycolor = 'green';
            }
            if(this.assignedCategory === 'medium')
            {
                origCard.categorycolor = 'blue';
            }
            if(this.assignedCategory === 'hard')
            {
                origCard.categorycolor = 'red';
            }
            listsRef.child(list['.key']).child('Cards').child(cardKey).update(origCard); 
            
            // track changes
            var trackeddate = new Date();
            trackeddate = trackeddate.toString();
            var trackedchange = " Card '" + origCard.name + "' was assigned the category: '" + this.assignedCategory +"' on "  + trackeddate;
            this.keepTrackOfChanges(trackedchange);
            this.assignedCategory = '';  // clear the input text box  
      },
       // move card to another list
       moveCardToList: function(cardKey, list) {   
           var newListName = this.moveCardToListName.trim();

           // find index of new list
           var newListIndex = 0;
           for (var i = 0; i < app.lists.length; i++) {
               if (app.lists[i].name == newListName) {
                   newListIndex = i;
                   break;
               }
           }

           // step 1: add card to new list
           var card = list.Cards[cardKey];
           card.isMoveToList = 0;         // hide text input box

           var moveToList = app.lists[newListIndex];  
           listsRef.child(moveToList['.key']).child('Cards').push(card);    

           // step 2: remove card from old list
           this.deleteCard(cardKey, list);
        
            // track changes
            var trackeddate = new Date();
            trackeddate = trackeddate.toString();
            var trackedchange = " Card '" + card.name + "' was moved to the list: '" + app.lists[newListIndex].name + "' on "  + trackeddate;
            this.keepTrackOfChanges(trackedchange);
           this.moveCardToListName = '';  // clear the input text box

       },  
    
       // expand or collapse a card
       toggleExpandCollapseCard: function(cardKey, list) {
           if (list.Cards[cardKey].collapseCard == 1) {
            list.Cards[cardKey].collapseCard = 0;
           } else {
            list.Cards[cardKey].collapseCard = 1;
           }

           // get original card
           var origCard = list.Cards[cardKey];
           origCard.collapseCard = list.Cards[cardKey].collapseCard;

           // update this flag in Firebase
           listsRef.child(list['.key']).child('Cards').child(cardKey).update(origCard);   

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
       addCommentToCard: function(cardKey, list) {
            var card = list.Cards[cardKey];
            // add new comment to cards in Firebase
            var newCommentObj = {comments: this.newComment};
            listsRef.child(list['.key']).child('Cards').child(cardKey).child('Comments').push(newCommentObj);   

            this.newComment = '';  // clear the input text box
            card.isAddComment = 0;

            // track changes
            var trackeddate = new Date();
            trackeddate = trackeddate.toString();
            var trackedchange = " Card '" + card.name + "' had a comment added to it  on "  + trackeddate;
            this.keepTrackOfChanges(trackedchange);

       },  
       addDescriptionToCard: function(cardKey, list) {
        
        // add new description to cards in Firebase

        var origCard = list.Cards[cardKey];
        origCard.description = this.newDescription;    
        listsRef.child(list['.key']).child('Cards').child(cardKey).update(origCard);
        
        // track changes
        var trackeddate = new Date();
        trackeddate = trackeddate.toString();
        var trackedchange = " Card '" + origCard.name + "' had its description modified on "  + trackeddate;
        this.keepTrackOfChanges(trackedchange);

        this.newDescription = '';  // clear the input text box
   },  
       addTodos: function(cardKey, list) {
            var card = list.Cards[cardKey];
            // add new comment to cards in Firebase
            var newTodotObj = {todos: this.newTodo};
            listsRef.child(list['.key']).child('Cards').child(cardKey).child('Todos').push(newTodotObj);   

            // track changes
            var trackeddate = new Date();
            trackeddate = trackeddate.toString();
            var trackedchange = " Card '" + card.name + "' had a todo added to it on "  + trackeddate;
            this.keepTrackOfChanges(trackedchange);

            this.newTodo = '';  // clear the input text box
      },  
       // show the dropdown list to add user to a card
       showAddUserToCardInput: function(card) {
        if (card.isAddUser == 1) {
            card.isAddUser = 0;    
        } else {
            card.isAddUser= 1;
        }
       },
       storeCardImage:function (cardKey,list) {
            // get input element user used to select local image
            console.log("storeimage");
            var input = document.getElementById('files2');
            console.log(input.files[0]);
            // have all fields in the form been completed
            if (input.files.length > 0) {
                console.log("in first if ");
                var file = input.files[0];
                console.log(file);
                // get reference to a storage location and
                storageRef.child('images/' + file.name)
                        .put(file)
                        .then(snapshot => this.addImagesToCard(snapshot.downloadURL,cardKey,list));
                // reset input values so user knows to input new data
                input.value = '';
            }
        },
        addImagesToCard: function(url,cardKey,list)
        {
            console.log("called add images to cards");
            console.log(url +'url');
            var card = list.Cards[cardKey];
            // add new images to cards in Firebase
            var newimage = {url: url};
            listsRef.child(list['.key']).child('Cards').child(cardKey).child('Images').push(newimage);   

            var trackeddate = new Date();
            trackeddate = trackeddate.toString();
            var trackedchange = " Card '" + card.name + "' had an image added to it on "  + trackeddate;
            this.keepTrackOfChanges(trackedchange);
        },
      // add new user to a card
      addUserToCard: function(cardKey, list) {
        var card = list.Cards[cardKey];
        // add new user to cards in Firebase
        var newUserObj = {username: this.newUser};        
        listsRef.child(list['.key']).child('Cards').child(cardKey).child('Users').push(newUserObj);   
        // track changes
        var trackeddate = new Date();
        trackeddate = trackeddate.toString();
        var trackedchange = " Card '" + card.name + "' had an user added to it on "  + trackeddate;
        this.keepTrackOfChanges(trackedchange);

        this.newUser = '';  // clear the input text box
        card.isAddUser = 0;

      },  

      // create a copy of an object
      copyObject: function(obj) {        
          var copyObjStr = JSON.stringify(obj);  
          var copyObj = JSON.parse(copyObjStr);      
          return copyObj;
      },

      // delete an attribute from an object
      deleteAttribute: function(obj, keyToDelete) {
          delete obj[keyToDelete];
      },
              
      // find the index of a card in the Cards list
      findCardIndex: function(cardKey, cards) {
        var cardIndex = -1;
        var cardsKeys = Object.keys(cards);

        for(var i = 0; i < cardsKeys.length; i++){
            if (cardsKeys[i] == cardKey) {
                cardIndex = i;
                break;
            }
        }

        return cardIndex;
      },

      // return the card in the Cards list based on card index
      getCardFromIndex: function(index, cards) {
        var cardsKeys = Object.keys(cards);

        var card = '';
        if (index > -1 && index < cardsKeys.length){
            card = cards[cardsKeys[index]];
        }

        return card;

      },
      // return the card key in the Cards list based on card index
      getCardKeyFromIndex: function(index, cards) {
        var cardsKeys = Object.keys(cards);

        var cardKey = '';
        if (index > -1 && index < cardsKeys.length){
            cardKey = cardsKeys[index];
        }

        return cardKey;

      },
      keepTrackOfChanges(trackedchange)
      {
        // add new change object to project in Firebase
        var newChangeObj = {additionalchange: trackedchange};
        projectsRef.child(app.projects[0]['.key']).child('Changes').push(newChangeObj);   
      },
      testDummyData: function() {
        console.log(JSON.stringify(this.lists));
        console.log(JSON.stringify(this.users));
      },
      categoricallyDisplayCards: function(cattype){

        for(var i = 0; i < app.lists.length; i++) {
            var list = app.lists[i];
            // get cards in this list and their keys
            var cards = list.Cards;
            var cardsKeys = Object.keys(cards);
            for(var j = 0; j < cardsKeys.length; j++) {
                var card = cards[cardsKeys[j]];
                if(card.categoryname!= cattype)
                {
                    card.todisplay = false;
                }
                else
                {
                    card.todisplay = true;
                }
                if(cattype === 'all')
                {
                    card.todisplay = true;
                }
                listsRef.child(list['.key']).child('Cards').child(cardsKeys[j]).update(card);              
            }
        }
      },
      logout: function(){
            console.log('in logout');
            for(var i = 0; i<this.users.length; i++)
            {
                matched =true;         
                var origList = this.users[i];        // get the original user

                // copy the user
                var updatedList = this.copyObject(origList);
    
                // delete the '.key' attribute
                this.deleteAttribute(updatedList, '.key');   
    
                // update the logged in status 
                updatedList.loggedin = false;   
    
                // update to Firebase
                usersRef.child(origList['.key']).update(updatedList);  
                location.href = "login.html";      
            }
      },
      viewChanges: function(){
 
        location.href = "changes.html";      
      }
    }
});


// mount
app.$mount('#todoapp')
