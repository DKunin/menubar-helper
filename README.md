## Menubar Helper

![icon](./assets/images/icon-128.png)

Barebones simple server. 

Install it:

![screen](./assets/images/screen-0.png)


Configure it:

![screen](./assets/images/screen-1.png)
![screen](./assets/images/screen-2.png)

Set path to your favorite editor.

Now set your tools (extentions and stuff) to call:

```shell
  curl localhost:7288/openeditor?options='name-and-path-of-the-file.js:20:1'
```

And it will open your editor on specified line and column.
