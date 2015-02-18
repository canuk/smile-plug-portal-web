(function (app) {
    var showWelcomeMsg = true;

    app.LoadingModalView = app.View.extend({
        initialize: function () {
            //only create template once, but ensure that creation takes place after app is loaded
            if (!this.template) app.LoadingModalView.prototype.template = this.template || _.template($('#loadingModal-template').html());
        },

        events: {
        },

        render: function (options) {
            this.$el.html(this.template({ msg: options.msg} ));
            var that = this;
            logger.info("LoadingModalView rendered");
            return this;
        },

        remove: function () {
            logger.info("LoadingModalView removed");
            this.parentRemove();
        }
    })
})(app);