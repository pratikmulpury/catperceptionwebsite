<template>

    <div  v-bind:style="{ 'background-color': quizdata[0].color }" class= "panel panel-default"  >

        <h1> Quiz </h1>
        <button v-show = "incorrectquestion" v-on:click = "goToUnanswered()"> Previous Unanswered or Incorrect Question</button>
        <button v-show = "this.questionindex === 4" v-on:click = "goBack()"> Go Back to the Index Page</button>

        <div v-for= "list of Array.from(quizdata)" v-if = "list['.key'] === ('question' + questionindex)" >
            {{list['question']}}
            <div v-for = "choice in list['choices']">
                <button v-on:click="selectChoice(choice,list)"> {{choice['text']}} </button>
            </div>
        </div>
        <div id = "endquiz" v-show= "this.questionindex === 4">
            <h2> You answered {{(this.questionscorrect/3)*100}}% correctly !</h2>
        </div>
    </div>
</template>
<script>
    // export anonymous object from this module so it can be accessed by others when imported
    export default {
        name: 'Quiz',
        // these values will be filled in by parent component, values must match tag's attribute names
        props: [
            'quizdata'
        ],
        data: function () {
            return {
                questionindex: 1,
                questionscorrect:0,
                incorrectquestion: false,
                wrongQuestions: []
        }
        },
        methods:{

            selectChoice : function(choice,list)
            {

                if(choice['correct'] === true)
                {
                    this.questionscorrect += 1;
                    for(var i = this.wrongQuestions.length-1; i>=0; i-=1)
                    {
                        if (this.wrongQuestions[i] === this.questionindex)
                        {
                            this.wrongQuestions.splice(i,1);
                        }
                    }
                    this.questionindex += 1;
                }
                else
                {
                    this.incorrectquestion = true;
                    this.wrongQuestions.push(this.questionindex);
                    this.questionindex += 1;
                }
            },
            goToUnanswered: function()
            {
                if(this.wrongQuestions.length>0)
                {
                    this.questionindex = Math.min.apply(null,this.wrongQuestions);
                }
            },
            goBack : function()
            {
                this.questionindex = 1;
                this.questionscorrect = 0;
                this.incorrectquestion = false;
                this.wrongQuestions = [];
                this.$emit('update'); 
            }
        }
    }
</script>