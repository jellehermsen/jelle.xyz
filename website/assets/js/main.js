var portfolio = [];
var imageIndex = 0;
var clientsWidth = 0;

$(document).ready(function(){
    var isHome = $('body').hasClass('index');
    if(isHome) {
        setupHome();
        setupBanners();
        rotateBanner('div.banner');
    }
    scrollClients();
    setupToolTips();
});

var setupBanners = function(){
    var banners = [
        'apps.png',
        'conferentie.png',
        'cursussysteem.png',
        'thuisinit.png'
    ];

    var html = '<a href="#" class="nextBanner"></a><a href="#" class="previousBanner"></a>';
    html += '<ul>';
    for (banner in banners) {
        html += '<li><img src="/assets/images/' + banners[banner] + '"/></li>';
    }
    html += '</ul>';
    $('div.banner').html(html).show();
};

var rotateBanner = function(selector){
    window.setInterval(function(){
        var banner = $(selector + ' li:last');
        banner.fadeOut(500, function(){
            banner.parent().prepend(banner);
            banner.show();
        });
    }, 5000);
};

var setupHome = function() {
    var output = '';
    $('article').each(function(){
        var item = {};
        item['title'] = $('header h1 a', this).html();
        item['descr'] = $('section div.description', this).html();
        item['thumb'] = $('section img.thumb', this).attr('data-src');
        item['images'] = [];
        $('section img:not(.thumb)', this).each(function(){
            item['images'].push($(this).attr('data-src'));
        });
        portfolio.push(item);
    });
    $('main').html('');

    setupPortfolio();
    setupArrows();
};

var homeResize = function(event) {
    var win = $(this);
    if (win.height() >= 820) { /* ... */ }
    if (win.width() >= 1280) { /* ... */ }
    var mainWidth = $('main').width();
    var windowWidth = win.width();
    if(windowWidth < 960) mainWidth = windowWidth;
    if(mainWidth < 600) {
        $('div.portfolio div.images, div#selected, div.portfolio div.description').attr('style','');
    } else {
        var imagesWidth = mainWidth * 0.625;
        var selectedHeight = mainWidth * 0.625 * 0.8;
        $('div.portfolio div.images').width(imagesWidth);
        $('div.portfolio div.images, div#selected').height(selectedHeight);
        $('div.portfolio div.description').width(mainWidth * 0.335);
        $('div.portfolio div.description').height(selectedHeight);
    }
};

var setupArrows = function() {
    $('a.arrow_left, a.arrow_right').click(function(event){
        event.preventDefault();
        event.stopPropagation();
        var images = $('div#selected div.images li');
        if(images.length == 1) return;
        var newIndex = imageIndex;
        if($(this).hasClass('arrow_left')) {
            newIndex--;
            if(newIndex == -1) newIndex = images.length - 1;
        } else {
            newIndex++;
            if(newIndex == images.length) newIndex = 0;
        }

        var oldImage = $(images[imageIndex]);
        var newImage = $(images[newIndex]);
        if($(this).hasClass('arrow_left')) {
            newImage.show().css('left', '-100%');
            newImage.animate({'left': '0px'}, 500);
            oldImage.animate({'left': '100%'}, 500, function(){
                $(this).hide(0).css('left', '0px'); 
            });
        } else {
            newImage.show().css('left', '100%');
            newImage.animate({'left': '0px'}, 500);
            oldImage.animate({'left': '-100%'}, 500, function(){
                $(this).hide(0).css('left', '0px'); 
            });
        }

        imageIndex = newIndex;
    });
};

var setupPortfolio = function() {
    var output = '<h2 class="portfolio">Portfolio</h2>';
    output += '<br class="clearfix"/><div class="portfolio">';
    output += '<div id="selected">';
    output += '<div class="images"><ul></ul><a href="#" class="arrow_left">&#xe805;</a>';
    output += '<a href="#" class="arrow_right">&#xe804;</a></div>';
    output += '<div class="description"></div>';
    output += '<a href="#" class="close">✖</a>';
    output += '<br class="clearfix" /></div>';
    output += '<ul class="items">';
    for(i in portfolio) {
        var item = portfolio[i];
        output += '<li data-id="' + i + '"><img src="' + item['thumb'] + '"/></li>';
    }
    output += '</ul><br class="clearfix"/></div>';
    $('main').html(output);
    $('div.portfolio li').click(portfolioClick);
    $('div.portfolio a.close').click(portfolioClose);
    $(window).on('resize', homeResize);
};

var portfolioClick = function(event) {
    homeResize();
    var item = portfolio[$(event.currentTarget).attr('data-id')];
    var images = $('#selected div.images ul');
    var description = $('#selected div.description');
    images.html('');
    description.html('');
    imageIndex = 0;

    for(i in item.images) {
        images.prepend('<li><img src="' + item.images[i] + '"/></li>');
    }

    description.html('<h4>' + item.title + '</h4>');
    description.append('<p>' + item.descr +'</p>');
    $('div#selected div.images li:first-child').show(0);
    if(item.images.length == 1) {
        $('.arrow_left, .arrow_right').hide(0);
    } else {
        $('.arrow_left, .arrow_right').show(0);
    }
    $('#selected').slideDown(300, function(){
        $(window).scrollTo('h2.portfolio', 300);
        $('#selected').addClass('forceShow');
    });
};

var portfolioClose = function(event) {
    $('#selected').removeClass('forceShow');
    $('#selected').slideUp(300);
};

var scrollClients = function() {
    $('#scroller li img').each(function(){
        var width = $(this).width();
        clientsWidth = clientsWidth + width + 30;
    });
    $('#scroller').width(clientsWidth);
    setInterval(scrollClient, 2000);
};

var scrollClient = function() {
    if($('#scroller').is(':hover')) return;
    var first = $('#scroller li:first-child');
    var width = first.width() + 30;
    $('#scroller').animate({'margin-left': '-' + width + 'px'}, 1000, 'swing', function(){
        $('#scroller').append(first[0]);
        $('#scroller').css('margin-left', '0px');
    }); 
};

var setupToolTips = function() {
    $('.masterToolTip').hover(function(){
        // Hover over code
        var title = $(this).attr('title');
        $(this).data('tipText', title).removeAttr('title');
        $('<p class="tooltip"></p>')
        .text(title)
        .appendTo('body')
        .fadeIn('slow');
    }, function() {
            // Hover out code
            $(this).attr('title', $(this).data('tipText'));
            $('.tooltip').remove();
    }).mousemove(function(e) {
            var mousex = e.pageX + 20; //Get X coordinates
            var mousey = e.pageY + 10; //Get Y coordinates
            $('.tooltip')
            .css({ top: mousey, left: mousex })
    });
};
