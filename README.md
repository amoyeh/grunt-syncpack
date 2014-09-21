# grunt-syncpack

### feature

Syncpack can be used to synchronize files from source to destination folder. Instead of copy files directly to destination folder, 
syncpack uses a action **newerToTempFolder** to copy these files into a temporary folder.
you can use any custom compression plugins such as uglify or pngmin to compress these files in the temporary folder, then run other command **mergeToRelease**
to put these newer compressed files to destination folder to finish the process. 

Syncpack compares new files by using files mtime(modified time). To insure that files copied from temp folder to destination folder has same mtime, the **mergeToRelease** action updates every newer file mtime to the same source file mtime.

- **newerToTempFolder** put newer files in temporary folder from source and destination folder comparison.
 
- **mergeToRelease** copy files in temp folder to destination folder, temporary folder will be deleted afterward.
 
- no grunt plugin compatibility issue, any plugin will works.
 
- speed up packaging process, only files in the temporary folder needs to be compressed.
 
## Getting Started

This plugin requires Grunt.

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-syncpack --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-syncpack');
```

## The "grunt-syncpack" task

### Overview
In your project's Gruntfile, add a section named `syncpack` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
    syncpack: {
        getnew: {
            options: {
                action: "newerToTempFolder",
                tempFolderName: "__temp__",
                logDetail: true,
            },
            cwd: "source",
            dest: "release",
            src: ["**/*.js", "**/*.css", "**/*.html", "**/*.jpg", "**/*.png"],
            expand: true
        },
        release: {
            options: {
                action: "mergeToRelease",
                tempFolderName: "__temp__",
                logDetail: true,
            },
            cwd: "source",
            dest: "release",
            src: ["**/*.js", "**/*.css", "**/*.html", "**/*.jpg", "**/*.png"],
            expand: true
        }
    },
})
```

### Options

#### options.action
Type: String

Default : undefined

actions to perform, either "newerToTempFolder" or "mergeToRelease", see features section for more information

#### options.tempFolderName
Type: String

Default : "__temp__"

the temporary folder name


#### options.logDetail
Type: boolean

Default : false

detail console message of every files copied, always show in grunt --verbose mode


#### cwd
Type: String

Default : undefined

current working directory, the project source directory


#### dest
Type: String

Default : undefined

the destination directory, usually the release directory that contains compressed files and ready for upload


#### src
Type: Array

Default : undefined

grunt provided file format, see [globbing pattern](http://gruntjs.com/configuring-tasks#globbing-patterns) for more detail.

#### expand
Type: boolean

Default : true

grunt provided file format, make sure set to true to check every files in every folder.


### Typical Usage 

- use **newerToTempFolder** action to copy newer files to a temporary folder.
- use any of the compression plugin provided by grunt, ex:uglify, pngmin to the files in the temporary folder, since compression updates the files in the temporary folder, the mdate of these copied files are changed.
- use **mergeToRelease** action to copy these newer compressed files to destination folder, the newer file mtime updated to the same as source file mtime, the temporary folder will be deleted afterward.

## Release History
2014.9.21 initial release

## License
Copyright (c) 2014 Amo Yeh. Licensed under the MIT license.
