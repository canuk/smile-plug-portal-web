/* Jakefile for Build Process
 Noah Freedman

 Requirements:
 compass:
 $ gem update --system
 $ gem install compass
 */
minify = require('minify');

var util = require('util'),
    jakeutils = require('jakeutils'),
    fs = require('fs'),
    _ = require('underscore'),
    jake = require('./node_modules/jakeutils/node_modules/jake'),
    ensureDir = require('ensureDir'),
    rmdir = require('rmdir'),
    sys = require('util'),
    exec = require('child_process').exec,
    wrench = require('wrench'),
    compressor = require('node-minify');

var src = "./src/";
var target = "./target/";
var tmp = "./tmp/"
var jsDir = "js/";
var assetsDir = "assets/";
var cssDir = "css/";
var jslib = jsDir + "smile_access.js";
var jslib_min = jsDir + "smile_access.min.js";
var mapPath = "smilem.js.map";
var indexFile = "index.html";
var cssFile = "smile-access-panel.css";
var cssFile_min = "smile-access-panel.min.css";
var csslib = assetsDir + cssDir + cssFile;
var license = '//License Info...';
var footer = "// Copyright 2013 SMILE Consortium";
var remote = "root@smilenet:/www/smilem";
var weinre = "<script src='http://smileglobal.net:8081/target/target-script-min.js#anonymous'></script>";

var js_names, stylesheet_names; //used by preprocess, minify_js, and minify_css
var debug = false; //(deprecated) if set to true, then does a build that retain's logger
var deploy = false; //(deprecated) if set to true, then will build with settings for deployment to remote_url

desc("Builds production build");
task('build', {async: true}, function () {
    var start = new Date();
    log("Build Start ", 1);
    jake.Task['clean'].execute();
    jake.Task['preprocess'].execute();
    jake.Task['minify_js'].execute();
    jake.Task['gen_index'].execute();
    jake.Task['copy_assets_tmp'].execute();
    jake.Task['generate_target_css'].execute();
    jake.Task['copy_assets_target'].execute();
    jake.Task.concatenate_css.addListener('complete', function () {
        jake.Task['delete_tmp_files'].execute();
        var elapsed = (new Date() - start) / 1000; //milliseconds to seconds
        elapsed = elapsed.toFixed(3);
        log("Build Complete: " + elapsed + "s", 1);
        if (deploy) {
            jake.Task.deploy.addListener('complete', function () {
                complete();
            });
            jake.Task.deploy.execute();
        }
    });
    jake.Task.concatenate_css.invoke();
});

desc("Uploads /target to remote");
task('deploy', {async: true}, function () {
    var start = new Date();
    var regex = /[a-zA-Z].*/i;
    var tar = regex.exec(target)[0] + "*";
    log("Uploading " + target + " to " + remote, 6);
    var cmd = "scp -r " + tar + " " + remote;
    console.log(cmd);
    exec(cmd, function (error, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        if (error !== null) {
            console.log('exec error: ' + error);
        }
        var elapsed = (new Date() - start) / 1000; //milliseconds to seconds
        elapsed = elapsed.toFixed(3);
        log("Upload Complete: " + elapsed + "s", 6);
        complete();
    });
});

desc("Deletes directory structure and re-creates it");
task('clean', function () {
    log("Cleaning " + target, 4);
    jake.Task['deleteTarget'].execute();
    jake.Task['createDirs'].execute();
    end();
});

desc('Creates target directories');
task('createDirs', function () {
    wrench.mkdirSyncRecursive(target + jsDir, 0777);
    wrench.mkdirSyncRecursive(tmp, 0777);
    end();
});
desc('Delete target directories');
task('deleteTarget', function () {
    wrench.rmdirSyncRecursive('target', function (error) {
        console.log(error);
    });
    wrench.rmdirSyncRecursive('tmp', function (error) {
        console.log(error);
    });
    end();
});
desc('Delete /tmp directory');
task('delete_tmp_files', function () {
    wrench.rmdirSyncRecursive('tmp', function (error) {
        console.log(error);
    });
    end();
});

desc("Preprocesses all javascript source files and saves result to target");
task('preprocess', function () {
    log("Preprocessing Javascript Source Files", 4);
    //get all js files from source
    var index = fs.readFileSync(src + indexFile);
    console.log(color("\nExtracting script file names from: src/" + indexFile, 2));
    var scriptLibRegex = /<!-- Production Scripts: START -->([\s\S]*?)<!-- Production Scripts: END -->/;
    var scripts = scriptLibRegex.exec(index)[1];
    var regexScriptName = /<script src=["|'](.*?)["|']><\/script>/g;
    //script names
    js_names = []; //used by minify as well
    console.log(color("Removing DEV statements and adding PRO statements: " + target + jslib, 2));
    var match;
    var scriptNames = [];
    if (debug) {
        while ((match = regexScriptName.exec(debugScripts)) !== null) {
            var script = "" + match[1];
            scriptNames.push(script);
        }
    }
    while ((match = regexScriptName.exec(scripts)) !== null) {
        var script = "" + match[1];
        scriptNames.push(script);
    }
    for (var i = 0; i < scriptNames.length; i++) {
        var script = scriptNames[i];
        console.log(color(" « ", 3, false) + color(src + script, 3, true) + color(" » ", 3, false));
        var file = fs.readFileSync(src + script);
        js_names.push(tmp + script);

        var parsed = buildParse(file, debug);
        if (script.lastIndexOf('/') !== -1) {
            var dir = script.substring(0, script.lastIndexOf('/'));
            if (!fs.existsSync(tmp + dir)) {
                console.log(color("Created directory « " + tmp + dir + " »", 6, true));
                wrench.mkdirSyncRecursive(tmp + dir, 0777);
            }
        }
        fs.writeFileSync(tmp + script, parsed);
    }

    end();
});

desc("Minify the js library");
task('minify_js', ['preprocess'], function () {
    start("Minify JS Library: " + target + jslib + " ==> " + target + jslib_min);

    var result = minify({
        src: js_names,
        dest: target + jslib_min,       // optional
        options: {
            sourceRoot: "smilem.js",
            outSourceMap: mapPath
        },                          // uglify-js options. optional
        header: license,  // optional
        separator: '\n',                      // optional
        footer: footer               // optional
    });

    //save source map
    if (debug) {
        console.log(color("Saving source map: " + target + jsDir + mapPath, 2));
        fs.writeFileSync(target + jsDir + mapPath, result.map);
        console.log(color("Injecting source map into: " + target + jslib_min, 2));
        var mapHeader = "\n//@ sourceMappingURL=" + mapPath;
        var minCode = "" + fs.readFileSync(target + jslib_min);
        fs.writeFileSync(target + jslib_min, minCode + mapHeader);
    }

    end();
});

desc("Generates index, concatenating all templates.");
task('gen_index', function () {
    log("Generating " + target + indexFile, 4);
    var filelist = new jake.FileList();
    filelist.include([src + "templates/**"]);
    var filenames = filelist.toArray();

    var templates = "";
    var index = "" + fs.readFileSync(src + indexFile) + "\n";
    console.log(color("Concatenating templates", 2));
    _.each(filenames, function (el) {
        templates += "<script id='" + el.match(/.*\/(.+)\.html/)[1] + "-template' type='text/template'>\n"
        var file = "";
        _.each((fs.readFileSync(el) + "").split("\n"), function (el) {
            file += "\t" + el + "\n" || "";
        });
        templates += file;
        templates += "</script>\n";
    });
    console.log(color("Injecting production scripts: " + jslib, 2));
    //add templates to index, inject script and css production files
    var script = "\n<script src='" + jslib_min + "'></script>\n";
    var script_loc = "<!--PRODUCTION SCRIPTS HERE-->";
    var template_loc = "<!--TEMPLATES HERE-->";
    var weinre_loc = "<!--WEINRE HERE-->";
    var css = "\n<link rel=\"stylesheet\" href=\"" + csslib + "\"/>";
    var css_loc = "<!--PRODUCTION CSS HERE-->";
    var output = index.replace(script_loc, script).replace(template_loc, templates).replace(css_loc, css);
    if (debug) {
        console.log(color("Injecting weinre server: " + weinre, 2));
        output = output.replace(weinre_loc, weinre);
    } else {
        output = output.replace(weinre_loc, "");
    }
    console.log(color("Removing DEV statements and adding PRO statements: " + indexFile, 2));
    output = buildParse(output, debug);
    console.log(color("Removing whitespace and comments", 2));
    //remove linebreaks and concurrent whitespace chars
    //output = output.replace(/[\s\n\r]+/g, " ");
    //remove comments regex (Note, not foolproof, will also remove comments from strings
    //output = output.replace(/<!--[\s\S]*?-->/g, "");

    fs.writeFileSync(target + indexFile, output);

    end();
});

desc('Compile SASS and compass');
task('compass', {async: true}, function () {
    log("Compiling SASS", 4);
    var cmd = "compass compile --no-line-comments --trace --time --sass-dir "
        + src + "sass --images-dir " + src + "img --css-dir " + target + "css";
    exec(cmd, function (error, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        if (error !== null) {
            console.log('exec error: ' + error);
        }
        complete();
    });
});

desc('Copy assets from src to tmp');
task('copy_assets_tmp', function () {
    log("Copying assets: " + src + assetsDir + " ==> " + tmp + assetsDir, 4);
    wrench.copyDirSyncRecursive(src + assetsDir, tmp + assetsDir, { forceDelete: true });
    complete();
});
desc('Copy assets from src to target');
task('copy_assets_target', function () {
    log("Copying assets: " + tmp + assetsDir + " ==> " + target + assetsDir, 4);
    wrench.copyDirSyncRecursive(tmp + assetsDir, target + assetsDir, { forceDelete: true });
    complete();
});


desc('Make target css file');
task('generate_target_css', function () {
    log("Generate target css file");
    //get all production css files from source
    var index = fs.readFileSync(src + indexFile);
    console.log(color("\nExtracting css file names from: src/" + indexFile, 2));
    var cssLibRegex = /<!-- Production Css: START -->([\s\S]*?)<!-- Production Css: END -->/;
    var stylesheets = cssLibRegex.exec(index)[1];
    var regexCssName = /<link rel=["|']stylesheet["|'] href=["|'](.*?)["|'] \/>/g;
    //css names
    console.log(color("Removing DEV statements and adding PRO statements: " + tmp + assetsDir + cssDir, 2));
    var match;
    stylesheet_names = [];
    var cssNames = [];
    var prodCss = "";
    while ((match = regexCssName.exec(stylesheets)) !== null) {
        var stylesheet = "" + match[1];
        stylesheet_names.push(target + stylesheet);
        console.log(tmp + stylesheet);
    }
    /*
    for (var i = 0; i < cssNames.length; i++) {
        var stylesheet = cssNames[i];
        console.log(color(" « ", 3, false) + color(src + stylesheet, 3, true) + color(" » ", 3, false));
        var file = fs.readFileSync(src + stylesheet);
        file = file + "";
        prodCss += file;
        if (stylesheet.lastIndexOf('/') !== -1) {
            var dir = stylesheet.substring(0, stylesheet.lastIndexOf('/'));
            if (!fs.existsSync(tmp + dir)) {
                console.log(color("Created directory « " + tmp + dir + " »", 6, true));
                wrench.mkdirSyncRecursive(tmp + dir, 0777);
            }
        }
        fs.unlinkSync(tmp + stylesheet, file);
    }
    */
    //fs.writeFileSync(tmp + assetsDir + cssDir + cssFile, prodCss);

    complete();
});
//TODO: Add minification
desc("Concatenate css files");
task('concatenate_css', { async: true }, function () {
    //start("Concatenate CSS Library: " + tmp + assetsDir + cssDir + " ==> " + tmp + assetsDir + cssDir + cssFile_min);
    var start = new Date();
    new compressor.minify({
        type: 'no-compress',
        fileIn: stylesheet_names,
        fileOut: target + assetsDir + cssDir + cssFile,
        callback: function(err, min){
            console.log("Errors with minification");
            for (var i = 0, l = stylesheet_names.length; i < l; i++) {
                fs.unlinkSync(stylesheet_names[i]);
            }
            complete();
        }
    });

});

desc("Lints all of the script files in the source directories");
task('lint', function () {
    start("Analyzing the Script Files");

    var codelib = [
        src + 'collections',
        src + 'models',
        src + 'storage',
        src + 'utilities',
        src + 'views-desktop',
        src + 'views-mobile',
        src + 'index.js',
        src + 'router.js',
        src + 'sync.js'
    ];
    lint(codelib);

    end();
});


function log(msg, color) {
    var color = color || 0;
    console.log('\x1b[3' + color + ';1m' + "-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-\n" +
        '\x1b[3' + color + 'm' + msg +
        '\x1b[3' + color + ';1m' + "\n-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-" + '\x1b[0m');
}

function color(msg, color, bright) {
    var color = color || 0;
    var end = bright ? ';1m' : 'm';
    return '\x1b[3' + color + end + msg + '\x1b[0m';

    /*
     colors:
     0 - black
     1 - red
     2 - green
     3 - yellow
     4 - blue
     5 - magenta
     6 - cyan
     7 - white
     */
}

function buildParse(s, debug) {
    //Removes code between <!--DEV:--><!--:DEV--> tags and uncomments code between <!--PRO::PRO--> tags
    //removes console.log statements unless in debug mode
    // remove debug statements
    var regexDebug = /(<!--|\/\*)DEV:(\*\/)?[\s\S]*?(\/\*)?:DEV(\*\/|-->)/g;
    s = "" + s;
    s = s.replace(regexDebug, "");

    if (!debug) {
        //remove between /*DEB:*/ /*:DEB*/
        regexDebug = /(<!--|\/\*)DEB:(\*\/)?[\s\S]*?(\/\*)?:DEB(\*\/|-->)/g;
        s = "" + s;
        s = s.replace(regexDebug, "");
        //remove console.log()
        regexDebug = /console\.log\(.*?\);/gi;
        s = "" + s;
        s = s.replace(regexDebug, "");
    }

    // insert production statements
    var regexProduction = /(?:<!--|\/\*)PRO:([\s\S]*?):PRO(?:-->|\*\/)/gmi;
    s = s.replace(regexProduction, "$1");

    return s;
}

function createDir(dir, complete, perm) {
    perm = perm || 0775;
    ensureDir(dir, perm, function (err) {
        if (err) console.log("Error: cannot create directory « " + dir + " »");
        else console.log(color("Created directory « " + dir + " »", 6, true));
        complete();
    });
}
function removeDir(dir, complete) {
    if (fs.existsSync(dir)) {
        rmdir(dir, function (err, dirs, files) {
            if (err) console.log("Error: cannot delete directory « " + dir + " »");
            else console.log(color("Deleted directory « " + dir + " »", 6, true));
            complete();
        });
    } else {
        complete();
    }
}

function copyFileSync(srcFile, destFile) {
    var content = fs.readFileSync(srcFile);
    fs.writeFileSync(destFile, content);
}
