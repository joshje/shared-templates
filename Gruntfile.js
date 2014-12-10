module.exports = function(grunt) {

  grunt.initConfig({

    requirejs: {
      compile: {
        options: {
          baseUrl: 'public/js',
          name: 'main',
          out: 'public/js/main.min.js',
          mainConfigFile: 'public/js/main.js',
          optimize: 'uglify2',
          preserveLicenseComments: false,
          generateSourceMaps: true,
          paths: {
            text: '../../bower_components/requirejs-hogan-plugin/text',
            hogan: '../../bower_components/requirejs-hogan-plugin/hogan',
            hgn: '../../bower_components/requirejs-hogan-plugin/hgn',
            md5: '../../bower_components/md5-jkmyers/md5.min',
            templates: '../../templates'
          }
        }
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-requirejs');

  grunt.registerTask('default', ['requirejs']);

};
