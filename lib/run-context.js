/*
 * Copyright 2013 Yahoo! Inc. All rights reserved.
 * Copyrights licensed under the BSD License.
 * See the accompanying LICENSE.txt file for terms.
 */

'use strict';

var vm = require('vm'),
    contextForRunInContext = vm.createContext({
        require: null,
        module: null,
        console: null,
        window: null,
        document: null
    });

/**
Analyze a javascript file, if it is a yui module, it extracts all the important
metadata associted with it. See express-yui/lib/shifter.js

@method _checkYUIModule
@protected
@param {string} file The filesystem path for the yui module to be analyzed
@return {object} The parsed and augmented metadata from the yui module
**/
function checkYUIModule(file) {
    var mod;

    contextForRunInContext.YUI = {
        add: function (name, fn, version, config) {
            if (!mod) {
                mod = {
                    name: name,
                    buildfile: file,
                    builds: {}
                };
            }
            mod.builds[name] = {
                name: name,
                config: config || {}
            };
            // detecting affinity from the filename
            if (file.indexOf('.server.js') === file.length - 10) {
                mod.builds[name].config.affinity = 'server';
            }
            if (file.indexOf('.client.js') === file.length - 10) {
                mod.builds[name].config.affinity = 'client';
            }
        }
    };
    try {
        vm.runInContext(libfs.readFileSync(file, 'utf8'), contextForRunInContext, file);
    } catch (e) {
        return;
    }
    return mod;
}


module.exports = {
    checkYUIModule: checkYUIModule
};
