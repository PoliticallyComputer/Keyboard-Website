var dict = {C4:261.63, Csharp4:277.18, D4:293.66, Dsharp4:311.13, E4:329.23, F4:349.23,
    Fsharp4:369.99, G4:392.00, Gsharp4:415.30, A4:440.00, Asharp4:466.16, B4:493.88};

var keys = {s:"C4", e:"Csharp4", d:"D4", r:"Dsharp4", f:"E4", g:"F4", y:"Fsharp4", h:"G4", u:"Gsharp4", j:"A4", i:"Asharp4", k:"B4"};

var envs = {};

function setup() {
    var divs = document.getElementById("keys").getElementsByTagName("div");

    for(var i=0; i < divs.length; i++) {
        divs[i].style.cursor = 'hand';

        var env = new p5.Env(); //playable sound envelope
        env.setADSR(0.001, 0.25, 0.5, 0.5); //time until envelope reaches attack level,
                                            //...... decay level,
                                            //sustain,
                                            //duration of release time
        env.setRange(0.5, 0); //attack and release level (volume) when they are complete
        env.setExp(false); //kinda pointless but can easily replicate the pedal being pushed if false?? idek

        var wave = new p5.Oscillator('sine'); // wave going to be played
        wave.amp(env);
        wave.start();

        var divId = divs[i].id; //dict ids
        wave.freq(dict[divId]); //changed the actual ids to include 4 bc its easier for right now but can change back later
        envs[divId] = env;

        //mouse click on the div
        divs[i].onmousedown = function() {
            keyPressed(this.id);
            console.log(this.id);
        };


    }

    //keyboard key is "pressed". Will be used with mouse and computer keyboard
    function keyPressed(e) {
        envs[e].triggerAttack();
    }


    //Any key is pressed
    document.onkeypress = function() {
        myKeyPress(event);
    };

    document.onkeyup = function() {
        keyReleased();
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
        keyNote(key);
    }


    //Given a key, if it refers to a key on the board, do stuff
    function keyNote(key){
        if(key in keys){
            var note = keys[key];
            console.log(note);
            if(note in dict){
                keyPressed(note);
                document.getElementById(note).click();
            }
        }
    }


    // All the release functions independent of the div because they could of moved their mouse away before release
    //keyboard key is released. Will be used with mouse and computer keyboard
    function keyReleased() {
        for(var divId in envs){
            envs[divId].triggerRelease();
        }
    }
    //mouse release
    document.onmouseup = function() {
        keyReleased();
    };
}
