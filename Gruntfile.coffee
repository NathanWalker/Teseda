module.exports = (grunt) ->
  require("matchdep").filterDev("grunt-*").forEach grunt.loadNpmTasks

  # DEVELOPMENT
  grunt.registerTask "go", "Development build", ->
    grunt.log.writeln "Development build"
    grunt.config "isProduction", false
    grunt.task.run "dev"

  grunt.registerTask "serverOnly", "Server", ->
    grunt.log.writeln "Server"
    grunt.config "isProduction", false
    grunt.task.run ["server", "watch:server"]

  preparationTasks = ["concat:vendor", "coffee:dev", "concat:dev"]
  grunt.registerTask "dev-prepare", preparationTasks
  grunt.registerTask "dev", ["clean", "dev-prepare", "server", "watch:views"]

  grunt.registerTask "coffee-compile", "compile all coffee", ->
    grunt.log.writeln "--------- compiling coffee ---------"
    grunt.task.run "coffee:dev"

  grunt.registerTask "e2e-prepare", "config e2e and concat:dev", ->
    grunt.log.writeln "--------- preparing index.html for e2e testing ---------"
    grunt.config "isE2E", true
    grunt.task.run "concat:dev"


  # you can also run "grunt watch:cssdev" be sure to run another tab with "grunt hover"
  # run "grunt recess:vendor" if vendor has been updated
  # run "grunt watch:cssdev" to do css work
  grunt.registerTask "cssdev", ["recess:latest", "concat:cssdev"]

  # Production
  grunt.registerTask "release", "Production build", ->
    grunt.config "isProduction", true
    grunt.task.run "prod"

  grunt.registerTask "prod", ["clean", "concat:vendor", "coffee:dev", "uglify", "concat:prod", "copy:assets", "preflight"]
  grunt.registerTask "preflight", ["server:dist", "watch:views"]

  # TESTING
  grunt.registerTask "test", "run all tests (unit, midway, e2e)", ->
    done = @async()
    require("child_process").exec "grunt coffee-compile", (err, stdout) ->
      require("child_process").exec "grunt e2e-prepare", (err, stdout) ->
        spawn = undefined
        e2eServer = undefined
        errOutput = ""
        testsComplete = 0
        outputTestResults = ->
          e2eServer.kill() # kill the e2e server that was spawned manually
          done errOutput


        # app-server is required for midway and e2e testing
        # because of its configuration, we can listen to 'close' to kill the process
        require("./app-server.js").listen(8000).on "close", done

        # e2e testing takes a special spawned process to manage
        # because it cannot be configured as a node server, it must be referenced in order to properly kill process
        spawn = require("child_process").spawn
        e2eServer = spawn("./scripts/lib/e2e_server.js 8100")
        require("child_process").exec "./node_modules/.bin/karma start test/config/unit.js --single-run", (err, stdout) ->
          grunt.log.write "\n--------- Unit Test Results ---------\n\n" + stdout
          errOutput += err
          testsComplete++
          outputTestResults()  if testsComplete is 3

        require("child_process").exec "./node_modules/.bin/karma start test/config/midway.js --single-run", (err, stdout) ->
          grunt.log.write "\n--------- Midway Test Results ---------\n\n" + stdout
          errOutput += err
          testsComplete++
          outputTestResults()  if testsComplete is 3

        require("child_process").exec "./node_modules/.bin/karma start test/config/e2e.js --single-run", (err, stdout) ->
          grunt.log.write "\n--------- E2E Test Results ---------\n\n" + stdout
          errOutput += err
          testsComplete++
          outputTestResults()  if testsComplete is 3





  # unit tests
  grunt.registerTask "test:unit", "run unit tests", ->
    done = @async()
    require("child_process").exec "grunt coffee-compile", (err, stdout) ->
      require("child_process").exec "./node_modules/.bin/karma start test/config/unit.js --single-run", (err, stdout) ->
        grunt.log.write stdout
        done err




  # midway tests
  grunt.registerTask "test:midway", "run midway tests", ->
    done = @async()
    require("child_process").exec "grunt coffee-compile", (err, stdout) ->
      require("./app-server.js").listen(8000).on "close", done
      require("child_process").exec "./node_modules/.bin/karma start test/config/midway.js --single-run", (err, stdout, stderr) ->
        grunt.log.write stdout
        done err




  # e2e tests
  grunt.registerTask "test:e2e", "run e2e tests", ->
    require("child_process").exec "grunt e2e-prepare"
    done = @async()
    spawn = undefined
    e2eServer = undefined

    # app-server is required for midway and e2e testing
    # because of its configuration, we can listen to 'close' to kill the process
    require("./app-server.js").listen(8000).on "close", done

    # e2e testing takes a special spawned process to manage
    # because it cannot be configured as a node server, it must be referenced in order to properly kill process
    spawn = require("child_process").spawn
    e2eServer = spawn("./scripts/lib/e2e_server.js 8100")
    require("child_process").exec "./node_modules/.bin/karma start test/config/e2e.js --single-run", (err, stdout, stderr) ->
      grunt.log.write stdout
      e2eServer.kill()
      done err


  grunt.registerTask "test-watch", ["karma:watch"]

  # Travis CI for tests
  grunt.registerTask "travis", ["concat:vendor", "concat:dev", "karma:unit"]

  # Print a timestamp (useful for when watching)
  grunt.registerTask "timestamp", ->
    grunt.log.subhead Date()


  # PREVIEW SERVERS
  grunt.registerTask "server", "custom preview server using express", ->
    grunt.log.writeln "Express server listening on port 8000"
    require("./app-server.js").listen 8000
    require("child_process").exec "open \"http://localhost:8000\""

  grunt.registerTask "server:dist", "custom preview server using express targeting dist", ->
    grunt.log.writeln "Express server listening on port 8500"
    done = @async()
    require("./dist-server.js").listen(8500).on "close", done
    require("child_process").exec "open \"http://localhost:8500\""


  # These tasks are being kept around because eventually we want to use 'html2js' as shown here
  # grunt.registerTask('build', ['clean','html2js','concat','recess:build','copy:assets']);
  # grunt.registerTask('release', ['clean','html2js','uglify','karma:unit','concat:index', 'recess:min','copy:assets','karma:e2e']);
  karmaConfig = (configFile, customOptions) ->
    options =
      configFile: configFile
      keepalive: true

    travisOptions = process.env.TRAVIS and
      browsers: ["Firefox"]
      reporters: "dots"

    grunt.util._.extend options, customOptions, travisOptions


  # Project configuration.
  grunt.initConfig
    isProduction: false
    isE2E: false
    distdir: "dist"
    pkg: grunt.file.readJSON("package.json")
    banner: "/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today(\"yyyy-mm-dd\") %>\n" + "<%= pkg.homepage ? \" * \" + pkg.homepage + \"\\n\" : \"\" %>" + " * Copyright (c) <%= grunt.template.today(\"yyyy\") %> <%= pkg.author %>;\n" + " * Licensed <%= _.pluck(pkg.licenses, \"type\").join(\", \") %>\n */\n"
    src:
      # Vendors
      # always loads first
      # Order matters here!
      vendor: [
        "bower_components/es5-shim/es5-shim.min.js"
        "bower_components/json3/lib/json3.min.js"
        "bower_components/jquery/jquery.min.js"
        "bower_components/jquery-ui/ui/minified/jquery.ui.core.min.js"
        "bower_components/jquery-ui/ui/minified/jquery.ui.widget.min.js"
        "bower_components/jquery-ui/ui/minified/jquery.ui.mouse.min.js"
        "bower_components/jquery-ui/ui/minified/jquery.ui.sortable.min.js"
        "bower_components/lodash/dist/lodash.compat.min.js"

        "bower_components/javascript-linkify/ba-linkify.min.js"
        "bower_components/infowrap-date-format/date.format.js"
        "bower_components/klass/klass.min.js"
        "bower_components/momentjs/min/moment.min.js"
        "bower_components/spinjs/dist/spin.min.js"
        "bower_components/select2/select2.min.js"

        # for IE 8/9 compatibility
        "vendor/js/compatibility/postmessage.js"
        "vendor/js/compatibility/angular.ieCors.js"
        "bower_components/infowrap-angular/build/angular.min.js"
        "bower_components/infowrap-angular/build/angular-touch.min.js"
        "bower_components/infowrap-angular/build/angular-route.min.js"
        "bower_components/infowrap-angular/build/angular-cookies.min.js"
        "bower_components/infowrap-angular/build/angular-sanitize.min.js"

        "bower_components/angular-ui-utils/modules/**/*.js"
        "!bower_components/angular-ui-utils/modules/**/test/*.js"
        "!bower_components/angular-ui-utils/modules/**/demo"
        "bower_components/angular-ui-utils/utils.js"
        "bower_components/angular-ui-select2/src/select2.js"

        "bower_components/infowrap-ui-bootstrap/dist/ui-bootstrap-0.6.0-SNAPSHOT.js"
        "bower_components/store-js/store.min.js"
        "bower_components/infowrap-ng-table/ng-table.src.js"
        "bower_components/infowrap-isotope/jquery.isotope.js"
        "bower_components/infowrap-angular-isotope/dist/infowrap-angular-isotope.js"
        "bower_components/infowrap-photoswipe/release/3.0.5.1/code.photoswipe.jquery-3.0.5.1.min.js"
        "vendor/js/theme/*.js",
        "vendor/js/fancybox/jquery.fancybox.pack.js",
        "vendor/js/fancybox/helpers/jquery.fancybox-buttons.js",
        "vendor/js/fancybox/helpers/jquery.fancybox-media.js"
      ]

      # App-specific Code
      # Order matters here!
      js: [
        "app/js/config/config.js",
        "app/js/config/teseda.js",
        "app/js/modules/core/teseda-core.js",
        "app/js/modules/core/dependencies/*.js",
        "app/js/modules/user/user.js",
        "app/js/modules/user/*s/*.js",
        "app/js/modules/*.js",
        "app/js/controllers/**/*.js",
        "app/js/directives/**/*.js",
        "app/js/filters/**/*.js",
        "app/js/services/**/*.js",
        "app/js/<%= pkg.name %>.js"
      ]

      specs: ["test/**/spec*.js"]
      scenarios: ["test/e2e/**/scenario*.js"]
      html: ["app/index-edit-me.html", "app/views/**/*.html"]
      less: ["app/less/index.less"] # recess:build doesn't accept ** in its file patterns

    clean: [
      "<%= distdir %>",
      "app/js/tesedaapp.js",
      "app/js/vendor.js",
      "app/js/config",
      "app/js/controllers",
      "app/js/directives",
      "app/js/filters",
      "app/js/modules",
      "app/js/services"
    ]
    copy:
      assets:
        files: [
          dest: "<%= distdir %>/assets"
          src: "**"
          expand: true
          cwd: "app/assets/"
        ,
          dest: "<%= distdir %>/css"
          src: "**"
          expand: true
          cwd: "app/css/"
        ,
          dest: "<%= distdir %>/downloads"
          src: "**"
          expand: true
          cwd: "app/downloads/"
        ,
          dest: "<%= distdir %>/fonts"
          src: "**"
          expand: true
          cwd: "app/fonts/"
        ,
          dest: "<%= distdir %>/img"
          src: "**"
          expand: true
          cwd: "app/img/"
        ,
          dest: "<%= distdir %>/template"
          src: "**"
          expand: true
          cwd: "app/template/"
        ,
          dest: "<%= distdir %>/views"
          src: "**"
          expand: true
          cwd: "app/views/"
        ]

    coffee:
      dev:
        options:
          bare: true

        expand: true
        cwd: "app/coffee"
        src: ["**/*.coffee"]
        dest: "app/js"
        ext: ".js"

    karma:
      unit:
        options: karmaConfig("test/config/unit.js",
          singleRun: true
        )

      midway:
        options: karmaConfig("test/config/midway.js",
          singleRun: true
        )

      e2e:
        options: karmaConfig("test/config/e2e.js",
          singleRun: true
        )

      watch:
        options: karmaConfig("test/config/unit.js",
          singleRun: false
          autoWatch: true
        )


    # generate application cache manifest
    manifest:
      dist:
        options: {}
        src: ["css/*.css", "js/**/*.js", "template/**/*.html", "img/**/*", "views/**/*.html", "*"]
        dest: "<%= distdir %>/manifest.appcache"

    concat:
      cssdev:
        src: ["app/css/vendor.css", "app/css/latest.css"]
        dest: "app/css/<%= pkg.name %>.css"
        options:
          process: true

      vendor:
        options:
          separator: ";\n"

        src: ["<%= src.vendor %>"]
        dest: "app/js/vendor.js"

      dev:
        src: ["app/index-edit-me.html"]
        dest: "app/index.html"
        options:
          process: true

      prod:
        src: ["app/index-edit-me.html"]
        dest: "<%= distdir %>/index.html"
        options:
          process: true

    uglify:
      dist:
        options:
          banner: "<%= banner %>"

        src: ["app/js/vendor.js", "<%= src.js %>"]
        dest: "<%= distdir %>/js/<%= pkg.name %>.js"

    recess:
      dev:
        files:
          "app/css/<%= pkg.name %>.css": ["<%= src.less %>"]

        options:
          compile: true

      latest:
        files:
          "app/css/latest.css": "app/less/index.less"

        options:
          compile: true

      prod:
        files:
          "<%= distdir %>/css/<%= pkg.name %>.css": ["<%= src.less %>"]

        options:
          compress: true

      vendor:
        files:
          "app/css/vendor.css": "app/less/vendor/index.less"

        options:
          compile: true

    watch:
      views:
        files: ["app/index-edit-me.html"]
        tasks: ["concat:dev", "timestamp"]

      cssdev:
        files: ["app/less/**/*.less"]
        tasks: ["cssdev"]

      coffeeForTests:
        files: ["app/coffee/**/*.coffee"]
        tasks: ["coffee:dev"]

      server:
        files: ["nothing.server"]
        tasks: ["timestamp"]

    changelog:
      options:
        dest: "CHANGELOG.md"
        templateFile: "lib/changelog.tpl.md"
        github:"https://github.com/NathanWalker/Teseda"


#    , html2js: {
#      app: {
#        options: {
#          base: 'src/app'
#        },
#        src: ['<%= src.tpl.app %>'],
#        dest: '<%= distdir %>/templates/app.js',
#        module: 'templates.app'
#      },
#      common: {
#        options: {
#          base: 'src/common'
#        },
#        src: ['<%= src.tpl.common %>'],
#        dest: '<%= distdir %>/templates/common.js',
#        module: 'templates.common'
#      }
#    }
