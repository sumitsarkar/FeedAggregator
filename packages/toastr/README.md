# Meteor toastr

Gnome / Growl type non-blocking notifications.

## Current Version

**2.1.0**
[![Build Status](https://travis-ci.org/chrismbeckett/meteor-toastr.svg)](https://travis-ci.org/chrismbeckett/meteor-toastr)


## Usage

Use toastr to display notifications for info, success, warning and errors.

```js
  // Display a warning toast, with no title
  toastr.warning(msg);

  // Display a success toast, with a title
  toastr.success(msg, title);

  // Display an error toast, with a title
  toastr.error(msg, title);

  // Clears the current list of toasts
##  toastr.clear()
```
## How to Install

```bash
  meteor add chrismbeckett:toastr
```




## Demo

To explore additional options, try the [demo](http://codeseven.github.io/toastr/demo.html).

## Attribution

This package utilizes the [toastr](http://www.toastrjs.com/) library
authored by [John Papa](http://twitter.com/John_Papa) and
[Hans Fjällemark](http://twitter.com/hfjallemark).

## License

[The MIT License (MIT)](http://www.opensource.org/licenses/mit-license.php)
<br>
Copyright (c) 2013 [Chris Beckett](https://github.com/chrismbeckett)
