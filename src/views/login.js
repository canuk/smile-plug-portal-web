(function(app) {
    app.LoginView = app.View.extend({
        initialize: function() {
            //only create template once, but ensure that creation takes place after app is loaded
            if (!this.template) app.LoginView.prototype.template = this.template || _.template($('#login-template').html());
        },

        render: function() {
            this.$el.html(this.template());
            logger.info("Rendered LoginView");
            return this;
        },

        remove: function() {
            logger.info('LoginView removed');
            this.parentRemove();
        }
    })
})(app);