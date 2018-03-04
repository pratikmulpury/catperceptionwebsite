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
// connect Firebase to Vue
Vue.use(VueFire);
// app Vue instance
var app = new Vue({
    // app initial state
    data: {
        // user entered data, managed locally before adding to database
        newImageTitle: ''
    },

    // local representations of firebase data
    firebase: {
        var i, cluster;
        for (i = 0; i < usersRef.cluster.length; i++)
        {
            cluster = usersRef.cluster[i];
        }
    },

    computed: {
        // get images in reverse order added
        reversedImages () {
            return this.images.slice().reverse();
        }
    },

    methods: {
        // get image selected by user and upload it to Firebase for storage
        storeImage () {
            // get input element user used to select local image
            var input = document.getElementById('files');
            // have all fields in the form been completed
            if (this.newImageTitle && input.files.length > 0) {
                var file = input.files[0];
                // get reference to a storage location and
                storageRef.child('images/' + file.name)
                          .put(file)
                          .then(snapshot => this.addImage(this.newImageTitle, snapshot.downloadURL));
                // reset input values so user knows to input new data
                input.value = '';
            }
        },

        addImage (title, url) {
            // now that image has been stored in Firebase, create a reference to it in database
            imagesRef.push({
                title: title,
                url: url
            });
            // reset input values so user knows to input new data
            this.newImageTitle = '';
        },

        removeImage (img) {
            if (confirm('Are you sure you want to remove this image?')) {
                // remove the database entry for the image
                imagesRef.child(img['.key']).remove();
                // remove the image in shared storage as well
                var path = new URL(img.url).pathname.split(/\/|%2F/).slice(-2).join('/');
                storageRef.child(path)
                          .delete()
                          .then(() => console.log('Image deleted'))
                          .catch(err => console.log(err));
            }
        }
    }
});


// mount Vue app within specific HTML element
app.$mount('#app')
