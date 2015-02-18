(function () {
    app.Model = Backbone.Model.extend({
        fetchError: function (msg, response, endFunc) {
            var code = response.status;
            logger.error("FetchError: " + code + ". " + response);
            //default go to login page
            if (code == 401 || code == 403) {
                app.router.navigate("login", {trigger: true, replace: true});
            } else {
                //display error message

            }
        }
    });
})();