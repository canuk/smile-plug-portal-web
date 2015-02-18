(function(app) {
    app.NavbarView = app.View.extend({
        initialize: function() {
            //only create template once, but ensure that creation takes place after app is loaded
            if (!this.template) app.NavbarView.prototype.template = this.template || _.template($('#navbar-template').html());
        },

        render: function() {
           this.$el.html(this.template({ subtext: "The Portable Learning Cloud" }));
           //this.loginBox = this.loginBox || new app.LoginBoxView();
           //this.loginBox.setElement(this.$("#loginBox")).render();
           logger.info("Rendered NavBar");
           return this;
        },

        remove: function() {
            logger.info('navbar removed');
            this.parentRemove();
        }
    })
})(app);