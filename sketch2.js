var imgAmount = 140;

var cover;

var smaller;

var scl = 35;

var w, h;

var allImages = [];

var hueValues = [];
var satValues = [];
var brgValues = [];

//hue values needed
var maxHueValue = 360;
//store image for increasing hue value
var hueImages = [];
//we need an image for each possible Hue value
hueImages.length = maxHueValue;

//Firebase
var database;
//END Firebase
var counter = 0;


////////////////////////////////////

function preload() {
  //load cover
  cover = loadImage('assets/cover7-1.jpg');

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
  ref.once('value', gotData, errData);

  //--END Firebase

}


function gotData(data) {
  console.log('gotData starting');
  var photolistings = selectAll('photolisting');

  for (let i = 0; i < photolistings.length; i++) {
    photolistings[i].remove();
  }

  var photos = data.val();
  var keys = Object.keys(photos);
  console.log('numero di foto caricate = ' + keys.length);

  for (let j = 0; j < keys.length; j++) {
    let k = keys[j];
    let photo_img = photos[k].photo_img;
    //load tiles for the mosaic
    allImages[j] = loadImage(photo_img);
  }

  console.log('gotData ending');
  console.log(allImages);
}

function errData(err) {
  console.log('Error');
  console.log(err);
}

//------------------------------------------------------------------------------

function setup() {
  createCanvas(cover.width, cover.height);

  w = cover.width / scl;
  h = cover.height / scl;
  smaller = createImage(w, h);
  smaller.copy(cover, 0, 0, cover.width, cover.height, 0, 0, w, h);

}

//------------------------------------------------------------------------------
function draw() {
  counter++;
  if (counter < 300) {
    console.log(counter);
  }
  if (counter == 300) {
    findImageHue();
  }
}

function drawMosaic() {

  console.log(hueValues);
  // image(cover, 0, 0);
  // image(smaller, 0, 0);
  var fotoUsate = 0;


  smaller.loadPixels();
  for (var x = 0; x < w; x++) {
    for (var y = 0; y < h; y++) {
      // var index = x + y *w;


      var tempC = smaller.get(x, y);

      push();

      var tempH = int(hue(tempC));
      var tempS = int(saturation(tempC) / 10);
      var tempB = int(brightness(tempC) / 10);

      // var pixelB = [];
      // pixelB.push(tempB);
      // console.log('pixelB   ' + pixelB);
      //
      // var pixelS = [];
      // pixelS.push(tempS);
      // console.log('pixelS   ' + pixelS);




      let record = maxHueValue + 1;
      let recordSat = 11;


      for (i = 0; i < allImages.length; i++) {

        if (tempB == brgValues[i]) {
          // let diffSat = abs(tempS - satValues[i]);
          //
          // if (diffSat < recordSat) {

          // if (tempS == satValues[i]) {
            let diff = abs(tempH - hueValues[i]);

            if (diff < record) {
              record = diff;
              image(allImages[i], x * scl, y * scl, scl, scl);
              allImages.splice(i, 1);
              brgValues.splice(i, 1);
              hueValues.splice(i, 1);
              satValues.splice(i, 1);

              fotoUsate++;
              console.log('foto usate = '+fotoUsate);


            // }
          }
        }
      }
    }
  }


  noLoop();

}

//------------------------------------------------------------------------------

//for each image available...
function findImageHue() {
  for (let i = 0; i < allImages.length; i++) {
    allImages[i].loadPixels();

    var rSum = 0;
    var gSum = 0;
    var bSum = 0;
    var r, g, b;
    var c;

    //...sum the r,g,b values of each pixel...
    for (let x = 0; x < allImages[i].width; x++) {
      for (let y = 0; y < allImages[i].height; y++) {
        c = allImages[i].get(x, y);
        rSum += c[0];
        gSum += c[1];
        bSum += c[2];
      }
    }

    //...then divide for the number of pixels that compose the image to find the average r,g,b values...
    var pixNumber = allImages[i].pixels.length / 4;
    r = floor(rSum / pixNumber);
    g = floor(gSum / pixNumber);
    b = floor(bSum / pixNumber);

    //...and find the hue ov the average color of the image...
    var avgRGB = color(r, g, b);
    push();
    colorMode(HSB, 360, 100, 100, 1);
    var avgHue = floor(hue(avgRGB));
    var avgSat = ceil(saturation(avgRGB) / 10);
    var avgBrg = floor(brightness(avgRGB) / 10);
    pop();

    //...and store the average hue value of each image in an array

    hueValues[i] = avgHue;
    satValues[i] = avgSat;
    brgValues[i] = avgBrg;

    console.log('immagine '+i);
    console.log('brightness '+avgBrg);
    console.log('saturation '+avgSat);




    // console.log(avgHue);
    // console.log(hueValues);
  }

  // Find the closest image for each brightness value
  for (i = 0; i < hueImages.length; i++) {
    let record = maxHueValue + 1;
    for (j = 0; j < hueValues.length; j++) {
      let diff = abs(i - hueValues[j]);
      if (diff < record) {
        record = diff;
        hueImages[i] = allImages[j];
      }
    }
  }

  drawMosaic();
}
