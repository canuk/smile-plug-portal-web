(function(app) {
    app.AboutView = app.View.extend({
        initialize: function() {
            //only create template once, but ensure that creation takes place after app is loaded
            if (!this.template) app.AboutView.prototype.template = this.template || _.template($('#about-template').html());
        },
        render: function() {
            this.$el.html(this.template());
            logger.info("AboutView rendered");

            return this;
        },

        remove: function() {
            logger.info("AboutView removed");
            this.parentRemove();
        }
    })
})(app);