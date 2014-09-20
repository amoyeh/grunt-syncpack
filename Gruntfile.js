module.exports = function (grunt) {

    // load all npm grunt tasks
    require('load-grunt-tasks')(grunt);

    // Project configuration.
    grunt.initConfig({

        jshint: {
            all: [
              'Gruntfile.js',
              'tasks/*.js',
              '<%= nodeunit.tests %>'
            ],
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            }
        },

        syncpack: {
            getnew: {
				// files to copy 
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
        }

    });

    //load this plugin's task(s).
    grunt.loadTasks('tasks');

    grunt.registerTask('default', ['syncpack:getnew']);

};
