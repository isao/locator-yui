/*
 * Copyright 2013 Yahoo! Inc. All rights reserved.
 * Copyrights licensed under the BSD License.
 * See the accompanying LICENSE.txt file for terms.
 */

'use strict';

var shifter = require('shifter'),
    description = require('package.json').description,
    runctx = require('./run-context'),
    yp; // shortcut for YuiBuildPlugin.prototype




/**
@param {object}
@constructor
*/
function YuiBuildPlugin(config) {
    if (!(this instanceof YuiBuildPlugin)) {
        return new YuiBuildPlugin(config); // in case "new" was not used
    }

    // map of pathname -> javascript require'd
    this.parsed = {};
    
    // map of module name -> pathname
    this.modules = {};

    this.describe = {
        summary: description,
        options: config || {} // todo define & document defaults, mixin here
    };

    // if (!this.describe.filter) {
    //     this.describe.filter = function() { return true };
    // }
}

yp = YuiBuildPlugin.prototype;

yp.bundleUpdated = function (evt, api) {
    var buildlist = buildThese(evt.files, this.describe.filter);
    
};

yp.buildThese = function (filelist, filter) {
    var buildlist = [];

    filelist.forEach(function (file) {
        var mod;
        if (!filter || filter(file)) {
            mod = runctx.checkYUIModule(file);
        }
    });
};



module.exports = YuiBuildPlugin;
