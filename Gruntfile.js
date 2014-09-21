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
        }

    });

    //load this plugin's task(s).
    grunt.loadTasks('tasks');
    grunt.registerTask('default', ['syncpack:getnew']);

};
