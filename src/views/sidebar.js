(function(app) {
    app.SidebarView = app.View.extend({
        events: {
        },

        initialize: function() {
            //only create template once, but ensure that creation takes place after app is loaded
            if (!this.template) app.SidebarView.prototype.template = this.template || _.template($('#sidebar-template').html());
        },

        render: function() {
            this.$el.html(this.template());
            logger.info("Rendered Sidebar");

            return this;
        },

        remove: function() {
            logger.info('Sidebar removed');
            this.parentRemove();
        }
    })
})(app);