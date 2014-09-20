/*
 * syncpack
 * 
 * feature
 * action [newerToTempFolder] -> put newer files in temp folder from source destination folder comparison.
 * action [mergeToRelease] -> copy files in temp folder (after compressions) to destination folder.
 * no plugin compatibility issue, any plugin will works.
 * speed up packaging process, only newer files gets compressed.
 * 
 * Syncpack compares new files by using files mtime(modified time).
 * To insure that files copied from temp folder to destination folder has same mtime, 
 * the [mergeToRelease] action updates every newer file mtime to the same source file mtile.
 * 
 * the typical usage 
 * use [newerToTempFolder] action to copy newer files to a temp folder name "__temp__" (from src and dest folder path setting)
 * use any of the compression plugin provided by grunt, ex:uglify, pngmin to the files in the "__temp__" folder
 * since compression updates the files in the __temp__ folder, the mdate of these files are changed
 * use [mergeToRelease] action to copy these newer compressed files to destination folder, the newer file mtime updated to the same source file mtime
 *
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

        var src;
        var dest;
		
        //loop on the file settings array
        this.files.forEach(function (file) {
            if (file.dest == "src") src = file.orig.src;
            if (file.dest == "dest") dest = file.orig.src;
        });

        if (src == null || dest == null) {
            grunt.log.errorlns('please specify both source and destination folder');
            grunt.log.errorlns('example -> files: { src: "source/", dest: "release/" }');
            return;
        }

        src = (process.cwd() + src).replace(/\\/g, '/');
        dest = (process.cwd() + dest).replace(/\\/g, '/');

        if (!grunt.file.exists(src)) grunt.log.errorlns('src path "' + src + '" does not exist, abort...');
        if (!grunt.file.exists(dest)) grunt.log.errorlns('dest path "' + dest + '" does not exist, abort...');
        if (grunt.file.exists(src) == false || grunt.file.exists(dest) == false) return;
        if (this.data.action !== "newerToTempFolder" && this.data.action !== "mergeToRelease") {
            grunt.log.errorlns('option action setting must be "newerToTempFolder" or "mergeToRelease"  abort... ');
            return;
        }
        grunt.log.writeln(" src : " + src);
        grunt.log.writeln(" dest: " + dest);
        grunt.log.writeln("");
		
        if (this.data.action === "newerToTempFolder") {
            
			grunt.log.writeln(" ### newerToTempFolder ### ")
            grunt.log.writeln("");

            //loop each files and get newer to temp folder

            var extList = this.options().ext;

            //get all target files
            var targetFiles = grunt.file.expand({ cwd: "source" }, extList);
            var destMappings = grunt.file.expandMapping(extList, dest, { cwd: src });
            var tempMappings = grunt.file.expandMapping(extList, "__temp__", { cwd: src });
            total = destMappings.length;

            //delete temp folder and create again
            if (grunt.file.exists("__temp__")) {
                grunt.file.delete("__temp__", { force: true });
            }
            grunt.file.mkdir("__temp__");

            var newFilesCount = 0;
            for (var p = 0; p < total; p++) {
                var newer = false;
                var loopSrc = destMappings[p].src[0];
                var loopDest = destMappings[p].dest;
                var tempDest = tempMappings[p].dest;
                if (!grunt.file.exists(loopDest)) {
                    //if file does not exist in destination folder, then copy
                    newer = true;
                } else {
                    //compare both file modified date, if not the same then copy
                    var sourceStats = fs.statSync(loopSrc);
                    var destStats = fs.statSync(loopDest);
                    if (sourceStats.mtime.getTime() !== destStats.mtime.getTime()) {
                        newer = true;
                    }
                    //    fs.utimesSync(filepath, testDate, testDate);
                }
                if (newer) {
                    newFilesCount++;
                    //if new files found, copy to __temp__ folder
                    grunt.file.copy(loopSrc, tempDest);
                    //grunt.log.writeln(" [copy] " + loopSrc + "  =>  ");
                    //grunt.log.writeln("        " + tempDest);
                }
            }
            grunt.log.writeln(" files copied to __temp__ : " + newFilesCount);

        }//ends newerToTempFolder

        if (this.data.action === "mergeToRelease") {

            grunt.log.writeln(" ### mergeToRelease ### ")
            grunt.log.writeln("");
			
			if (!grunt.file.exists("__temp__")) {
				grunt.log.errorlns('__temp__ folder does not exist, abort...');
				return;
			 }

            //get all files in temp folder
            var tempFiles = grunt.file.expand({ cwd: "__temp__" }, "**/*.*");
            var sourceMapping = grunt.file.expandMapping("**/*.*", src, { cwd: "__temp__" });
            var destMappings = grunt.file.expandMapping("**/*.*", dest, { cwd: "__temp__" });
            total = tempFiles.length;
            //var t = total;
            //while (t--) {
            //    grunt.log.writeln(JSON.stringify(sourceMapping[t]));
            //    grunt.log.writeln(JSON.stringify(destMappings[t]));
            //}
            for (var p = 0; p < total; p++) {
                var loopTemp = sourceMapping[p].src;
                var loopSrc = sourceMapping[p].dest;
                var loopDest = destMappings[p].dest;
                //var tempDest = tempMappings[p].dest;
                //copy files from temp to destination folder
                grunt.file.copy(loopTemp, loopDest);
                //find source file mdate
                var sourceStats = fs.statSync(loopSrc);
                //override to destination file date
                fs.utimesSync(loopDest, sourceStats.atime, sourceStats.mtime);
                //grunt.log.writeln("to dest -> " + loopDest);
            }
            grunt.log.writeln(" files merged to dest : " + total);


            //delete temp folder
            if (grunt.file.exists("__temp__")) {
                grunt.file.delete("__temp__", { force: true });
            }

        }// ends mergeToRelease

    });

};
