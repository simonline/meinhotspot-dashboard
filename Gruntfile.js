module.exports = function(grunt) {

    grunt.initConfig({
        copy: {
                img: {
                        files: [
                                {
                                    expand: true,
                                    flatten: true,
                                    src: 'img/*',
                                    dest: 'dist/img/'
                                }
                        ]
                },
                fonts: {
                        files: [
                                {
                                    expand: true,
                                    flatten: true,
                                    src: ['fonts/*', 'node_modules/font-awesome/fonts/*'],
                                    dest: 'dist/fonts/'
                                },
                        ]
                },
                css: {
                        files: [
                                {
                                    expand: true,
                                    flatten: true,
                                    src: 'node_modules/bootstrap-table/dist/bootstrap-table.css',
                                    dest: 'dist/css/'
                                },
                                {
                                    expand: true,
                                    flatten: true,
                                    src: 'node_modules/c3/c3.css',
                                    dest: 'dist/css/'
                                },
                        ]
                },
                data: {
                        files: [
                                {
                                    expand: true,
                                    flatten: true,
                                    src: 'data/*',
                                    dest: 'dist/data/'
                                }
                        ]
                }
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            all: [
                'Gruntfile.js',
                'js/*.js',
            ]
        },
        uglify: {
            dist: {
                files: {
                    'dist/js/dashboard.min.js': [
                        'node_modules/jquery/dist/jquery.js',
                        'node_modules/popper.js/dist/umd/popper.js',
                        'node_modules/bootstrap/dist/js/bootstrap.js',
                        'node_modules/bootstrap-table/dist/bootstrap-table.js',
                        'node_modules/bootstrap-table/dist/locale/bootstrap-table-de-DE.js',
                        // Using src instead of dist folder, since dist folder isn't up-to-date
                        'node_modules/bootstrap-table/src/extensions/export/bootstrap-table-export.js',
                        'node_modules/tableexport.jquery.plugin/tableExport.js',
                        'node_modules/moment/min/moment-with-locales.js',
                        'node_modules/d3/dist/d3.js',
                        'node_modules/c3/c3.js',
                        'node_modules/js-cookie/src/js.cookie.js',
                        'js/charts.js',
                        'js/tables.js',
                        'js/custom.js'
                    ]
                },
                options: {
                    // sourceMap: 'js/app.min.js.map',
                    // sourceMappingURL: '/js/main.min.js.map'
                    // FIXME: For testing, remove after
                    compress: {
                        drop_debugger: false
                    }
                }
            }
        },
        sass: {
            dist: {
                options: {
                    style: 'compressed',
                    loadPath: [
                            'node_modules/bootstrap/scss',
                            'node_modules/font-awesome/scss'
                    ]
                },
                files: {
                    "dist/css/dashboard.min.css": "scss/dashboard.scss",
                }
            }
        },
        watch: {
            html: {
                files: ['templates/*.html', 'templates/*/*.html'],
                tasks: ['includereplace'],
            },
            sass: {
                files: ['scss/**/*.scss'],
                tasks: ['sass'],
                options: {
                    nospawn: true
                }
            },
            data: {
                files: ['data/*'],
                tasks: ['copy:data'],
            },
            js: {
                files: [
                    '<%= jshint.all %>'
                ],
                tasks: ['jshint', 'uglify']
            }
        },
        clean: {
            dist: [
                'dist',
            ]
        },
        includereplace: {
            templates: {
                options: {
                },
                files: [
                    {
                        expand: true,
                        flatten: true,
                        src: 'templates/*.html',
                        dest: 'dist/'
                    }
                ]
            }
          }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify-es');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-include-replace');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', [
        'clean',
        'copy',
        'sass',
        'uglify',
        'includereplace',
        'watch'
    ]);
};