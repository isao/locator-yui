/*
 * Copyright 2013 Yahoo! Inc. All rights reserved.
 * Copyrights licensed under the BSD License.
 * See the accompanying LICENSE.txt file for terms.
 */

'use strict';

var shifter = require('shifter'),
    description = require('package.json').description,
    runctx = require('./run-context'),

    META_MOD_PREFIX = 'loader-',

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
    var buildlist = buildThese(evt.bundle.name, evt.files, this.describe.filter);

};

yp.buildThese = function (bundleName, filelist, usrfilter) {
    var metaname = META_MOD_PREFIX + bundleName + '.js',
        buildlist = [];

    function filter(file) {
        return file
            && file.slice(-3) !== '.js'
            && file.slice(-metaname.length) !== metaname
            && (usrFilter && usrFilter(file));
    }

    filelist.filter(filter).forEach(function (file) {
        var mod = runctx.checkYUIModule(file);
        if (mod) {
            this.parsed[file] = mod;
        }
    });
};



module.exports = YuiBuildPlugin;
