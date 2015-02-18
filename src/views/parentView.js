(function (app) {
    app.View = Backbone.View.extend({
        fetchError: function (msg, response, retryFunc) {
            var code = response.status;
            logger.info("Error code: " + code);
        },
        parentRemove: function() {
            //$('.loading').removeClass("error");
            //if (this.timer) clearTimeout(this.timer);
            this.undelegateEvents();
        }
    });
})(app);