/**
 * This is the stage scrolling class
 * @author pete goodman - petegoodman.com
*/
var stageScroller = {

    // string : the type of tween to use
    // backEaseIn, backEaseOut, backEaseInOut, elasticEaseIn, elasticEaseOut, elasticEaseInOut, bounceEaseOut, bounceEaseIn,
    // bounceEaseInOut, regularEaseIn, regularEaseOut, regularEaseInOut, strongEaseIn, strongEaseOut, strongEaseInOut
    tweenType : Tween.elasticEaseInOut,

    // int : the length of time for each tween (in seconds)
    tweenTime : 3,

    // boolean : detect whether we are currently scrolling
    currentlyScrolling : false,

    // the setInterval js object for the main scroll (gets cleared and reset)
    scrollInterval : null,

    // object : the html stage container element
    stageContainer : null,

    // object : the html stage element
    stage : null,

    // array : container for all box html elements
    boxes : null,

    // int : time between each movement in milliseconds
    tweenTime : 50,

    // int : max amount of movement per movement in em
    maxTween : 50,

    // ints : the current position of the stage (x=left, y=top)
    stageX : 0,
    stageY : 0,

    // ints : the target position for the stage (x=left, y=top)
    targetX : 0,
    targetY : 0,

    // array : links out from the first (links) box to each individual box
    boxlinks : null,

    // array : links back from each individual box to the first (links) box
    backlinks : null,

    // object : the debugbox created by code
    debugbox : null,


    /*
     * initialisation function
     */
            init: function(tweenType, tweenTime) {

                // condition : change tween type
                if (tweenType != "") {
                    this.tweenType = tweenType;
                }

                // condition : change tween time
                if (tweenTime != "") {
                    this.tweenTime = tweenTime;
                }

                // get the stage container and set initial styles
                this.stageContainer = document.getElementById('stagecontainer');
                this.stageContainer.style.position = "relative";
                this.stageContainer.style.overflow = "visible";
                this.stageContainer.style.overflow = "hidden";


                // get the stage and set initial styles
                this.stage = document.getElementById('stage');
                this.stage.style.position = "relative";
                this.stage.style.width = "4000px";
                this.stage.style.height = "4000px";
                this.stage.style.right = this.stageX + "px";
                this.stage.style.bottom = this.stageY + "px";
                //this.stage.style.overflow = "hidden";


                // get all boxes
                this.boxes = document.querySelectorAll(".box");
                for (var x = 0; x < this.boxes.length; x++) {
                    this.boxes[x].style.position = "absolute";
                    this.boxes[x].top = Math.round(Math.cos((2 * Math.PI * x)/this.boxes.length) * 480);
                    this.boxes[x].left = Math.round(Math.sin((2 * Math.PI * x)/this.boxes.length) * 480);
                    this.boxes[x].style.left = this.boxes[x].left + "px";
                    this.boxes[x].style.top = this.boxes[x].top + "px";
                    this.boxes[x].style.zIndex = this.boxes.length - x;
                }

                //position the first box in the centre
                this.boxes[0].left = this.stageX;
                this.boxes[0].top = this.stageY;
                this.boxes[0].style.left = this.boxes[0].left + "px";
                this.boxes[0].style.top = this.boxes[0].top + "px";


                // get the links to each box
                this.boxlinks = this.boxes[0].getElementsByTagName('a');
                for (var i=0; i < this.boxlinks.length; i++) {

                    // set a value for the current box on the link
                    this.boxlinks[i].x = i;

                    // remove default link behaviour
                    this.boxlinks[i].onclick = function() { return false };

                    // go to the box!
                    this.boxlinks[i].addEventListener('click', this.goToBox, false);
                };


                // get all the back links
                this.backlinks = document.querySelectorAll('.back');
                for (var q=0; q < this.backlinks.length; q++) {

                    // set a value for the current box on the link
                    this.backlinks[q].x = q;

                    // remove default link behaviour
                    this.backlinks[q].onclick = function() { return false };

                    // go to the box!
                    this.backlinks[q].addEventListener('click', this.goFromBox, false);
                };


                // start debug
                this.debug('debug initialised');

            },


    /*
     * function to select a random number - for the box positioning
     */
            random: function(min, max) {
                return Math.floor(Math.random() * (max - min + 1) + min);
            },


    /*
     * function to initiate a scroll to a specific box from the centre
     */
            goToBox: function() {

                // if no scroll is currently going on
                if (!stageScroller.currentlyScrolling) {

                    // get the box in question
                    var box = stageScroller.boxes[this.x + 1];

                    // start the scroll to the box's location
                    stageScroller.scrollStage(box.left, box.top);

                    // debug
                    stageScroller.debug('scrolling to box ' + (this.x+1) + ', x:' + box.left + ', y:' + box.top);
                }
            },


    /*
     * function to initiate a scroll from a specific box back to centre
     */
            goFromBox: function() {

                // if no scroll is currently going on
                if (!stageScroller.currentlyScrolling) {

                    // get the home box
                    var homebox = stageScroller.boxes[0];

                    // start the scroll to the home box
                    stageScroller.scrollStage(homebox.left, homebox.top);

                    // debug
                    stageScroller.debug('heading back from box ' + (this.x+1));
                }
            },


    /*
     * function to start the scrolling of the stage from it's current position to point (x,y)
     */
            scrollStage: function(x, y) {

                // set the currently scrolling
                stageScroller.currentlyScrolling = true;

                // set the target location
                stageScroller.targetX = x;
                stageScroller.targetY = y;

                // start the scroll!
                t1 = new Tween(stageScroller.stage.style,'right',stageScroller.tweenType,stageScroller.stageX,stageScroller.targetX,stageScroller.tweenTime,'px');
                t2 = new Tween(stageScroller.stage.style,'bottom',stageScroller.tweenType,stageScroller.stageY,stageScroller.targetY,stageScroller.tweenTime,'px');

                t1.onMotionFinished = function() {
                    stageScroller.currentlyScrolling = false;
                    stageScroller.stageX = stageScroller.targetX;
                    stageScroller.stageY = stageScroller.targetY;
                    this.onMotionFinished = undefined;
                };
                t1.start();
                t2.start();

                //debug
                stageScroller.debug('targetX = ' + stageScroller.targetX + ", stageX = " + stageScroller.stageX);
            },

    /*
     * function to create a debugbox and add message
     */
            debug: function(newmessage) {

                // if debugbox doesn't exist, create it
                if (stageScroller.debugbox == null) {

                    //get the body element
                    var body = document.getElementsByTagName("body")[0];

                    //create the new html element
                    stageScroller.debugbox = document.createElement('div');
                    stageScroller.debugbox.id = "debugbox";
                    stageScroller.debugbox.style.height = "10%";
                    stageScroller.debugbox.style.position = "absolute";
                    stageScroller.debugbox.style.bottom = "2em";
                    stageScroller.debugbox.style.right = "2em";
                    stageScroller.debugbox.style.left = "2em";
                    stageScroller.debugbox.style.overflow = "scroll";
                    stageScroller.debugbox.style.border = "1px solid #f90";
                    stageScroller.debugbox.style.padding = "1em";
                    stageScroller.debugbox.style.zindex = "9999";

                    //add the new html element to the document
                    //body.appendChild(stageScroller.debugbox);

                }

                // add message to debugbox
                var message = document.createElement('p');
                var messagetxt = document.createTextNode("> " + newmessage);
                message.appendChild(messagetxt);
                stageScroller.debugbox.insertBefore(message, stageScroller.debugbox.firstChild);

            }
}