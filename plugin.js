/*
 * Copyright 2013 Yahoo! Inc. All rights reserved.
 * Copyrights licensed under the BSD License.
 * See the accompanying LICENSE.txt file for terms.
 */

'use strict';

var shifter = require('shifter'),
    description = require('package.json').description;

function YuiBuildPlugin(config) {

    if (!(this instanceof YuiBuildPlugin)) {
        return new YuiBuildPlugin(config); // in case "new" was not used
    }

    this.describe = {
        summary: description,
        options: config || {} // todo define & document defaults, mixin here
    };
}

YuiBuildPlugin.prototype.bundleUpdated = function (evt, api) {
    
}

module.exports = YuiBuildPlugin;

// add yui namespace; i.e. var plug = require('').yui
// bad idea, or BC?
module.exports.YuiBuildPlugin.yui = YuiBuildPlugin;
