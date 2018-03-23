# Restaurant Reviews App


You have been provided the code for a restaurant reviews website. The code has a lot of issues. It’s barely usable on a desktop browser, much less a mobile device. It also doesn’t include any standard accessibility features, and it doesn’t work offline at all. Your job is to update the code to resolve these issues while still maintaining the included functionality.


## TL;DR

To get started developing right away:
After clone this repository, run command below

* install all project dependencies with `npm install`
* run `grunt` to generate the apps image folder **img** and the images


### What do I do from here?

1. In this folder, start up a simple HTTP server to serve up the site files on your local computer. Python has some simple tools to do this, and you don't even need to know Python. For most people, it's already installed on your computer.

In a terminal, check the version of Python you have: `python -V`. If you have Python 2.x, spin up the server with `python -m SimpleHTTPServer 8000` (or some other port, if port 8000 is already in use.) For Python 3.x, you can use `python3 -m http.server 8000`. If you don't have Python installed, navigate to Python's [website](https://www.python.org/) to download and install the software.

2. With your server running, visit the site: `http://localhost:8000`, to see the current version of this app.


## What You're Getting
```bash
├── README.md - This file.
├── about.html
├── Gruntfile.js
├── index.html
├── LICENSE # the file where the license information for the project is stored.
├── package.json # npm package manager file. It's unlikely that you'll need to modify this.
├── package-lock.json #  is automatically generated for any operations where npm modifies either the node_modules tree, or package.json. It describes the exact tree that was generated, such that subsequent installs are able to generate identical trees, regardless of intermediate dependency updates.
├── restaurant.html
├── sw.js # the service worker javascript
├── assets
    ├── icon_256.png # the app icon in higher resolution
│   └── icon.png # the app icon
├── css
│   └── styles.css # the stylesheet
├── data
│   └── restaurants.json # the mocked restaurants data
├── img_src # this folder contains all the images for the app
└── js
    ├── dbhelper.js
    ├── main.js
    ├── restaurant_info.js
    └── sidebar.js
```

## Contributing

Feel free to contribute to this repository if you like.
