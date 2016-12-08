var dict = {C4:261.63, Csharp4:277.18, D4:293.66, Dsharp4:311.13, E4:329.23, F4:349.23,
    Fsharp4:369.99, G4:392.00, Gsharp4:415.30, A4:440.00, Asharp4:466.16, B4:493.88};
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
		wave.freq(dict[divId + "4"]);
		envs[divId] = env;			
		
        divs[i].onmousedown = function() {
            envs[this.id].triggerAttack();
            console.log(this.id);
        };

        divs[i].onmouseup = function() {
            envs[this.id].triggerRelease();
			console.log(this.id);
        };
    }
}
