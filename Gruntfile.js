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
        files: [{
          expand: true,
          src: ['*.{gif,jpg,png}'],
          cwd: 'img_src/',
          dest: 'img/'
        }]
      }
    },

    clean: {
      dev: {
        src: ['img', 'sw.js'],
      },
    },

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
      },
    },

    injector: {
      options: {
        template: 'sw.template.js',
        dest: 'sw.js',
        starttag: '// injector:images',
        endtag: '// endinjector',
        transform: function (filePath) {
          return "'" + filePath + "',";
        }
      },
      local_dependencies: {
        files: {
          'sw.js': ['img/*.{gif,jpg,png}']
        }
      }
    },

    cssmin: {
      target: {
        files: [{
          expand: true,
          cwd: 'css/',
          src: ['*.css', '!*.min.css'],
          dest: 'css/',
          ext: '.min.css'
        }]
      }
    },

    uglify: {
      my_target: {
        options: {
          beautify: true
        },
        files: {
          'js/index.min.js':
            [
              'js/serviceworker.js',
              'js/dbhelper.js',
              'js/main.js',
              'js/sidebar.js',
            ],
          'js/restaurant.min.js':
            [
              'js/serviceworker.js',
              'js/dbhelper.js',
              'js/restaurant_info.js',
              'js/sidebar.js',
            ],
          'js/about.min.js':
            [
              'js/serviceworker.js',
              'js/sidebar.js',
            ]
        }
      }
    },

  });

  grunt.loadNpmTasks('grunt-contrib-uglify-es');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-injector');
  grunt.loadNpmTasks('grunt-responsive-images');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-mkdir');
  grunt.registerTask(
      'default',
      [
        'clean',
        'mkdir',
        'copy',
        'responsive_images',
        'injector',
        'cssmin',
        'uglify'
      ]);

};
