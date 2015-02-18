(function (app) {
    var showWelcomeMsg = false;
    var img_dir = "assets/img/";
    app.HomeView = app.View.extend({
        initialize: function () {
            //only create template once, but ensure that creation takes place after app is loaded
            if (!this.template) app.HomeView.prototype.template = this.template || _.template($('#home-template').html());

            this.apps = [];
            this.apps.push({
                title: "Smile",
                id: "smile",
                image: img_dir + "smile_grey.png",
                description: "SMILE flips a traditional classroom into a highly interactive learning environment by engaging learners in critical reasoning and problem solving while enabling them to generate, share, and evaluate multimedia-rich inquiries."
            });
            this.apps.push({
                title: "Wikipedia",
                id: "wikipedia",
                image: img_dir + "wikipedia.png",
                description: "Wikipedia is the world's largest collaborative encyclopedia. This selection of articles for schools is searchable and contains 6000 articles, 26 million words and 50,000 images!"
            });
            this.apps.push({
                title: "KA-Lite",
                id: "khan",
                image: img_dir + "khan_academy.png",
                description: "KA Lite allows for blended learning opportunities using the core Khan Academy maths exercises."
            });
            this.apps.push({
                title: "Bible for Children",
                id: "bibleforchildren",
                image: img_dir + "bible-for-children.png",
                description: "Colorful stories from the Bible. Check back daily for a new inspiring devotional."
            });
            this.apps.push({
                title: "World English Bible",
                id: "webbible",
                image: img_dir + "web-bible.png",
                description: "The World English Bible. The Holy Bible tells you what you need to know and believe to be saved from sin and evil and how to live a life that is truly worth living, no matter what your current circumstances may be."
            });
            this.apps.push({
                title: "PhET",
                id: "phet",
                image: img_dir + "PhET-interactive-simulations.png",
                description: "Free educational simulations covering a diverse selection of topics designed by the University of Colorado"
            });
            this.apps.push({
                title: "Snap!",
                id: "snap",
                image: img_dir + "snap-byob.png",
                description: "Snap! (formerly BYOB) is a visual, drag-and-drop programming language. It is an extended reimplementation of Scratch (a project of the Lifelong Kindergarten Group at the MIT Media Lab) that allows you to Build Your Own Blocks. It also features first class lists, first class procedures, and continuations. These added capabilities make it suitable for a serious introduction to computer science for high school or college students."
            });
            this.apps.push({
                title: "Turtle Academy",
                id: "turtleacademy",
                image: img_dir + "turtle-academy.png",
                description: "The easy way to learn programming! Turtle Academy makes it surprisingly easy to start creating amazing shapes using the LOGO language."
            });
            this.apps.push({
                title: "Repl.it",
                id: "replit",
                image: img_dir + "replit.png",
                description: "Repl.it is an online environment for interactively exploring programming languages. The name comes from the read-eval-print loop, the interactive toplevel used by languages like Ruby, Lisp and Python."
            });
            this.apps.push({
                title: "Code Monster",
                id: "codemonster",
                image: img_dir + "code-monster.png",
                description: "Code Monster gets kids excited about programming. It is a combination of a game and tutorial where kids experiment with learning to code."
            });
            this.apps.push({
                title: "1001 Stories Project Bookshelf",
                id: "soebookshelf",
                image: img_dir + "soe-bookshelf.png",
                description: "Children love to tell stories. However, in many places in the world, their creative voices are rarely heard or cultivated. The 1001 Stories Program conducts storytelling workshops that build on children’s natural potential to become original storytellers."
            });
            this.apps.push({
                title: "Childrens Books",
                id: "childrensbook",
                image: img_dir + "childrens-books.png",
                description: "Colorful, free books for children (from Project Gutenberg) in PDF format."
            });
            this.apps.push({
                title: "Edify Draw and Paint",
                id: "paint",
                image: img_dir + "edify-draw-and-paint.png",
                description: "Create your own drawings and paintings!"
            });
            this.apps.push({
                title: "Project Gutenberg",
                id: "gutenberg",
                image: img_dir + "gutenberg.png",
                description: "Thousands of books in digital format (text) from Project Gutenberg. Organized by Bookshelves."
            });
            this.apps.push({
                title: "CK12",
                id: "ck12",
                image: img_dir + "ck12.png",
                description: "High quality and curated Textbooks collection on STEM (Science, Technology, Engineering and Math) from ck12.org. PDF format."
            });
            this.apps.push({
                title: "Bible",
                id: "bible",
                image: img_dir + "holy-bible.png",
                description: "The Revised Version, Standard American Edition of the Bible, more commonly known as the American Standard Version, is a version of the Bible that was first released in 1900."
            });
        },

        events: {
            'click .close': 'closeButton',
            'click .resource-btn': 'buttonPress',
            'click .resource-img img': 'buttonPress'
        },

        closeButton: function(ev) {
            var target = ev.target;
            var parent = target.parentElement.parentElement;
            logger.info("closed: " + parent.className);
            $(parent).remove();
            showWelcomeMsg = false;
        },

        buttonPress: function(ev) {
            console.log(ev);
            var id = ev.target.getAttribute("data-app-id");
            console.log(id);
            if (id == "smile") {
                logger.info("navigating to app smile");
                window.location = "http://smileglobal.net/";
            } else if (id == "wikipedia") {
                logger.info("navigating to wikipeda");
                window.location =  "http://schools-wikipedia.org/";
            } else if (id == "khan") {
                logger.info("navigating to khan");
                window.location =  "http://demo.learningequality.org/";
            } else if (id == "gutenberg") {
                logger.info("navigating to gutenberg");
                window.location =  window.location.origin + "/gutenberg/";
            } else if (id == "ck12") {
                logger.info("navigating to ck12");
                window.location =  window.location.origin + "/ck12/";
            } else if (id == "childrensbook") {
                logger.info("navigating to childrensbook");
                window.location =  window.location.origin + "/childrens-books/";
            } else if (id == "webbible") {
                logger.info("navigating to webbible");
                window.location =  window.location.origin + "/web-bible/";
            } else if (id == "bible") {
                logger.info("navigating to bible");
                window.location =  window.location.origin + "/bible/";
            } else if (id == "bibleforchildren") {
                logger.info("navigating to bibleforchildren");
                window.location =  window.location.origin + "/bible_for_children/";
            } else if (id == "paint") {
                logger.info("navigating to paint");
                window.location =  window.location.origin + "/paint/";
            } else if (id == "phet") {
                logger.info("navigating to phet");
                window.location =  window.location.origin + "/simulations/";
            } else if (id == "snap") {
                logger.info("navigating to snap");
                window.location =  "http://snap.berkeley.edu/snapsource/snap.html";
            } else if (id == "replit") {
                logger.info("navigating to replit");
                window.location =  "http://repl.it";
            } else if (id == "codemonster") {
                logger.info("navigating to codemonster");
                window.location =  "http://www.crunchzilla.com/code-monster";
            } else if (id == "turtleacademy") {
                logger.info("navigating to turtleacademy");
                window.location =  "http://turtleacademy.com/";
            } else if (id == "soebookshelf") {
                logger.info("navigating to soebookshelf");
                window.location =  window.location.origin + "/soe-bookshelf/";
            }
        },

        render: function (options) {
            //apps are defined in init
            this.$el.html(this.template({ showWelcomeMsg: showWelcomeMsg, apps: this.apps } ));
            var that = this;
            logger.info("HomeView rendered");
            return this;
        },

        remove: function () {
            logger.info("HomeView removed");
            this.parentRemove();
        }
    })
})(app);
