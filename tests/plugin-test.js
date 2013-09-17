var YUITest = require('yuitest'),
    A = YUITest.Assert,
    OA = YUITest.ObjectAssert,
    suite,
    YuiPlug = require('../plugin');


suite = new YUITest.TestSuite("group-test suite");

suite.add(new YUITest.TestCase({
    'name': 'plugin-test',

    'test instance properties': function () {
        var plug = new YuiPlug();

        A.isObject(plug);
        A.isObject(plug.describe);
        A.isString(plug.describe.summary);
        A.isObject(plug.describe.options);
        OA.areEqual(plug.describe.options, {});
    },

    'test buildThese default filter': function () {
        var name = 'bun',
            filelist = [
                'abc/def/ghi',
                'abc/def/ghi.js',
                'abc/loader-bun.js',
                __dirname + '/fixtures/app-module.js'
            ],
            plug = new YuiPlug(),
            expected = [__dirname + '/fixtures/app-module.js'],
            actual = Object.keys(plug.buildThese(name, filelist));

        OA.areEqual(actual, expected);
    }

}));

YUITest.TestRunner.add(suite);
