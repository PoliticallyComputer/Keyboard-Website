var dict = {C4:261.63, Csharp4:277.18, D4:293.66, Dsharp4:311.13, E4:329.23, F4:349.23,
    Fsharp4:369.99, G4:392.00, Gsharp4:415.30, A4:440.00, Asharp4:466.16, B4:493.88};
var envs = {};

function setup() {
    var divs = document.getElementById("keys").getElementsByTagName("div");

    for(var i=0; i < divs.length; i++) {
        divs[i].style.cursor = 'hand';

        divs[i].onmousedown = function() {
            var env = new p5.Env();
            env.setADSR(0.001, 0.25, 0.5, 0.5);
            env.setRange(0.5, 0);

            var wave = new p5.Oscillator('triangle');
            wave.amp(env);
            wave.start();
            wave.freq(dict[this.id + "4"]);
            env.triggerAttack();
            envs[this.id] = env;
            console.log(this.id);
        };

        divs[i].onmouseup = function() {
            envs[this.id].triggerRelease();
        };
    }
}
