#Simple Chrome Extension Boilerplate#

You can use this boilerplate to get started with a [Chrome Extension](http://code.google.com/chrome/extensions/devguide.html) quickly. 

This particular boilerplate repo only includes elements for a simple [content script](http://code.google.com/chrome/extensions/content_scripts.html) extension.

##Getting started##

* Check out the [development guide for Chrome Extensions](http://code.google.com/chrome/extensions/devguide.html)
* Name your extension by replacing the text "<NAME>" in the manifest.json file with the name you wish to use
* Add your code to main.js


##NOTE##

The "matches" value in the manifest indicates that the content script should be run on every site, including local sites (file:///*/*). You will most likely want to modify this to work only on the sites that you wish. 