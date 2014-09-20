# grunt-syncpack

### feature

Syncpack can be used to synchronize files from source to destination folder. Instead of copy files directly to destination folder, 
syncpack uses a action **newerToTempFolder** to copy these files into a temporary folder named \_\_temp\_\_.
you can use any custom compression plugins such as uglify or pngmin to compress these files in the temporary folder, then run other command **mergeToRelease**
to put these newer compressed files to destination folder to finish the process. 

Syncpack compares new files by using files mtime(modified time). To insure that files copied from temp folder to destination folder has same mtime, the **mergeToRelease** action updates every newer file mtime to the same source file mtime.

- **newerToTempFolder** put newer files in temp folder from source and destination folder comparison.
 
- **mergeToRelease** copy files in temp folder to destination folder, temporary folder will be deleted afterward.
 
- no grunt plugin compatibility issue, any plugin will works.
 
- speed up packaging process, since only files in the temporary folder needs to be compressed.
 
## Getting Started

This plugin requires Grunt.

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install syncpack --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('syncpack');
```

## The "syncpack" task

### Overview
In your project's Gruntfile, add a section named `syncpack` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
    syncpack: {
        getnew: {
			// file patterns to copy 
            options: { ext: ["**/*.js","**/*.html","**/*.css", "**/*.png", "**/*.jpg"] },	
			// setting source folder and destination folder for comparison
            files: { src: "/source", dest: "/release" }, 		
			// compare and put newer files into a foler named "__temp__"
			action: "newerToTempFolder" 								
        },
        release:{
			// setting source folder and destination folder for comparison
            files: { src: "/source", dest: "/release" },
			// copy files from __temp__ folder (after compressions) to destination folder, update mtime to match source.
			action: "mergeToRelease" 									
        }
    },
})
```

### Options

#### options.ext
Type: Array

Default : undefined

list of files to include in globbing patterns.[more detail](http://gruntjs.com/configuring-tasks#globbing-patterns)

#### files
Type: Object

Default : undefined

setting source and destination path, example {src: "/source/path", dest: "destination/path"}

#### action
Type: String

Default : undefined

actions to perform, either "newerToTempFolder" or "mergeToRelease"


### Typical Usage 
- use **newerToTempFolder** action to copy newer files to a temp folder name "__temp__"
- use any of the compression plugin provided by grunt, ex:uglify, pngmin to the files in the "__temp__" folder, since compression updates the files in the \_\_temp\_\_ folder, the mdate of these files are changed.
- use **mergeToRelease** action to copy these newer compressed files to destination folder, the newer file mtime updated to the same as source file mtime, the \_\_temp\_\_ folder will be deleted afterward.

## Release History
2014.9.20 initial release

## License
Copyright (c) 2014 Amo Yeh. Licensed under the MIT license.
