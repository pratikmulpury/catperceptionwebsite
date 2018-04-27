<template>
  <div id="app">
    <div class = "signin">
      <router-link to="/login">Manage my Account</router-link>
    </div>
    <div class = "nav">
      <ul>
        <li class = "one"><h1> Categorical Perception Research Pool</h1></li>
        <li class = "two"><router-link to="/">Home</router-link></li>
        <li class = "three"><router-link to="/quiz">Take the Quiz</router-link></li>
        <li class = "four"><router-link to="/analysis">Our Findings</router-link></li>
        <li class = "five"><a href="http://sites.biology.duke.edu/nowicki/index.html"> Our Lab </a></li>
      </ul>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
/* eslint-disable */

  import Firebase from 'firebase';

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyBiu6_jPRpm7_31XPDDKdLVlyiPB4DnUIs",
    authDomain: "quiz-8a684.firebaseapp.com",
    databaseURL: "https://quiz-8a684.firebaseio.com",
    projectId: "quiz-8a684",
    storageBucket: "quiz-8a684.appspot.com",
    messagingSenderId: "673518372688"
  };
  var db = Firebase.initializeApp(config).database();

export default {
    name: 'App',
    data () {
        return {
            // state for vue-images component, must be established BEFORE component is rendered
            images: [],
            // useful data about the current user
            user: null
        }
    },
    methods: {
        // get image selected by user and upload it to Firebase for storage
        storeImage: function(title, imageFile) {
            if (this.user) {
                storageRef.child('images/' + imageFile.name)
                          .put(imageFile)
                          .then(snapshot => {
                                    var toAdd = {
                                        imageUrl: snapshot.downloadURL,
                                        caption: `${title} shared by ${this.user.name}`
                                    }
                                    // vue-images component does not play nicely with Firebase so need to manually add to both
                                    imagesRef.push(toAdd)
                                    this.images.push(toAdd)
                                })
            }
            else {
                alert('You must be logged in to add images')
            }
        },
        // allow child component to change user value
        getUser: function () {
            return this.user
        },
        setUser: function (user) {
            this.user = user
        }
    }
}
</script>
<style>

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
body {
  margin: 0;
  background-color:#D3D3D3;
}
.signin {
  background:#fff;
  padding-top:3px;
  padding-bottom:3px;
}
.signin a {
  margin-top:3px;
  font-family: Source Sans Pro,Helvetica Neue,Helvetica,Arial,sans-serif;;
  font-size:14px;
  color: #1A1A1A;
  display:block;
  margin-right: 30px;
  text-align: right;
}
.signin a:hover {
  color: blue;
}
.nav {
  background: #1A1A1A;
  width:100%;
  margin:0 auto;
  padding:0;
  list-style:none;
  text-align:center;

}
.nav h1{
  color: #fff;
  font-family: Stanford,Source Serif Pro,Georgia,Times,Times New Roman,serif;
  font-size:24px;
  padding:12px 0 13px 0;
  margin:0;
  display:block;
}

ul {
  background: #1A1A1A;
  margin-top:0px;
}
li{
  display:inline-block;
  margin-left:9px;
  margin-right:9px;
  padding:0;
}
.nav a{
  padding:12px 0 13px 0;
  margin:0;
  display:block;
  font-family: Source Sans Pro,Helvetica Neue,Helvetica,Arial,sans-serif;;
  font-size:18px;
  text-decoration: none;
  color: #fff;
  -webkit-transition: background-color 1s;
  -moz-transition: background-color 1s;
  -o-transition: background-color 1s;
  transition: background-color 1s;
}
.nav a:hover {
  color: #D3D3D3;
}
</style>
