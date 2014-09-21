/*
 * syncpack
 * synchronize and put only newer files into a temporary folder, use any compression plugin on these files then merge to relase folder. 
 * compatible with any gurnt plugin since no specific tweak needed.
 * Copyright (c) 2014 Amo Yeh
 * Licensed under the MIT license.
 */

module.exports = function (grunt) {

    var path = require('path');
    var fs = require('fs');

    grunt.registerMultiTask('syncpack', 'synchronize and put only newer files into a temporary folder, use any compression plugin on these files then merge to relase folder. compatible with any gurnt plugin since no specific tweak needed.', function () {

        //this.options() ==> return options object
        //this.target ==> return object task name
        //this.name = ==> syncpack

        var tempFolderName = "__temp__";
        var logDetail = false;

        if (this.options().tempFolderName) tempFolderName = this.options().tempFolderName;
        if (this.options().logDetail) logDetail = this.options().logDetail;

        if (this.options().action !== "newerToTempFolder" && this.options().action !== "mergeToRelease") {
            grunt.log.errorlns('option action setting must be "newerToTempFolder" or "mergeToRelease"');
            return;
        }

        function detail(msg) {
            if (logDetail) {
                grunt.log.writeln(msg);
            } else {
                grunt.verbose.writeln(msg);
            }
        }
        function tempMapping(path) {
            path = path.replace(/\\/g, '/');
            path = tempFolderName + path.substr(path.indexOf("/"));
            return path;
        }

        if (this.options().action == "newerToTempFolder") {

            //delete temp folder and create again
            if (grunt.file.exists(tempFolderName)) {
                grunt.file.delete(tempFolderName, { force: true });
            }
            grunt.file.mkdir(tempFolderName);

            grunt.log.writeln(" ### newerToTempFolder ### ")
            grunt.log.writeln("");

            var newFilesCount = 0;
            this.files.forEach(function (file) {

                var tempPath = tempMapping(file.src.toString());
                var absSrc = path.resolve(file.src.toString());
                var absDest = path.resolve(file.dest.toString());
                var absTemp = path.resolve(tempPath);

                var newer = false;
                if (!grunt.file.exists(absDest)) {
                    //if file does not exist in destination folder, then copy
                    newer = true;
                } else {
                    //compare both file modified date, if not the same then copy
                    var sourceStats = fs.statSync(absSrc);
                    var destStats = fs.statSync(absDest);
                    if (sourceStats.mtime.getTime() !== destStats.mtime.getTime()) {
                        newer = true;
                    }
                }
                if (newer) {
                    newFilesCount++;
                    //if new files found, copy to temporary folder
                    grunt.file.copy(absSrc, absTemp);
                    detail(" from : " + absSrc);
                    detail(" to   : " + absTemp);
                    detail("");
                }

            });

            grunt.log.writeln(" files copied to "+tempFolderName+" : " + newFilesCount);

        }//ends newerToTempFolder

        if (this.options().action == "mergeToRelease") {

            grunt.log.writeln(" ### mergeToRelease ### ")
            grunt.log.writeln("");

            if (!grunt.file.exists(tempFolderName)) {
                grunt.log.errorlns("temporary folder " + tempFolderName + " does not exist, abort...");
                return;
            }

            var mergeTotal = 0;
            this.files.forEach(function (file) {

                var tempPath = tempMapping(file.src.toString());
                var absSrc = path.resolve(file.src.toString());
                var absDest = path.resolve(file.dest.toString());
                var absTemp = path.resolve(tempPath);

                if (grunt.file.exists(absTemp)) {
                    grunt.file.copy(absTemp, absDest);
                    //find source file mdate
                    var sourceStats = fs.statSync(absSrc);
                    //override to destination file date
                    fs.utimesSync(absDest, sourceStats.atime, sourceStats.mtime);

                    detail(" from : " + absTemp);
                    detail(" to   : " + absDest);
                    detail("");
                    mergeTotal++;

                }

            });

            grunt.log.writeln(" files moved to " + this.data.dest + " : " + mergeTotal);

            if (grunt.file.exists(tempFolderName)) {
                grunt.file.delete(tempFolderName, { force: true });
            }

        }//ends mergeToRelease

    });

};
