/*
 * Copyright 2013 Yahoo! Inc. All rights reserved.
 * Copyrights licensed under the BSD License.
 * See the accompanying LICENSE.txt file for terms.
 */

'use strict';

var path = require('path'),
    groups = require('./groups'),
    hashdirs = require('hashsome').hashdirs,

    // express-yui meta-module naming conventions
    PREFIX = 'loader-',
    SUFFIX = '.js';


function prefix(left) {
    return function(right) { return left + right; }; // to use with Array.map
}

/**
 * parse the loader configs and return an array of module name strings
 * @param {string} modpath Full path to a "meta-module" .js file
 * @return {array} Array of module name strings
 */
function getModules(modpath) {
    var groupmeta = groups.getGroupConfig(modpath);
    return groupmeta && groupmeta.modules && Object.keys(groupmeta.modules);
}

/**
 * Construct a relative path of the meta-module created by express-yui if
 * evt.bundle.yuiBuildDirectory is set (by express-yui). Follows convention:
 *   <yui build dir>/<bundle build dir>/loader-<bundle name>.js
 * @param {object} bundle
 * @param {string} yuibuild Full path to the build directory that express-yui
 * tells shifter to use.
 * @return {string|undefined} Relative path to the meta-module file, to use to
 * match against the bundle's file property.
 */
function getMetaModule(name, base, yuibuild) {
    var fullpath, relpath;
    // this yuibuild is only set by express-yui, not locator
    if (base && name && yuibuild) {
        fullpath = path.join(yuibuild, name);
        relpath = path.relative(base, fullpath);
    }
    return relpath; // e.g. "build/demo/loader-demo.js"
}

/**
 * Locator plugin observer, called after locator scan and every time a plugin
 * triggers a bundle update. Do nothing unless yuiBuildDirectory is set, a valid
 * meta module is in evt.files, and loader module configs can be extracted from
 * it. If all these conditions exist, use the module configs to hash and rename
 * the module directories by passing their paths to hashdirs (paths constructed
 * by the shifter convention <yuibuild>/<module name>).
 * @param {object} Locator "event" object
 * @param {object} Locator api object
 * @return {Promise|undefined}
 */
function bundleUpdated(evt, api) {
    var write = api.writeFileInBundle,              // shortcut
        yuibuild = evt.bundle.yuiBuildDirectory,    // only set by express-yui
        base = evt.bundle.baseDirectory,            // full path to app dir
        name = PREFIX + evt.bundle.name + SUFFIX,   // e.g. "loader-demo.js"
        key = getMetaModule(name, base, yuibuild),  // see getMetaModule()
        meta = evt.files[key];                      // must exist in evt.files

    return key && meta && api.promise(function rename(resolve, reject) {
        var dirs = getModules(meta.fullPath).map(prefix(yuibuild + path.sep));

        function afterHash(err, results) {
            var file = name + 'on',                 // e.g. "loader-demo.json"
                json;

            if (err) {
                reject(err);

            } else {
                json = JSON.stringify(results, null, 2);

                // this makes locator call bundleUpdated on all plugins again
                write(evt.bundle.name, file, json).then(resolve);
            }
        }

        hashdirs(dirs, afterHash);                  // rename module dirs w/md5
    });
}

// locator plugin api
module.exports = {
    describe: {summary: require('../package.json').description},
    bundleUpdated: bundleUpdated
};
