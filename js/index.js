/*Déclaration variable globals--------------------------------------------------*/
var vid = document.getElementById('v0'),
        time = $('#time'),
        scroll = $('#scroll'),
        windowheight = $(window).height() - 20,
        playbackConst = 150,
        scrollpos = window.pageYOffset / playbackConst,
        targetscrollpos = scrollpos,
        accel = 0,
        setHeight = document.getElementById("set-height"),
        accelamount = 0.25,
        arrayContent = [],
        arrayTimer = [],
        isDisplay = false,
        lId = 0;

/*Fonction Debounce-------------------------------------------------------------*/
function debounce(func, wait, immediate) {
    var timeout;
    return function () {
        var context = this, args = arguments;
        var later = function () {
            timeout = null;
            if (!immediate)
                func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow)
            func.apply(context, args);
    };
}
;
/*Fonction calcule dynamique de la hauteur de la page---------------------------*/
vid.addEventListener('loadedmetadata', function () {
    setHeight.style.height = (Math.floor(vid.duration) + 7) * playbackConst + "px";
});

/*Fonction récuperation des données du Json-------------------------------------*/
$.getJSON("js/test.json", function (json) {
    monArray = json["ArrayList"];
    for (var i = 0; i < monArray.length; i++) {
        var timeAp = monArray[i].timeAp;
        var timeDis = monArray[i].timeDis;
        var id = monArray[i].id;
        var leTexte = monArray[i].leTexte;
        var top = monArray[i].top;
        var left = monArray[i].left;
        var anim = monArray[i].anim;
        var idImg = monArray[i].idImg;
        var src = monArray[i].src;
        var maClass = monArray[i].class;
        var content = {timeAp: timeAp, timeDis: timeDis, id: id, leTexte: leTexte, top: top, left: left,
            anim: anim, idImg: idImg, src: src, maClass: maClass};
        var timer = {timeAp: timeAp, timeDis: timeDis, id: id};
        arrayContent.push(content);
        arrayTimer.push(timer);
    }
});

/*Fonction action onScroll------------------------------------------------------*/
vid.pause();
var scrollHandler = debounce(function () {
    targetscrollpos = window.pageYOffset / 150;
//    console.log(vid.currentTime);
    if(vid.currentTime > 1.3){
         $('.logoPosApple').fadeOut(250);
    }
    else if(vid.currentTime < 1.3){
        $('.logoPosApple').fadeIn(100);
    }
    arrayTimer.forEach(function (time) {
        if (vid.currentTime >= time.timeAp && vid.currentTime <= time.timeDis) {
            var el = arrayContent[time.id];
            lId = time.id;
            if (isDisplay == false) {
                if (arrayContent[lId].src == null) {
                    var e = $('<span id="texte' + time.id + '">' + el.leTexte + '</span>');
                    $(e).attr('style', 'top: ' + el.top + '%; left: ' + el.left + '%;').attr('class', el.anim);
                    $('.container').append(e);
                    isDisplay = true;
                } else {
                    var i = $('<div class="' + el.maClass + '"><img id="' + el.idImg + '" src="' + el.src + '"></div>');
                    $('.container').append(i);
                    isDisplay = true;
                }
            }
        }
    });
    if ((vid.currentTime < arrayContent[lId].timeAp || vid.currentTime > arrayContent[lId].timeDis) && isDisplay == true) {
        $('#texte' + lId).fadeOut(500, function () {
            $(this).remove();
        });
        $('.' + arrayContent[lId].maClass).fadeOut(500, function () {
            $(this).remove();
        });
        isDisplay = false;
    }
}, 15);
window.addEventListener('scroll', scrollHandler);

/*Fonction setInterval diffusion vidéo au scroll--------------------------------*/
setInterval(function () {
    //Accelerate towards the target:
    scrollpos += (targetscrollpos - scrollpos) * accelamount;
    //update video playback
    vid.currentTime = scrollpos;
    vid.pause();
}, 40);


  