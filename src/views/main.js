(function (app) {
    app.MainView = app.View.extend({
        initialize: function (options) {
            return this;
        },

        render: function (options) {
            options = options || {};
            if (options.content) this.content = options.content;

            //render content
            if (options.content != false && options.content != undefined) {
                logger.info("Rendering app content");
                this.content.setElement(this.$('#app-content')).render();
            }
            //render navbar if no navbar
            if (!this.navbar) {
                logger.info("Rendering app navbar");
                this.navbar = new app.NavbarView();
                this.navbar.setElement(this.$('#app-header')).render();
            }

            //render sidebar if no sidebar
            if (!this.sidebar) {
                logger.info("Rendering app sidebar");
                this.sidebar = new app.SidebarView();
                this.sidebar.setElement(this.$('#app-sidebar')).render();
                //call AceAdmin init functions
                ace_admin_init();
                init_address_bar_hider(app);
            }

            return this;
        }
    });
    function init_address_bar_hider(app) {
        app.hideAddressBar = function () {
            if (!window.location.hash) {
                if (document.height < window.outerHeight) {
                    document.body.style.height = (window.outerHeight + 50) + 'px';
                }
                setTimeout(function () {
                    window.scrollTo(0, 1);
                }, 50);
            }
        }

        window.addEventListener("load", function () {
            if (!window.pageYOffset) {
                app.hideAddressBar();
            }
        });
        window.addEventListener("orientationchange", app.hideAddressBar);
    }

    function ace_admin_init() {
        if (!('ace' in window)) window['ace'] = {}
        ace.handle_side_menu = function ($) {
            $('#menu-toggler').on(ace.click_event, function () {
                $('#sidebar').toggleClass('display');
                $(this).toggleClass('display');
                return false;
            });
            //mini
            var $minimized = $('#sidebar').hasClass('menu-min');
            $('#sidebar-collapse').on(ace.click_event, function () {
                $minimized = $('#sidebar').hasClass('menu-min');
                ace.settings.sidebar_collapsed(!$minimized);//@ ace-extra.js
            });

            var touch = "ontouchend" in document;
            //opening submenu
            $('.nav-list').on(ace.click_event, function (e) {
                //check to see if we have clicked on an element which is inside a .dropdown-toggle element?!
                //if so, it means we should toggle a submenu
                var link_element = $(e.target).closest('a');
                if (!link_element || link_element.length == 0) return;//if not clicked inside a link element

                $minimized = $('#sidebar').hasClass('menu-min');

                if (!link_element.hasClass('dropdown-toggle')) {//it doesn't have a submenu return
                    //just one thing before we return
                    //if sidebar is collapsed(minimized) and we click on a first level menu item
                    //and the click is on the icon, not on the menu text then let's cancel event and cancel navigation
                    //Good for touch devices, that when the icon is tapped to see the menu text, navigation is cancelled
                    //navigation is only done when menu text is tapped
                    if ($minimized && ace.click_event == "tap" &&
                        link_element.get(0).parentNode.parentNode == this /*.nav-list*/)//i.e. only level-1 links
                    {
                        var text = link_element.find('.menu-text').get(0);
                        if (e.target != text && !$.contains(text, e.target))//not clicking on the text or its children
                            return false;
                    }

                    return;
                }
                //
                var sub = link_element.next().get(0);

                //if we are opening this submenu, close all other submenus except the ".active" one
                if (!$(sub).is(':visible')) {//if not open and visible, let's open it and make it visible
                    var parent_ul = $(sub.parentNode).closest('ul');
                    if ($minimized && parent_ul.hasClass('nav-list')) return;

                    parent_ul.find('> .open > .submenu').each(function () {
                        //close all other open submenus except for the active one
                        if (this != sub && !$(this.parentNode).hasClass('active')) {
                            $(this).slideUp(200).parent().removeClass('open');

                            //uncomment the following line to close all submenus on deeper levels when closing a submenu
                            //$(this).find('.open > .submenu').slideUp(0).parent().removeClass('open');
                        }
                    });
                } else {
                    //uncomment the following line to close all submenus on deeper levels when closing a submenu
                    //$(sub).find('.open > .submenu').slideUp(0).parent().removeClass('open');
                }

                if ($minimized && $(sub.parentNode.parentNode).hasClass('nav-list')) return false;

                $(sub).slideToggle(200).parent().toggleClass('open');
                return false;
            })
        }
        ace.general_things = function ($) {
            $('.ace-nav [class*="icon-animated-"]').closest('a').on('click', function () {
                var icon = $(this).find('[class*="icon-animated-"]').eq(0);
                var $match = icon.attr('class').match(/icon\-animated\-([\d\w]+)/);
                icon.removeClass($match[0]);
                $(this).off('click');
            });
        }
        jQuery(function ($) {
            //at some places we try to use 'tap' event instead of 'click' if jquery mobile plugin is available
            window['ace'].click_event = $.fn.tap ? "tap" : "click";
        });

        jQuery(function ($) {
            //ace.click_event defined in ace-elements.js
            ace.handle_side_menu(jQuery);

            ace.general_things(jQuery);//and settings

            /**
             //make sidebar scrollbar when it is fixed and some parts of it is out of view
             //>> you should include jquery-ui and slimscroll javascript files in your file
             //>> you can call this function when sidebar is clicked to be fixed
             $('.nav-list').slimScroll({
                height: '400px',
                distance:0,
                size : '6px'
            });
             */
        });
    }
})(app);