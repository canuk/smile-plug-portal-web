(function (app) {
    app.Router = Backbone.Router.extend({
        routes: {
            '': 'home',
            'home': 'home',
            'login': 'login',
            'usb': 'usb',
            'about': 'about',
            '*catchall': 'catchall'
        },

        home: function () {
            console.log("router:home");
            this.setContentView({
                name: 'home',
                view: new app.HomeView()
            });
        },
        login: function () {
            console.log("router:login");
            this.setContentView({
                name: 'login',
                view: new app.LoginView()
            });
        },
        usb: function () {
            console.log("router:usb");
            this.setContentView({
                name: 'usb',
                view: new app.UsbView()
            });
        },
        about: function () {
            console.log("router:about");
            this.setContentView({
                name: 'about',
                view: new app.AboutView()
            });
        },
        catchall: function () {
            logger.info("catchall");
            //go to home view if undefined route is passed
            //and not currentView has not been set,
            //otherwise do nothing
            if (typeof(this.currentView) === 'undefined') {
                logger.info(typeof(this.currentView));
                this.navigate("", {trigger: true, replace: true});
            }
        },
        setContentView: function (options) {
            options = options || {};
            var name = options.name;
            var view = options.view;
            this.content = view;

            if (this.content && this.content.view) {
                this.content.view.remove();
            }

            if (this.mainView == null) {
                this.mainView = new app.MainView({id: 'app-container'});
                this.mainView.setElement($('#app-container')).render({
                    content: this.content
                });
            } else if (this.content) {
                this.mainView.setElement($('#app-container')).render({
                    content: this.content
                })
            }

            //select menu bar
            //TODO: use models here instead?
            if (name) {
                $('.nav li').removeClass('active');
                $('.nav .' + name).addClass('active');
            }
            //close menu
            $('#menu-toggler').removeClass("display");
            $('#sidebar').removeClass("display");
        }
    });
})(app);