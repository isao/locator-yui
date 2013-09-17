#!/usr/bin/env node

var shifter = require('shifter'),
    filelist = process.argv.slice(3),
    options = {
        'build-dir': process.argv[2],
        'coverage': false,
        'global-config': false,
        'lint': false
    };

function shiftFiles(filelist, cb) {
    var count = filelist.length;

    filelist.forEach(function (file) {
        options['yui-module'] = file;
        shifter.init(options, function isDone(err, result) {
            if (!--count) cb(err, result);
        });
    });
}

console.time('shift ' + filelist.length);
shiftFiles(filelist, function (err, result) {
    console.log('finito', err, result);
    console.timeEnd('shift ' + filelist.length)    
});


// % node ./lib/shifter-exec.js ~/Desktop/build tests/fixtures/{app-module,metas,pure-metas}.js
// shifter [info] revving up
// shifter [info] looking for app-module.js file
// shifter [info] revving up
// shifter [info] looking for metas.js file
// shifter [info] revving up
// shifter [info] looking for pure-metas.js file
// shifter [info] found app-module.js file, shifting
// shifter [info] putting the hammer down
// shifter [info] shifting into gear for app-module
// shifter [warn] skipping jshint, you better be linting your stuff with something!
// shifter [info] found metas.js file, shifting
// shifter [info] putting the hammer down
// shifter [info] shifting into gear for metas
// shifter [warn] skipping jshint, you better be linting your stuff with something!
// shifter [info] found pure-metas.js file, shifting
// shifter [info] putting the hammer down
// shifter [info] shifting into gear for metas
// shifter [warn] skipping jshint, you better be linting your stuff with something!
// shifter [queu] file has changed, continuing build
// shifter [queu] file has changed, continuing build
// shifter [queu] writing RAW file
// shifter [queu] writing RAW file
// shifter [queu] writing RAW file
// shifter [queu] compressing metas/metas.js with UglifyJS
// shifter [queu] writing -min file
// shifter [queu] compressing metas/metas.js with UglifyJS
// shifter [queu] writing -min file
// shifter [queu] compressing app-module/app-module.js with UglifyJS
// shifter [queu] writing -min file
// shifter [warn] skipping coverage file from config
// shifter [info] done racing, the gears are toast
// shifter [info] finished in 0.043 seconds, pretty fast huh?
// shifter [warn] skipping coverage file from config
// shifter [info] done racing, the gears are toast
// shifter [info] finished in 0.041 seconds, pretty fast huh?
// shifter [warn] skipping coverage file from config
// shifter [info] done racing, the gears are toast
// shifter [info] finished in 0.047 seconds, pretty fast huh?
// finito undefined undefined
// shift3: 324ms
