<template>
  <div id="app">
    <div  v-show="!quizSelected" >
      <H1> Choose A Quiz Based on your Personality</H1>
      <button  v-on:click="changeQuizSelection(1)" > (Computer Science Quiz) </button>
      <button  v-on:click="changeQuizSelection(2)"> (Math Quiz) </button>
      <button  v-on:click="changeQuizSelection(3)"> (Tennis Quiz) </button>
    </div>
        <local-quiz v-if = 'this.quizSelection === 1' v-bind:quizdata = comp v-show="quizSelected && this.quizSelection === 1" v-on:update="getBack()" > </local-quiz>
        <local-quiz v-if = 'this.quizSelection === 2' v-bind:quizdata = math v-show="quizSelected && this.quizSelection === 2"  v-on:update="getBack()"  >  </local-quiz>
        <local-quiz v-if = 'this.quizSelection === 3' v-bind:quizdata = tennis v-show="quizSelected && this.quizSelection === 3" v-on:update="getBack()" >  </local-quiz>
    </div>
  </div>
</template>

<script>

  import quiz from './components/Quiz.vue';
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
  var csquizRef = db.ref('computersciencequiz');
  var mathquizRef = db.ref('mathquiz');
  var tennisquizRef = db.ref('tennisquiz');
  export default {
    components:{
      'local-quiz': quiz
    },
    firebase:{
      comp:csquizRef,
      math:mathquizRef,
      tennis:tennisquizRef,
    },
    data () {
        return {
              quizSelected: false,
              quizSelection: 0
            }
    },
    methods: {
      changeQuizSelection: function(index)
      {
        this.quizSelection = index;
        this.quizSelected = !this.quizSelected;
      },
      getBack: function()
      {
        this.quizSelected = false;
        this.quizSelection = 0;
      }
    }  
  }
</script>
































<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
