var dict = {
  C4: 261.63,
  Csharp4: 277.18,
  D4: 293.66,
  Dsharp4: 311.13,
  E4: 329.23,
  F4: 349.23,
  Fsharp4: 369.99,
  G4: 392.00,
  Gsharp4: 415.30,
  A4: 440.00,
  Asharp4: 466.16,
  B4: 493.88,
  C5: 523.25,
  Csharp5: 554.37,
  D5: 587.33,
  Dsharp5: 622.25,
  E5: 659.25,
  F5: 698.46,
  Fsharp5: 739.99,
  G5: 783.99,
  Gsharp5: 830.61,
  A5: 880.00,
  Asharp5: 932.33,
  B5: 987.77
};

var keys = {
  s: "C4",
  e: "Csharp4",
  d: "D4",
  r: "Dsharp4",
  f: "E4",
  g: "F4",
  y: "Fsharp4",
  h: "G4",
  u: "Gsharp4",
  j: "A4",
  i: "Asharp4",
  k: "B4"
};

var pressed = [];

var envs = {};

var waves = [];

var amps = [];

var divs;

var attack, decay, sustain, release, volume;

var attackSlide, decaySlide, sustainSlide, releaseSlide, volumeSlide;

var selectWave;

var waveType;

var attackBlack, decayBlack, sustainBlack, releaseBlack;



function setup() {

  // create sliders

  var attackOutline = document.getElementById("attackOutline");
  var rectAtt = attackOutline.getBoundingClientRect();
  attackBlack = document.getElementById("attackBlack");

  attackSlide = createSlider(0, 5, 0.25, 0.1);
  attackSlide.position(rectAtt.left - 12, rectAtt.top);
  attackSlide.style('width', (attackOutline.clientWidth + 5) + "px");
  attackSlide.style('height', (attackOutline.clientHeight + 1) + "px");
  attackSlide.style('opacity', '0');
  attackSlide.style('cursor', 'pointer');



  var decayOutline = document.getElementById("decayOutline");
  var rectDec = decayOutline.getBoundingClientRect();
  decayBlack = document.getElementById("decayBlack");

  decaySlide = createSlider(0, 1, 0.25, 0.05);
  decaySlide.position(rectDec.left - 12, rectDec.top);
  decaySlide.style('width', (decayOutline.clientWidth + 5) + "px");
  decaySlide.style('height', (decayOutline.clientHeight + 1) + "px");
  decaySlide.style('opacity', '0');
  decaySlide.style('cursor', 'pointer');


  var sustainOutline = document.getElementById("sustainOutline");
  var rectSus = sustainOutline.getBoundingClientRect();
  sustainBlack = document.getElementById("sustainBlack");

  sustainSlide = createSlider(0, 1, 0.5, 0.1);
  sustainSlide.position(rectSus.left - 12, rectSus.top);
  sustainSlide.style('width', (sustainOutline.clientWidth + 5) + "px");
  sustainSlide.style('height', (sustainOutline.clientHeight + 1) + "px");
  sustainSlide.style('opacity', '0');
  sustainSlide.style('cursor', 'pointer');



  var releaseOutline = document.getElementById("releaseOutline");
  var rectRel = releaseOutline.getBoundingClientRect();
  releaseBlack = document.getElementById("releaseBlack");

  releaseSlide = createSlider(0, 1, 0.5, 0.1);
  releaseSlide.position(rectRel.left - 12, rectRel.top);
  releaseSlide.style('width', (releaseOutline.clientWidth + 5) + "px");
  releaseSlide.style('height', (releaseOutline.clientHeight + 1) + "px");
  releaseSlide.style('opacity', '0');
  releaseSlide.style('cursor', 'pointer');


  var volumeOutline = document.getElementById("volumeOutline");
  var rectVol = volumeOutline.getBoundingClientRect();
  volumeBlack = document.getElementById("volumeBlack");



  volumeSlide = createSlider(0.1, 1, 0.5, 0.1);
  volumeSlide.position(rectVol.left - 12, rectVol.top);

  volumeSlide.style('width', (volumeOutline.clientWidth + 5) + "px");
  volumeSlide.style('height', (volumeOutline.clientHeight + 1) + "px");
  volumeSlide.style('opacity', '0');
  volumeSlide.style('cursor', 'pointer');

  // create select for wave type
  selectWave = createSelect();
  // selectWave.option('sine');
  selectWave.option('triangle');
  selectWave.option('sawtooth');
  selectWave.option('square');


  divs = document.getElementById("keys").getElementsByTagName("div");

  for (var i = 0; i < divs.length; i++) {
    divs[i].style.cursor = 'pointer';

    var env = new p5.Env(); //playable sound envelope
    env.setADSR(attack, decay, sustain, release); //time until envelope reaches attack level,
    //...... decay level,
    //sustain,
    //duration of release time
    env.setRange(volume, 0); //attack and release level (volume) when they are complete
    /* env.setExp(false); //kinda pointless but can easily replicate the pedal being pushed if false?? idek */

    var wave = new p5.Oscillator('sine'); // wave going to be played
    wave.amp(env);
    wave.start();
    waves.push(wave);

    var amp = new p5.Amplitude();
    amp.setInput(env);
    amps.push(amp);

    var divId = divs[i].id; //dict ids
    wave.freq(dict[divId]); //changed the actual ids to include 4 bc its easier for right now but can change back later
    envs[divId] = env;

    //mouse click on the div
    divs[i].onmousedown = function() {
      keyPress(this.id);
    };


  }
}

function draw() {
  attack = attackSlide.value();
  decay = decaySlide.value();
  sustain = sustainSlide.value();
  release = releaseSlide.value();
  volume = volumeSlide.value();

  waveType = selectWave.value();

  for (var i = 0; i < divs.length; i++) {
    envs[divs[i].id].setADSR(attack, decay, sustain, release);
    envs[divs[i].id].setRange(volume, 0);
    waves[i].setType(waveType);
    var level = amps[i].getLevel();
    var color;
    if (divs[i].className == 'black-key') {
      color = 255 - Math.round(map(level, 0, 1, 0, 255));
    } else {
      color = Math.round(map(level, 0, 1, 0, 255));
    }
    divs[i].style.backgroundColor = "rgb(" + color + "," + color + "," + color +
      ")";
  }


  var attackMap = map(attack, 0, 5, 0, attackSlide.elt.style.width.slice(0, -2));
  attackBlack.style.clip = "rect(0, " + attackMap + "px, " + attackSlide.elt.style
    .height + ", 0)";

  var sustainMap = map(sustain, 0, 1, 0, sustainSlide.elt.style.width.slice(0, -
    2));
  sustainBlack.style.clip = "rect(0, " + sustainMap + "px, " + sustainSlide.elt
    .style.height + ", 0)";

  var decayMap = map(decay, 0, 1, 0, decaySlide.elt.style.width.slice(0, -2));
  decayBlack.style.clip = "rect(0, " + decayMap + "px, " + decaySlide.elt.style
    .height + ", 0)";

  var releaseMap = map(release, 0, 1, 0, releaseSlide.elt.style.width.slice(0, -
    2));
  releaseBlack.style.clip = "rect(0, " + releaseMap + "px, " + releaseSlide.elt
    .style.height + ", 0)";

  var volumeMap = map(volume, 0, 1, 0, volumeSlide.elt.style.width.slice(0, -2));
  volumeBlack.style.clip = "rect(0, " + volumeMap + "px, " + volumeSlide.elt.style
    .height + ", 0)";
}

//keyboard key is "pressed". Will be used with mouse and computer keyboard
function keyPress(e) {
  envs[e].triggerAttack();
}


//Any key is pressed
document.onkeypress = function(event) {
  myKeyPress(event);
};

document.onkeyup = function(event) {
  keyRelease(event);
};

//returns which key was pressed
function myKeyPress(e) {
  var keynum;
  if (window.event) { // IE
    keynum = e.keyCode;
  } else if (e.which) { // Netscape/Firefox/Opera
    keynum = e.which;
  }

  var key = String.fromCharCode(keynum);

  if ((pressed.indexOf(key) == -1)) {
    keyNote(key);
  }
}


//Given a key, if it refers to a key on the board, do stuff
function keyNote(key) {
  if (key in keys) {
    pressed.push(key);
    var note = keys[key];
    if (note in dict) {
      keyPress(note);
      document.getElementById(note).focus();
    }
  }
}


// All the release functions independent of the div because they could of moved their mouse away before release
//keyboard key is released. Will be used with mouse and computer keyboard
function keyRelease(e) {
  var keynum;
  if (window.event) { // IE
    keynum = e.keyCode;
  } else if (e.which) { // Netscape/Firefox/Opera
    keynum = e.which;
  }

  var key = String.fromCharCode(keynum).toLowerCase();
  if (key in keys) {
    if (!(pressed.indexOf(key) == -1)) {
      var index = pressed.indexOf(key);
      pressed.splice(index, 1);
    }
    var note = keys[key];
    envs[note].triggerRelease();
  }
}

//mouse release
document.onmouseup = function() {
  for (var divId in envs) {
    envs[divId].triggerRelease();
    document.getElementById(divId).blur();
  }
};
