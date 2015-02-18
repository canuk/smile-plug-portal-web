(function (app) {
    var showWelcomeMsg = true;

    app.UsbView = app.View.extend({
        initialize: function () {
            //only create template once, but ensure that creation takes place after app is loaded
            if (!this.template) app.UsbView.prototype.template = this.template || _.template($('#usb-template').html());
        },

        events: {
            'click #storage1-btn': 'btnClick',
            'click #storage2-btn': 'btnClick'
        },

        tabClick: function(ev) {
            var target = ev.target.id;
            $("#storage1-tab").removeClass("active");
            $("#storage2-tab").removeClass("active");
            $("#storage1-btn").removeClass("active");
            $("#storage2-btn").removeClass("active");
            if (target == "storage1-btn") {
                $("#storage1-tab").addClass("active");
                $("#storage1-btn").addClass("active");
            } else if (target == "storage2-btn") {
                $("#storage2-tab").addClass("active");
                $("#storage2-btn").addClass("active");
            }
        },

        btnClick: function(ev) {
            var target = ev.target.id;
            if (target == "storage1-btn") {
                logger.info("navigating to storage1");
                app.showLoadingModal({ "text": "Loading /storage1" });
                window.location = "/storage1";
            } else if (target == "storage2-btn") {
                app.showLoadingModal({ "text": "Loading /storage2" });
                logger.info("navigating to storage2");
                window.location = "/storage2";
            }
        },

        render: function (options) {
            this.$el.html(this.template());
            var that = this;
            logger.info("UsbView rendered");
            return this;
        },

        remove: function () {
            logger.info("UsbView removed");
            this.parentRemove();
        }
    })
})(app);