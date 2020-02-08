var database;
var canvas;
var capture;

var submitButton;
var changePageButton;

function preload(){
  // put preload code here
}

function setup() {
  //Firebase

  var firebaseConfig = {
      apiKey: "AIzaSyDRzxo_AJMjYQC75jb67nC006ayqVKuB1g",
      authDomain: "photo-mosaic-a57e8.firebaseapp.com",
      databaseURL: "https://photo-mosaic-a57e8.firebaseio.com",
      projectId: "photo-mosaic-a57e8",
      storageBucket: "photo-mosaic-a57e8.appspot.com",
      messagingSenderId: "176965774377",
      appId: "1:176965774377:web:d4739cd2e523076ef28038"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    database = firebase.database();

    var ref = database.ref('photos');
    ref.on('value', errData);

  //--END Firebase

  canvas = createCanvas(50,50);
  canvas.id('canvas');

  capture = createCapture(VIDEO);
  // capture.class
  capture.size(100, 100);
  capture.id('capture');

  imageMode(CENTER);

  submitButton = createButton('submit');
  submitButton.mousePressed(submitScore);

  changePageButton = createButton('View mosaic');
  changePageButton.mousePressed(changePage);

}

function draw() {
  stroke('black');
  noFill();
  rect(0,0,width, height);
}

function submitScore() {
  var pic = image(capture, width/2, height/2, 70, 50);

  var canvas = document.getElementById('canvas');
  var dataURL = canvas.toDataURL('image/png', 0.1);

  var data = {
    photo_img: dataURL
  }

  var ref = database.ref('photos');
  ref.push(data);
}

function errData(err) {
  console.log('Error');
  console.log(err)
}

function changePage() {
  window.open('index2.html', '_self');
}
