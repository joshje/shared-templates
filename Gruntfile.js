module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        bower: {
            build: {
                dest: 'public/js/lib',
                options: {
                    expand: true,
                    packageSpecific: {
                        'requirejs-hogan-plugin': {
                            files: [
                                'hgn.js',
                                'hogan.js'
                            ]
                        }
                    }
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-bower');

    grunt.registerTask('default', ['bower']);

};
