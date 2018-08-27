// import inView from 'in-view';
const inView = require("in-view");

class AnimatedTitle {
    constructor() {
        this.animTime = 500;//in milliseconds
        this.animateOnReEnter = false;
        this.startFromBlank = false;
        this.waveAnimate = true;

        this.setupDone = false;
        this.chars = ["¡","¢","ø","†","∂","ƒ","∫","≈"];
        this.titleCnt = 0;
    }

    setup() {
        if($('.animatedTitle').length > 0){
            //setup
            let scope = this;
            $('.animatedTitle').each(function(){
                var title = $(this);

                title.data("title",title.html());
                if(!scope.waveAnimate)scope.setupTitle(title);
                scope.animateTitle(title);

                title.addClass('animatedTitle-'+scope.titleCnt);

                inView('.animatedTitle-'+scope.titleCnt).on('enter', function(){
                    scope.animateTitle(title);
                });

                scope.titleCnt++;
            });

            this.setupDone = true;
        }
    }

    getRandomCharacter() {
        return this.chars[Math.floor(Math.random()*this.chars.length)];
    }

    setupTitle(title) {
        if(title){
            var characters = title.text().split("");
            title.css("min-height",title.height());
            title.empty();

            let scope = this;
            $.each(characters, function (i, el) {
                if(el != " "){
                    if(scope.startFromBlank){
                        el = "&nbsp;";
                    }else{
                        if(scope.waveAnimate){
                            if(i == 0){
                                el = scope.getRandomCharacter();
                            }else{
                                el = characters[i];
                            }
                        }else{
                            el = scope.getRandomCharacter();
                        }
                    }
                }
                title.append("<span>" + el + "</span");
            });

        }else{
            console.error('(FROM AnimatedTitle/setupTitle) No Title Object Given');
        }
    }

    animateTitle(title) {
        if(title){

            let animate = true;
            if(title.data("animated") && !this.animateOnReEnter){
                animate = false;
            }
            if(!this.setupDone){
                animate = false;
            }

            if(animate){
                let scope = this;

                setTimeout(function(){
                    if(scope.waveAnimate)scope.setupTitle(title);
                    let spans = title.find('span');

                    if(scope.animateOnReEnter){
                        title.find('span').each(function(i, el){
                            if($(this).html() != " "){
                                $(this).html(scope.getRandomCharacter());
                            }
                        });
                    }

                    var speed = scope.animTime / spans.length;

                    global.utils.interval(function(){
                        scope.swapCharacter(title);
                    },speed,spans.length+1);
                    spans = null;
                },300);

                title.data("animated", true);
            }

        }else{
            console.error('(FROM AnimatedTitle/animateTitle) No Title Object Given');
        }
    }

    swapCharacter(title){
        if(title){
            let scope = this;
            let spans = title.find('span');
            title.find('span').each(function(i, el){
                if($(this).html() != title.data("title").split("")[i]){
                    $(this).html(title.data("title").split("")[i]);

                    if(spans[i+1]){
                        if(spans.eq(i+1).html() != " "){
                            spans.eq(i+1).html(scope.getRandomCharacter());
                        }
                    }
                    if(spans[i+2]){
                        if(spans.eq(i+2).html() != " "){
                            spans.eq(i+2).html(scope.getRandomCharacter());
                        }
                    }
                    //$(this).html(scope.chars[Math.floor(Math.random()*scope.chars.length)]);
                    return false;
                }
            });
            spans = null;

        }else{
            console.error('(FROM AnimatedTitle/swapCharacter) No Title Object Given');
        }
    }

    destroy() {
        if(this.setupDone){
            //destroy / cleanup

            $('.animatedTitle').each(function(){
                if($(this).data("title")){
                    if($(this).data("title") != ""){
                        $(this).html($(this).data("title"));
                        $(this).data("title",null);
                        $(this).data("animated",null);
                    }
                }
            });

            this.setupDone = false;
        }
    }

}

module.exports = { AnimatedTitle };
