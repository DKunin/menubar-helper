## Menubar Helper

![icon](./assets/images/icon-128.png)

Barebones simple server, to open files in your favorite editor from whereever possible.

### Install it:
[Latest Version](https://github.com/DKunin/menubar-helper/releases)

![screen](./assets/images/screen-0.png)


### Configure it:

![screen](./assets/images/screen-1.png)
![screen](./assets/images/screen-2.png)

### Select your favorite editor:

- Sublime
- Atom
- VScode
- Webstorm
- Textmate

Now set your tools (extentions and stuff) to call:

```shell
  curl localhost:7288/openeditor?options='name-and-path-of-the-file.js:20:1'
```

And it will open your editor on specified line and column.

###  Changelog
- 2.0.0 Support for different major editors, no need to fiddle with editor path
- 1.1.1 Updated tray icon for retina
