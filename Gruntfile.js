/*
 After you have changed the settings under responsive_images
 run this with one of these options:
  "grunt" alone creates a new, completed images directory
  "grunt clean" removes the images directory
  "grunt responsive_images" re-processes images without removing the old ones
*/

module.exports = function(grunt) {

  grunt.initConfig({
    responsive_images: {
      dev: {
        options: {
          engine: 'im',
          sizes: [{
            width: 2048,
            suffix: '_large_2x',
            quality: 50,
            rename: false
          },
          {
            width: 1024,
            suffix: '_large_1x',
            quality: 50,
            rename: false
          },
          {
            width: 1280,
            suffix: '_medium_2x',
            quality: 50,
            rename: false
          },
          {
            width: 640,
            suffix: '_medium_1x',
            quality: 50,
            rename: false
          },
          {
            width: 320,
            suffix: '_small',
            quality: 50,
            rename: false
          }]
        },

        /*
        You don't need to change this part if you don't change
        the directory structure.
        */
        files: [{
          expand: true,
          src: ['*.{gif,jpg,png}'],
          cwd: 'img_src/',
          dest: 'img/'
        }]
      }
    },

    /* Clear out the images directory if it exists */
    clean: {
      dev: {
        src: ['images'],
      },
    },

    /* Generate the images directory if it is missing */
    mkdir: {
      dev: {
        options: {
          create: ['img']
        },
      },
    },

    copy: {
      dev: {
          files: [{
              cwd: 'assets/',
              src: 'icon.png',
              dest: 'img/',
              expand: true
          }]
      }
    }

  });

  grunt.loadNpmTasks('grunt-responsive-images');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-mkdir');
  grunt.registerTask('default', ['clean', 'mkdir', 'copy', 'responsive_images']);

};
