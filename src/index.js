(function (window) {
    var app = window.app = {
        init: function () {
            //Dummy debugger for production
            /*PRO:
             //insert dummy logger object for production only
             var logger = window.logger = {
             error: function() { return false; },
             info: function() { return false; },
             debug: function() { return false; },
             log: function() { return false; },
             trace: function() { return false; },
             warn: function() { return false; }
             }
             :PRO*/

            app.showLoadingModal = function(obj) {
                obj = obj || {};
                obj.text = obj.text || "";
                app.modal = new app.LoadingModalView();
                app.modal.setElement($('#menu-overlay')).render({ msg: obj.text });
            }

            app.showLoginModal = function() {
                app.modal = new app.LoginView();
                app.modal.setElement($('#menu-overlay')).render();
            }

            app.router = new app.Router();
            Backbone.history.start();
        },

        modal: null
    };

    //user-agent detection
    var agent = navigator.userAgent.toLowerCase();
    console.log("User agent: " + agent);
    app.mobile_agent = (agent.indexOf("mobi") > -1);
    app.is_android = (agent.indexOf("android") > -1);

    /*DEV:*/
    //template loading code from:
    //  http://coenraets.org/blog/2012/01/backbone-js-lessons-learned-and-improved-sample-app/
    app.templates = {
        // Hash of preloaded templates for the app
        templates: {},

        // Recursively pre-load all the templates for the app.

        loadTemplates: function (names, callback) {

            var that = this;

            var loadTemplate = function (index) {
                var name = names[index];
                $.get('templates/' + name + '.html', function (data) {
                    $('body').append("<script type='text/template' id='" + name + "-template'>\n" + data + "\n</script>");
                    index++;
                    if (index < names.length) {
                        loadTemplate(index);
                    } else {
                        callback();
                    }
                });
            }

            loadTemplate(0);
        },

        // Get template by name from hash of preloaded templates
        get: function (name) {
            return this.templates[name];
        }
    };
    window.logger = {
        info: function(msg) {
            console.log(msg);
        }
    }
    $(function () {
        app.templates.loadTemplates([
            'home',
            'usb',
            'about',
            'navbar',
            'login',
            'sidebar',
            'loadingModal'
        ], function () {
            app.init();
        });
    });
    /*:DEV*/
    //for production, templates are attached already to index.html during building (see README)
    /*PRO:$(app.init);:PRO*/
}) (window);