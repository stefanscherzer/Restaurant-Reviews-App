# Restaurant Reviews App

The restaurant reviews app has an overview with restaurants on it.
On the restaurants detail page you find reviews regarding the selected restaurant.

It's a full responsive app which covers the standard accessibility features and due it's service worker implementation it also works offline.

## TL;DR

To get started developing right away:
After clone this repository, run command below

* install all project dependencies with `npm install`
* run `grunt` to generate the apps image folder **img** and the images, minify the css, uglify the js, etc.
  * in order to be able to run the grunt process without any issues, make sure you have ImageMagick installed.
    * If you're a Mac user and have Homebrew installed, simply type: `brew install ImageMagick`
    * otherwise, please follow the instructions here: [grunt-responsive-images](https://github.com/andismith/grunt-responsive-images)

### What do I do from here?

1. Within the root folder of this app, start up a simple HTTP server to serve up the site files on your local computer. Python has some simple tools to do this, and you don't even need to know Python. For most people, it's already installed on your computer.

   In a terminal, check the version of Python you have: `python -V`. If you have Python 2.x, spin up the server with `python -m SimpleHTTPServer 8000` (or some other port, if port 8000 is already in use.) For Python 3.x, you can use `python3 -m http.server 8000`. If you don't have Python installed, navigate to Python's [website](https://www.python.org/) to download and install the software.

2. Switch to the folder called "server" and follow the instructions (README.md) there.

3. With both servers running, visit the site: `http://localhost:8000`, to see the current version of this app.


## What You're Getting
```bash
├── README.md - This file.
├── .gitingnore
├── about_.html
├── Gruntfile.js
├── humans.txt # humanstxt.org
├── index_.html
├── LICENSE # the file where the license information for the project is stored.
├── manifest.json # PWA manifest file
├── package.json # npm package manager file. It's unlikely that you'll need to modify this.
├── package-lock.json #  is automatically generated for any operations where npm modifies either the node_modules tree, or package.json. It describes the exact tree that was generated, such that subsequent installs are able to generate identical trees, regardless of intermediate dependency updates.
├── restaurant_.html
├── robots.txt # www.robotstxt.org
├── sw.template.js # the service worker javascript template
├── assets
│   ├── icon.png # the app icon
│   ├── icon-192x192.png # the app icon
│   ├── icon-256x256.png # the app icon
│   ├── icon-384x384.png # the app icon
│   └── icon-512x512.png # the app icon
├── css
│   └── styles.css # the stylesheet
├── server # this folder contains the mock server. see README inside this folder for instructions how to use it.
├── img_src # this folder contains all the images for the app
├── server # this folder contains a local mock server with the restaurants data. see README inside to know how to use it.
└── js
    ├── alert.js
    ├── dbhelper.js
    ├── gmap.js
    ├── main.js
    ├── modal.js
    ├── restaurant_info.js
    ├── serviceworker.js
    └── sidebar.js
```

## Contributing

Feel free to contribute to this repository if you like.
