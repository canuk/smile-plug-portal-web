(function(app) {
    app.LoginBoxView = app.View.extend({
        events: {
            'click #login-btn': 'buttonPress',
            'click #register-btn': 'buttonPress'
        },

        initialize: function() {
            //only create template once, but ensure that creation takes place after app is loaded
            if (!this.template) app.LoginBoxView.prototype.template = this.template || _.template($('#loginBox-template').html());
        },

        render: function() {
            this.$el.html(this.template({ loggedIn: false }));
            logger.info("Rendered LoginBox");
            return this;
        },

        remove: function() {
            logger.info('LoginBox removed');
            this.parentRemove();
        },

        buttonPress: function (ev) {
            var id = ev.target.id;
            if (id == "login-btn") {
                app.showLoginModal();
            } else if (id == "register-btn") {

            }
        }
    })
})(app);