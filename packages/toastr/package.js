Package.describe({
  "name": "sumit:toastr",
  "summary": "Gnome / Growl type non-blocking notifications",
  "version": "2.1.0",
  "git": ""
});

Package.onUse(function(api) {

  api.versionsFrom("0.9.4");
  api.use("jquery", ["client"]);

  api.addFiles("lib/toastr.js", ["client"]);
  api.addFiles("lib/toastr.css", ["client"]);

});

Package.onTest(function(api) {

  api.use("tinytest");
  api.use("chrismbeckett:toastr");
  api.addFiles("test/client/toastr_test.js", ["client"]);

});