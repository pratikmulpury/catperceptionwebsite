<template>
  <div class="home">
    <div class = "subtitle">
        <div class = "mytext">
            <h1> Join our Research </h1>
            <img src="/static/colorshit.gif"  alt = "Categorical Perception" >
            <p> <strong>All Potential Participants Welcome:</strong> Aid us in exploring human categorical perception! Humans and many animals are known to interpret and perceive their surroundings  through a limited, categorically structured, and often culturally developed lense rather than the natural color spectrum they more accurately exist in. Research of this subject requires large sample sizes from an abundance of regions and demographics. </p>
        </div>
        <div class = "images">
            <img class = "first" src="/static/image1cat.png"  alt = "Categorical Perception" >
            <img class = "second" src="/static/image2cat.png"  alt = "Categorical Perception" >
        </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home'
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.subtitle{
    background-color: #D3D3D3;
    display: table;
}
.images{
    float: right;
    width: 50%;
    height:600px;
}
.mytext{
    float: left;
    width: 50%;
    height:600px;
}
.first{
    margin-top:30px;
    width:80%;
    height:auto;
    margin-left:15px;
}
.second{
    margin-top:20px;
    width:80%;
    height:auto;
    margin-left:15px;
}

.mytext img{
    display: block;
    margin-left: auto;
    margin-right: auto;
    width:65%;
    height:auto;
}
.mytext p{
    margin-left:30px;
    margin-bottom:10px;
    font-size:18px;
    color: #333;
    font-family: Source Sans Pro,Helvetica Neue,Helvetica,Arial,sans-serif;
}
.mytext h1{
    margin-top:0px;
    margin-left:20px;
    text-align:center;
    font-family: Source Sans Pro,Helvetica Neue,Helvetica,Arial,sans-serif;
}

</style>
