var dict = {C4:261.63, Csharp4:277.18, D4:293.66, Dsharp4:311.13, E4:329.23, F4:349.23,
    Fsharp4:369.99, G4:392.00, Gsharp4:415.30, A4:440.00, Asharp4:466.16, B4:493.88, 
	C5:523.25, Csharp5:554.37, D5:587.33, Dsharp5:622.25, E5:659.25, F5:698.46,
    Fsharp5:739.99, G5:783.99, Gsharp5:830.61, A5:880.00, Asharp5:932.33, B5:987.77};

var keys = {s:"C4", e:"Csharp4", d:"D4", r:"Dsharp4", f:"E4", g:"F4", y:"Fsharp4", h:"G4", u:"Gsharp4", j:"A4",
    i:"Asharp4", k:"B4"};

var pressed = [];

var envs = {};

var waves = [];

var divs;

var attack, decay, sustain, release, volume;

var attackSlide, decaySlide, sustainSlide, releaseSlide, volumeSlide;

var selectWave;

var waveType;


function setup() {

	// create sliders
	attackSlide = createSlider(0,5,0.25,0.1);
	attackSlide.position(10, 10);
	attackSlide.style('width', '200px');


	decaySlide = createSlider(0,1,0.25, 0.05);
	decaySlide.position(10, 30);
	decaySlide.style('width', '200px');


	sustainSlide = createSlider(0,1,0.5,0.1);
	sustainSlide.position(10, 50);
	sustainSlide.style('width', '200px');


	releaseSlide = createSlider(0,1,0.5,0.1);
	releaseSlide.position(10, 70);
	releaseSlide.style('width', '200px');

	volumeSlide = createSlider(0.000001,1,0.5,0.1);
	volumeSlide.position(10, 90);
	volumeSlide.style('width', '200px');

    // create select for wave type
    selectWave = createSelect();
    selectWave.option('sine');
    selectWave.option('triangle');
    selectWave.option('sawtooth');
    selectWave.option('square');


	divs = document.getElementById("keys").getElementsByTagName("div");

    for(var i=0; i < divs.length; i++) {
        divs[i].style.cursor = 'hand';

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

        var divId = divs[i].id; //dict ids
        wave.freq(dict[divId]); //changed the actual ids to include 4 bc its easier for right now but can change back later
        envs[divId] = env;
		
        console.log(divId);
		
        //mouse click on the div
        divs[i].onmousedown = function() {
            keyPress(this.id);
        };


		}
	}
	
	function draw(){
		attack = attackSlide.value();
		decay = decaySlide.value();
		sustain = sustainSlide.value();
		release = releaseSlide.value();
		
		volume = volumeSlide.value();
		
		for (var i = 0; i < divs.length; i++ ){
			envs[divs[i].id].setADSR(attack, decay, sustain, release);
			envs[divs[i].id].setRange(volume, 0);
			}

        waveType = selectWave.value();

        for (var j = 0; j < waves.length; j++) {
            waves[j].setType(waveType);
        }
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
    function myKeyPress(e){
        var keynum;
        if(window.event) { // IE
            keynum = e.keyCode;
        } else if(e.which){ // Netscape/Firefox/Opera
            keynum = e.which;
        }

        var key = String.fromCharCode(keynum);

        if((pressed.indexOf(key) == -1)) {
            console.log(key);
            console.log(!(key in pressed));
            console.log(pressed);
            keyNote(key);
        }
    }


    //Given a key, if it refers to a key on the board, do stuff
    function keyNote(key){
        if(key in keys){
            pressed.push(key);
            var note = keys[key];
            console.log(note);
            if(note in dict){
                keyPress(note);
                document.getElementById(note).focus();
            }
        }
    }


    // All the release functions independent of the div because they could of moved their mouse away before release
    //keyboard key is released. Will be used with mouse and computer keyboard
    function keyRelease(e) {
        var keynum;
        if(window.event) { // IE
            keynum = e.keyCode;
        } else if(e.which){ // Netscape/Firefox/Opera
            keynum = e.which;
        }

        var key = String.fromCharCode(keynum).toLowerCase();
        console.log(key);
        if (key in keys) {
            if(!(pressed.indexOf(key) == -1)) {
                var index = pressed.indexOf(key);
                pressed.splice(index, 1);
            }
            var note = keys[key];
            envs[note].triggerRelease();
        }
    }

    //mouse release
    document.onmouseup = function() {
        for(var divId in envs){
            envs[divId].triggerRelease();
            document.getElementById(divId).blur();
        }
    };
	
