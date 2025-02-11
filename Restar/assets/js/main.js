(function ($) {
    "use strict";
    /*=================================
        JS Index Here
    ==================================*/
    /*
    01. On Load Function
    02. Preloader
    03. Mobile Menu
    04. Sticky fix
    05. Scroll To Top
    06. Set Background Image Color & Mask
    07. Global Slider
    08. Slider Tab
    09. Ajax Contact Form
    10. Popup Sidemenu
    11. Magnific Popup
    12. Section Position
    13. Filter
    14. Counter Up
    15. Shape Mockup
    16. Progress Bar Animation
    17. Countdown
    18. Date Time Picker
    19. Button Style
    00. Color Scheme
    00. Woocommerce Toggle
    00. Right Click Disable
    */
    /*=================================
        JS Index End
    ==================================*/
    /*

  /*---------- 01. On Load Function ----------*/
    $(window).on("load", function () {
        $(".preloader").fadeOut();
        $(".swiper-fade").addClass('fade-ani');
    });

    /*---------- 02. Preloader ----------*/
    if ($(".preloader").length > 0) {
        $(".preloaderCls").each(function () {
            $(this).on("click", function (e) {
                e.preventDefault();
                $(".preloader").css("display", "none");
            });
        });
    }

    /*---------- 03. Mobile Menu ----------*/
    $.fn.thmobilemenu = function (options) {
        var opt = $.extend(
            {
                menuToggleBtn: ".th-menu-toggle",
                bodyToggleClass: "th-body-visible",
                subMenuClass: "th-submenu",
                subMenuParent: "menu-item-has-children",
                thSubMenuParent: "th-item-has-children",
                subMenuParentToggle: "th-active",
                meanExpandClass: "th-mean-expand",
                appendElement: '<span class="th-mean-expand"></span>',
                subMenuToggleClass: "th-open",
                toggleSpeed: 400,
            },
            options
        );
    
        return this.each(function () {
            var menu = $(this); // Select menu
    
            // Menu Show & Hide
            function menuToggle() {
                menu.toggleClass(opt.bodyToggleClass);
    
                // collapse submenu on menu hide or show
                var subMenu = "." + opt.subMenuClass;
                $(subMenu).each(function () {
                    if ($(this).hasClass(opt.subMenuToggleClass)) {
                        $(this).removeClass(opt.subMenuToggleClass);
                        $(this).css("display", "none");
                        $(this).parent().removeClass(opt.subMenuParentToggle);
                    }
                });
            }
    
            // Class Set Up for every submenu
            menu.find("." + opt.subMenuParent).each(function () {
                var submenu = $(this).find("ul");
                submenu.addClass(opt.subMenuClass);
                submenu.css("display", "none");
                $(this).addClass(opt.subMenuParent);
                $(this).addClass(opt.thSubMenuParent); // Add th-item-has-children class
                $(this).children("a").append(opt.appendElement);
            });
    
            // Toggle Submenu
            function toggleDropDown($element) {
                var submenu = $element.children("ul");
                if (submenu.length > 0) {
                    $element.toggleClass(opt.subMenuParentToggle);
                    submenu.slideToggle(opt.toggleSpeed);
                    submenu.toggleClass(opt.subMenuToggleClass);
                }
            }
    
            // Submenu toggle Button
            var itemHasChildren = "." + opt.thSubMenuParent + " > a";
            $(itemHasChildren).each(function () {
                $(this).on("click", function (e) {
                    e.preventDefault();
                    toggleDropDown($(this).parent());
                });
            });
    
            // Menu Show & Hide On Toggle Btn click
            $(opt.menuToggleBtn).each(function () {
                $(this).on("click", function () {
                    menuToggle();
                });
            });
    
            // Hide Menu On outside click
            menu.on("click", function (e) {
                e.stopPropagation();
                menuToggle();
            });
    
            // Stop Hide full menu on menu click
            menu.find("div").on("click", function (e) {
                e.stopPropagation();
            });
        });
    };
    
    $(".th-menu-wrapper").thmobilemenu();

    /*---------- 04. Sticky fix ----------*/
    $(window).scroll(function () {
        var topPos = $(this).scrollTop();
        if (topPos > 500) {
            $('.sticky-wrapper').addClass('sticky');
            $('.category-menu').addClass('close-category');
        } else {
            $('.sticky-wrapper').removeClass('sticky')
            $('.category-menu').removeClass('close-category');
        }
    })

    /*---------- 05. Scroll To Top ----------*/
    if ($('.scroll-top').length > 0) {
        
        var scrollTopbtn = document.querySelector('.scroll-top');
        var progressPath = document.querySelector('.scroll-top path');
        var pathLength = progressPath.getTotalLength();
        progressPath.style.transition = progressPath.style.WebkitTransition = 'none';
        progressPath.style.strokeDasharray = pathLength + ' ' + pathLength;
        progressPath.style.strokeDashoffset = pathLength;
        progressPath.getBoundingClientRect();
        progressPath.style.transition = progressPath.style.WebkitTransition = 'stroke-dashoffset 10ms linear';		
        var updateProgress = function () {
            var scroll = $(window).scrollTop();
            var height = $(document).height() - $(window).height();
            var progress = pathLength - (scroll * pathLength / height);
            progressPath.style.strokeDashoffset = progress;
        }
        updateProgress();
        $(window).scroll(updateProgress);	
        var offset = 50;
        var duration = 750;
        jQuery(window).on('scroll', function() {
            if (jQuery(this).scrollTop() > offset) {
                jQuery(scrollTopbtn).addClass('show');
            } else {
                jQuery(scrollTopbtn).removeClass('show');
            }
        });				
        jQuery(scrollTopbtn).on('click', function(event) {
            event.preventDefault();
            jQuery('html, body').animate({scrollTop: 0}, duration);
            return false;
        })
    }

    /*---------- 06. Set Background Image Color & Mask ----------*/
    if ($("[data-bg-src]").length > 0) {
        $("[data-bg-src]").each(function () {
            var src = $(this).attr("data-bg-src");
            $(this).css("background-image", "url(" + src + ")");
            $(this).removeAttr("data-bg-src").addClass("background-image");
        });
    }

    if ($('[data-bg-color]').length > 0) {
        $('[data-bg-color]').each(function () {
          var color = $(this).attr('data-bg-color');
          $(this).css('background-color', color);
          $(this).removeAttr('data-bg-color');
        });
    };

    $('[data-border]').each(function() {
        var borderColor = $(this).data('border');
        $(this).css('--th-border-color', borderColor);
    });
      
    if ($('[data-mask-src]').length > 0) {
        $('[data-mask-src]').each(function () {
          var mask = $(this).attr('data-mask-src');
          $(this).css({
            'mask-image': 'url(' + mask + ')',
            '-webkit-mask-image': 'url(' + mask + ')'
          });
          $(this).addClass('bg-mask');
          $(this).removeAttr('data-mask-src');
        });
    };

    /*----------- 07. Global Slider ----------*/

    $('.th-slider').each(function () {

        var thSlider = $(this);
        var settings = $(this).data('slider-options');

        // Store references to the navigation Slider
        var prevArrow = thSlider.find('.slider-prev');
        var nextArrow = thSlider.find('.slider-next');
        var paginationEl = thSlider.find('.slider-pagination');

        var autoplayconditon = settings['autoplay'];

        var sliderDefault = {
            slidesPerView: 1,
            spaceBetween: settings['spaceBetween'] ? settings['spaceBetween'] : 30,
            loop: settings['loop'] == false ? false : true,
            speed: settings['speed'] ? settings['speed'] : 1000,
            autoplay: autoplayconditon ? autoplayconditon : {delay: 6000, disableOnInteraction: false},
            navigation: {
                nextEl: nextArrow.get(0),
                prevEl: prevArrow.get(0),  
            },
            pagination: {
                el: paginationEl.get(0),
                clickable: true, 
                renderBullet: function (index, className) {
                    return '<span class="' + className + '" aria-label="Go to Slide ' + (index + 1) + '"></span>';
                },
            },
        };

        var options = JSON.parse(thSlider.attr('data-slider-options'));
        options = $.extend({}, sliderDefault, options);
        var swiper = new Swiper(thSlider.get(0), options); // Assign the swiper variable

        if ($('.slider-area').length > 0) {
            $('.slider-area').closest(".container").parent().addClass("arrow-wrap");
        }

        if (thSlider.hasClass('slider-tab')) {
            var swiperTab = new Swiper(thSlider.get(0), options);
        } else if (thSlider.hasClass('tab-view')) {
            var swiperView = new Swiper(thSlider.get(0), options);
        } else {
            var swiper = new Swiper(thSlider.get(0), options); // Assign the swiper variable
        }
        
        if (swiperView & swiperTab) {
            swiperView.controller.control = swiperTab;
            swiperTab.controller.control = swiperView;
        }

    });

    // Function to add animation classes
    function animationProperties() {
        $('[data-ani]').each(function () {
            var animationName = $(this).data('ani');
            $(this).addClass(animationName);
        });

        $('[data-ani-delay]').each(function () {
            var delayTime = $(this).data('ani-delay');
            $(this).css('animation-delay', delayTime);
        });
    }
    animationProperties();

    // Add click event handlers for external slider arrows based on data attributes
    $('[data-slider-prev], [data-slider-next]').on('click', function () {
        var sliderSelectors = ($(this).data('slider-prev') || $(this).data('slider-next')).split(', ');

        sliderSelectors.forEach(function(sliderSelector) {
            var targetSlider = $(sliderSelector);

            if (targetSlider.length) {
                var swiper = targetSlider[0].swiper;

                if (swiper) {
                    if ($(this).data('slider-prev')) {
                        swiper.slidePrev(); 
                    } else {
                        swiper.slideNext(); 
                    }
                }
            }
        });
    });

    /*-------------- 08. Slider Tab -------------*/
    $.fn.activateSliderThumbs = function (options) {
        var opt = $.extend(
            {
                sliderTab: false,
                tabButton: ".tab-btn",
            },
            options
        );
    
        return this.each(function () {
            var $container = $(this);
            var $thumbs = $container.find(opt.tabButton);
            var $line = $('<span class="indicator"></span>').appendTo($container);
    
            var sliderSelector = $container.data("slider-tab");
            var $slider = $(sliderSelector);
    
            var swiper = $slider[0].swiper;
    
            $thumbs.on("click", function (e) {
                e.preventDefault();
                var clickedThumb = $(this);
    
                clickedThumb.addClass("active").siblings().removeClass("active");
                linePos(clickedThumb, $container);
    
                clickedThumb.prevAll(opt.tabButton).addClass('list-active');
                clickedThumb.nextAll(opt.tabButton).removeClass('list-active');
    
                if (opt.sliderTab) {
                    var slideIndex = clickedThumb.index();
                    swiper.slideTo(slideIndex);
                }
            });
    
            if (opt.sliderTab) {
                swiper.on("slideChange", function () {
                    var activeIndex = swiper.realIndex;
                    var $activeThumb = $thumbs.eq(activeIndex);
    
                    $activeThumb.addClass("active").siblings().removeClass("active");
                    linePos($activeThumb, $container);
    
                    $activeThumb.prevAll(opt.tabButton).addClass('list-active');
                    $activeThumb.nextAll(opt.tabButton).removeClass('list-active');
                });
    
                var initialSlideIndex = swiper.activeIndex;
                var $initialThumb = $thumbs.eq(initialSlideIndex);
                $initialThumb.addClass("active").siblings().removeClass("active");
                linePos($initialThumb, $container);

                $initialThumb.prevAll(opt.tabButton).addClass('list-active');
                $initialThumb.nextAll(opt.tabButton).removeClass('list-active');
            }
    
            function linePos($activeThumb) {
                var thumbOffset = $activeThumb.position();
    
                var marginTop = parseInt($activeThumb.css('margin-top')) || 0;
                var marginLeft = parseInt($activeThumb.css('margin-left')) || 0;
    
                $line.css("--height-set", $activeThumb.outerHeight() + "px");
                $line.css("--width-set", $activeThumb.outerWidth() + "px");
                $line.css("--pos-y", thumbOffset.top + marginTop + "px");
                $line.css("--pos-x", thumbOffset.left + marginLeft + "px");
            }
        });
    };
    
    if ($(".hero-thumb").length) {
        $(".hero-thumb").activateSliderThumbs({
            sliderTab: true,
            tabButton: ".tab-btn",
        });
    }

    /*----------- 09. Ajax Contact Form ----------*/
    var form = ".ajax-contact";
    var invalidCls = "is-invalid";
    var $email = '[name="email"]';
    var $validation =
        '[name="name"],[name="email"],[name="subject"],[name="number"],[name="message"]'; // Must be use (,) without any space
    var formMessages = $(".form-messages");

    function sendContact() {
        var formData = $(form).serialize();
        var valid;
        valid = validateContact();
        if (valid) {
            jQuery
                .ajax({
                    url: $(form).attr("action"),
                    data: formData,
                    type: "POST",
                })
                .done(function (response) {
                    // Make sure that the formMessages div has the 'success' class.
                    formMessages.removeClass("error");
                    formMessages.addClass("success");
                    // Set the message text.
                    formMessages.text(response);
                    // Clear the form.
                    $(
                        form +
                            ' input:not([type="submit"]),' +
                            form +
                            " textarea"
                    ).val("");
                })
                .fail(function (data) {
                    // Make sure that the formMessages div has the 'error' class.
                    formMessages.removeClass("success");
                    formMessages.addClass("error");
                    // Set the message text.
                    if (data.responseText !== "") {
                        formMessages.html(data.responseText);
                    } else {
                        formMessages.html(
                            "Oops! An error occured and your message could not be sent."
                        );
                    }
                });
        }
    }

    function validateContact() {
        var valid = true;
        var formInput;

        function unvalid($validation) {
            $validation = $validation.split(",");
            for (var i = 0; i < $validation.length; i++) {
                formInput = form + " " + $validation[i];
                if (!$(formInput).val()) {
                    $(formInput).addClass(invalidCls);
                    valid = false;
                } else {
                    $(formInput).removeClass(invalidCls);
                    valid = true;
                }
            }
        }
        unvalid($validation);

        if (
            !$($email).val() ||
            !$($email)
                .val()
                .match(/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/)
        ) {
            $($email).addClass(invalidCls);
            valid = false;
        } else {
            $($email).removeClass(invalidCls);
            valid = true;
        }
        return valid;
    }

    $(form).on("submit", function (element) {
        element.preventDefault();
        sendContact();
    });

    /*---------- 10. Popup Sidemenu ----------*/
    function popupSideMenu($sideMenu, $sideMunuOpen, $sideMenuCls, $toggleCls) {
        // Sidebar Popup
        $($sideMunuOpen).on('click', function (e) {
        e.preventDefault();
        $($sideMenu).addClass($toggleCls);
        });
        $($sideMenu).on('click', function (e) {
        e.stopPropagation();
        $($sideMenu).removeClass($toggleCls)
        });
        var sideMenuChild = $sideMenu + ' > div';
        $(sideMenuChild).on('click', function (e) {
        e.stopPropagation();
        $($sideMenu).addClass($toggleCls)
        });
        $($sideMenuCls).on('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        $($sideMenu).removeClass($toggleCls);
        });
    };
    popupSideMenu( ".popup-search-box", ".searchBoxToggler", ".searchClose", "show" );
    popupSideMenu('.sidemenu-cart', '.sideMenuToggler', '.sideMenuCls', 'show');
    popupSideMenu('.sidemenu-info', '.sideMenuInfo', '.sideMenuCls', 'show');

    /*----------- 11. Magnific Popup ----------*/
    /* magnificPopup img view */
    $(".popup-image").magnificPopup({
        type: "image",
        mainClass: 'mfp-zoom-in', 
        removalDelay: 260,
        gallery: {
            enabled: true,
        },
    });

    /* magnificPopup video view */
    $(".popup-video").magnificPopup({
        type: "iframe",
    });

    /* magnificPopup video view */
    $(".popup-content").magnificPopup({
        type: "inline",
        midClick: true,
    });

    /*---------- 12. Section Position ----------*/
    // Interger Converter
    function convertInteger(str) {
        return parseInt(str, 10) || 0;  
    }
    
    $.fn.sectionPosition = function (mainAttr, posAttr) {
        $(this).each(function () {
            var section = $(this);
    
            function setPosition() {
                var sectionHeight = Math.floor(section.height() / 2), // Main Height of section
                    posData = section.attr(mainAttr), // where to position
                    posFor = section.attr(posAttr), // On Which section is for positioning
                    topMark = "top-half", // Pos top
                    bottomMark = "bottom-half", // Pos Bottom
                    originalPT = convertInteger($(posFor).attr('data-original-padding-top')), // Original Padding-top of parent
                    originalPB = convertInteger($(posFor).attr('data-original-padding-bottom')); // Original Padding-bottom of parent
    
                if (!originalPT) {
                    // Store the original padding values if not already stored
                    $(posFor).attr('data-original-padding-top', $(posFor).css("padding-top"));
                    originalPT = convertInteger($(posFor).attr('data-original-padding-top'));
                }
                if (!originalPB) {
                    $(posFor).attr('data-original-padding-bottom', $(posFor).css("padding-bottom"));
                    originalPB = convertInteger($(posFor).attr('data-original-padding-bottom'));
                }
    
                if (posData === topMark) {
                    $(posFor).css("padding-bottom", originalPB + sectionHeight + "px");
                    section.css("margin-top", "-" + sectionHeight + "px");
                } else if (posData === bottomMark) {
                    $(posFor).css("padding-top", originalPT + sectionHeight + "px");
                    section.css("margin-bottom", "-" + sectionHeight + "px");
                }
            }
    
            setPosition(); // Set Padding On Load
        });
    };
    
    var postionHandler = "[data-sec-pos]";
    
    function handleSectionPosition() {
        if ($(postionHandler).length) {
            $(postionHandler).imagesLoaded(function () {
                $(postionHandler).sectionPosition("data-sec-pos", "data-pos-for");
            });
        }
    }
    
    handleSectionPosition();
    
    $(window).on('resize', function () {
        $(postionHandler).each(function () {
            var posFor = $(this).attr("data-pos-for");
            $(posFor).css("padding-top", $(posFor).attr('data-original-padding-top'));
            $(posFor).css("padding-bottom", $(posFor).attr('data-original-padding-bottom'));
        });
        handleSectionPosition();
    });
    

    /*----------- 13. Filter ----------*/
    $(".filter-active").imagesLoaded(function () {
        var $filter = ".filter-active",
            $filterItem = ".filter-item",
            $filterMenu = ".filter-menu-active";

        if ($($filter).length > 0) {
            var $grid = $($filter).isotope({
                itemSelector: $filterItem,
                filter: "*",
                masonry: {
                    columnWidth: 1,
                },
            });

            // filter items on button click
            $($filterMenu).on("click", "button", function () {
                var filterValue = $(this).attr("data-filter");
                $grid.isotope({
                    filter: filterValue,
                });
            });

            // Menu Active Class
            $($filterMenu).on("click", "button", function (event) {
                event.preventDefault();
                $(this).addClass("active");
                $(this).siblings(".active").removeClass("active");
            });
        }
    });

    $(".masonary-active, .woocommerce-Reviews .comment-list").imagesLoaded(function () {
        var $filter = ".masonary-active, .woocommerce-Reviews .comment-list",
            $filterItem = ".filter-item, .woocommerce-Reviews .comment-list li";

        if ($($filter).length > 0) {
            $($filter).isotope({
                itemSelector: $filterItem,
                filter: "*",
                masonry: {
                    // use outer width of grid-sizer for columnWidth
                    columnWidth: 1,
                },
            });
        }
        $('[data-bs-toggle="tab"]').on('shown.bs.tab', function (e) {
            $($filter).isotope({
                filter: "*",
            });
        });
    });

    /*----------- 14. Counter Up ----------*/
    $(".counter-number").counterUp({
        delay: 10,
        time: 1000,
    });

    /*----------- 15. Shape Mockup ----------*/
    $.fn.shapeMockup = function () {
        var $shape = $(this);
        $shape.each(function () {
            var $currentShape = $(this),
                shapeTop = $currentShape.data("top"),
                shapeRight = $currentShape.data("right"),
                shapeBottom = $currentShape.data("bottom"),
                shapeLeft = $currentShape.data("left");
            $currentShape
                .css({
                    top: shapeTop,
                    right: shapeRight,
                    bottom: shapeBottom,
                    left: shapeLeft,
                })
                .removeAttr("data-top")
                .removeAttr("data-right")
                .removeAttr("data-bottom")
                .removeAttr("data-left")
                .parent()
                .addClass("shape-mockup-wrap");
        });
    };

    if ($(".shape-mockup")) {
        $(".shape-mockup").shapeMockup();
    }

    /*----------- 16. Progress Bar Animation ----------*/
    $('.progress-bar').waypoint(function() {
        $('.progress-bar').css({
        animation: "animate-positive 1.8s",
        opacity: "1"
        });
    }, { offset: '75%' });

    /*----------- 17. Countdown ----------*/

    $.fn.countdown = function () {
        $(this).each(function () {
            var $counter = $(this),
                countDownDate = new Date($counter.data("offer-date")).getTime(), // Set the date we're counting down toz
                exprireCls = "expired";

            // Finding Function
            function s$(element) {
                return $counter.find(element);
            }

            // Update the count down every 1 second
            var counter = setInterval(function () {
                // Get today's date and time
                var now = new Date().getTime();

                // Find the distance between now and the count down date
                var distance = countDownDate - now;

                // Time calculations for days, hours, minutes and seconds
                var days = Math.floor(distance / (1000 * 60 * 60 * 24));
                var hours = Math.floor(
                    (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
                );
                var minutes = Math.floor(
                    (distance % (1000 * 60 * 60)) / (1000 * 60)
                );
                var seconds = Math.floor((distance % (1000 * 60)) / 1000);

                // Check If value is lower than ten, so add zero before number
                days < 10 ? (days = "0" + days) : null;
                hours < 10 ? (hours = "0" + hours) : null;
                minutes < 10 ? (minutes = "0" + minutes) : null;
                seconds < 10 ? (seconds = "0" + seconds) : null;

                // If the count down is over, write some text
                if (distance < 0) {
                    clearInterval(counter);
                    $counter.addClass(exprireCls);
                    $counter.find(".message").css("display", "block");
                } else {
                    // Output the result in elements
                    s$(".day").html(days);
                    s$(".hour").html(hours);
                    s$(".minute").html(minutes);
                    s$(".seconds").html(seconds);
                }
            }, 1000);
        });
    };

    if ($(".counter-list").length) {
        $(".counter-list").countdown();
    }

    /*----------- 18. Date Time Picker ----------*/
    // Only Date Picker
    $('.date-pick').datetimepicker({
        timepicker: false,
        datepicker: true,
        format: 'd-m-y',
        step: 10
    });

    // Only Time Picker
    $('.time-pick').datetimepicker({
        datepicker:false,
        format:'H:i',
        step:30
    });

    // Date Time
    $('.date-time-pick').datetimepicker({});

    /*----------- 19. Button Style ----------*/
    $(".th-btn.style-border").each(function(){
        var buttonText = $(this).text();
        $(this).empty();
        $(this).append('<span class="top-line"></span>');
        $(this).append('<span class="text">' + buttonText + '</span>');
        $(this).append('<span class="bottom-line-1"></span>');
        $(this).append('<span class="bottom-line-2"></span>');
    });

    /*============================================*/
    /*----------- 20. Gsap Animation ----------*/
    /*============================================*/

    gsap.registerPlugin(ScrollTrigger, ScrollSmoother, TweenMax, ScrollToPlugin);

    gsap.config({
        nullTargetWarn: false,
    });

    let smoother = ScrollSmoother.create({
        smooth: 1.35,
        effects: true,
        smoothTouch: true,
        normalizeScroll: false,
        ignoreMobileResize: true,
    });

    
    $(document).ready(function() {

        // updateSmoothWrapperPadding
        function updateSmoothWrapperPadding() {
            var headerHeight = $('.th-header').outerHeight();
            $('#smooth-wrapper').css('padding-top', headerHeight + 'px');
        }

        function refreshPaddingBasedOnSticky() {
            var isSticky = $('.sticky-wrapper').hasClass('sticky');
            if (isSticky) {
                $('#smooth-wrapper').css('padding-top', '0');
            } else {
                updateSmoothWrapperPadding();
            }
        }
        refreshPaddingBasedOnSticky();
        $(window).resize(function() {
            refreshPaddingBasedOnSticky();
        });
        if (typeof MutationObserver !== 'undefined') {
            var observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                        refreshPaddingBasedOnSticky();
                    }
                });
            });
            observer.observe(document.querySelector('.sticky-wrapper'), { attributes: true });
        }
        
        // Cursor smoothness
        $(document).mousemove(function(event) {
            var mouseX = event.pageX;
            var mouseY = event.pageY;
            $('.custom-element').animate({ left: mouseX, top: mouseY }, 300);
        });
    });
       
    

    // Title Animation
    let splitTitleLines = gsap.utils.toArray(".title-ani");

    splitTitleLines.forEach(splitTextLine => {
        const tl = gsap.timeline({
            scrollTrigger: {
            trigger: splitTextLine,
            start: 'top 90%',
            end: 'bottom 60%',
            scrub: false,
            markers: false,
            toggleActions: 'play none none none'
            }
        });

        const itemSplitted = new SplitText(splitTextLine, { type: "words, lines" });
        gsap.set(splitTextLine, { perspective: 500 });
        itemSplitted.split({ type: "lines" })
        tl.from(itemSplitted.lines, { duration: 1.2, delay: 0.3, opacity: 0, rotationX: -80, force3D: true, transformOrigin: "top center -50", stagger: 0.1 });
    });

    let splitTextLines = gsap.utils.toArray(".text-ani");

    splitTextLines.forEach(splitTextLine => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: splitTextLine,
                start: 'top 90%',
                duration: 2,
                end: 'bottom 60%',
                scrub: false,
                markers: false,
                toggleActions: 'play none none none'
            }
        });

        const itemSplitted = new SplitText(splitTextLine, { type: "lines" });
        gsap.set(splitTextLine, { perspective: 400 });
        itemSplitted.split({ type: "lines" })
        tl.from(itemSplitted.lines, { duration: 1, delay: 0.5, opacity: 0, rotationX: -80, force3D: true, transformOrigin: "top center -50", stagger: 0.1 });
    });

    $(document).ready(function() {
		var st = $(".tx-split-text");
        if(st.length == 0) return;
        gsap.registerPlugin(SplitText);
        st.each(function(index, el) {
            el.split = new SplitText(el, { 
                type: "lines,words,chars",
                linesClass: "split-line"
            });
            gsap.set(el, { perspective: 400 });

            if( $(el).hasClass('split-in-fade') ){
                gsap.set(el.split.chars, {
                    opacity: 0,
                    ease: "Back.easeOut",
                });
            }
            if( $(el).hasClass('split-in-right') ){
                gsap.set(el.split.chars, {
                    opacity: 0,
                    x: "50",
                    ease: "Back.easeOut",
                });
            }
            if( $(el).hasClass('split-in-left') ){
                gsap.set(el.split.chars, {
                    opacity: 0,
                    x: "-50",
                    autoAlpha: 0,
                    ease: "circ.out",
                });
            }
            if( $(el).hasClass('split-in-up') ){
                gsap.set(el.split.chars, {
                    opacity: 0,
                    y: "80",
                    ease: "circ.out",
                });
            }
            if( $(el).hasClass('split-in-down') ){
                gsap.set(el.split.chars, {
                    opacity: 0,
                    y: "-80",
                    ease: "circ.out",
                });
            }
            if( $(el).hasClass('split-in-rotate') ){
                gsap.set(el.split.chars, {
                    opacity: 0,
                    rotateX: "50deg",
                    ease: "circ.out",
                });
            }
            if( $(el).hasClass('split-in-scale') ){
                gsap.set(el.split.chars, {
                    opacity: 0,
                    scale: "0.5",
                    ease: "circ.out",
                });
            }
            el.anim = gsap.to(el.split.chars, {
                scrollTrigger: {
                    trigger: el,
                    // toggleActions: "restart pause resume reverse",
                    start: "top 90%",
                },
                x: "0",
                y: "0",
                rotateX: "0",
                scale: 1,
                opacity: 1,
                duration: 1, 
                stagger: 0.01,
                autoAlpha: 1,
            });
        });
	});

    // Home page Hero Animation 
    function animateHeroTitles(selector) {
        let elements = document.querySelectorAll(selector);
    
        if (!elements || elements.length === 0) {
            console.error(`No elements found for selector: ${selector}`);
            return; // Return if no elements are found
        }

        elements.forEach((element) => {
            let timeline = gsap.timeline();
    
            let splitText = new SplitText(element, { type: "words,chars" });
            timeline.from(splitText.chars, {
                duration: 1,
                x: 70,
                autoAlpha: 0,
                stagger: 0.1,
            });
            ScrollTrigger.create({
                animation: timeline,
                trigger: element,
                start: 'top 90%',
                end: 'bottom 60%',
                scrub: false,
                markers: false,
                toggleActions: 'play none none none',
            });
        });
    }
    
        
    if ($(".title-ani2").length > 0) {
        animateHeroTitles('.title-ani2');
    }
    if ($(".hero-style2 .hero-title2").length > 0) {
        animateHeroTitles('.hero-style2 .hero-title2');
    }
    if ($(".hero-style2 .hero-title3").length > 0) {
        animateHeroTitles('.hero-style2 .hero-title3');
    }
    if ($(".sub-title2").length > 0) {
        animateHeroTitles('.sub-title2');
    }
    if ($(".sub-title2 + .sec-title").length > 0) {
        animateHeroTitles('.sub-title2 + .sec-title');
    }
    if ($(".sub-title3").length > 0) {
        animateHeroTitles('.sub-title3');
    }
    if ($(".sub-title3 + .sec-title").length > 0) {
        animateHeroTitles('.sub-title3 + .sec-title');
    }
    if ($(".sub-title4").length > 0) {
        animateHeroTitles('.sub-title4');
    }
    if ($(".sub-title4 + .sec-title").length > 0) {
        animateHeroTitles('.sub-title4 + .sec-title');
    }
    

    let gsapflipX = gsap.utils.toArray(".flipX")
    gsapflipX.forEach((flipItem, i) => {
        gsap.set(flipItem, { opacity: 0.7 })
        let t1 = gsap.timeline()

        t1.set(flipItem, {
            position: "relative",
        })
        t1.to(flipItem, {
            scrollTrigger: {
                trigger: flipItem,
                scrub: 0.5,
                duration: 1.5,
                start: "top bottom+=100",
                end: "bottom center+=250",
                markers: false
            },
            scale: 1,
            opacity: 1,
            rotateY: 0,
        })
    });




    let gsapflipY = gsap.utils.toArray(".flipY")
    gsapflipY.forEach((flipItem, i) => {
        gsap.set(flipItem, { opacity: 0.7 })
        let t1 = gsap.timeline()

        t1.set(flipItem, {
            position: "relative",
        })
        t1.to(flipItem, {
            scrollTrigger: {
                trigger: flipItem,
                scrub: 2,
                duration: 1.5,
                start: "top bottom+=100",
                end: "bottom bottom+=100",
                markers: false
            },
            scale: 1,
            opacity: 1,
            rotateX: 0,
        })
    });

    // let imageTl = gsap.timeline({
    //     scrollTrigger: {
    //       trigger: ".counter-card",
    //       start: "top bottom",
    //       markers: false,
    //       scrub: 1,
    //       end: "bottom center"
    //     }
    // })

    // // Image pin 
    // imageTl.to(".counter-card .box-number", {
    //     scale: 1.2,
    //     duration: 1,
    // })

    function animateTextShape(elements) {
        elements.forEach((textShape) => {
            if (textShape) {
                const spintl = gsap.timeline({
                    scrollTrigger: {
                        trigger: textShape,
                        start: 'top 95%',
                        end: 'bottom -95%',
                        scrub: true,
                        markers: false
                    }
                });
    
                spintl.to(textShape, {
                    duration: 0.4,
                    rotation: 720,
                    ease: 'power2.out'
                });
            }
        });
    }
    
    // Select all elements with class '.gspin' using querySelectorAll
    const textShapes = document.querySelectorAll('.gspin');
    
    // Call the animation function and pass in the list of elements
    animateTextShape(Array.from(textShapes));
    

    function animateplateShape() {
        const plateShape = document.querySelector('.img-box6 .img1 img');
    
        if (plateShape) {
            const spintl = gsap.timeline({
                scrollTrigger: {
                    trigger: plateShape,
                    start: 'top 95%',
                    end: 'bottom -95%',
                    scrub: true,
                    markers: false
                }
            });
    
            spintl.to(plateShape, {
                duration: 0.1,
                rotation: 360,
                ease: 'power2.out'
            });
        }
    }
    
    // Call the animation function
    animateplateShape();

    /*----------- 00. Color Scheme ----------*/
    $('.color-switch-btns button').each(function () {
        // Get color for button
        const button = $(this);
        const color = button.data('color');
        button.css('--theme-color', color);

        // Change theme color on click
        button.on('click', function () {
            const clickedColor = $(this).data('color');
            $(':root').css('--theme-color', clickedColor);
        });
    });

    // Handle color picker change event
    $('#thcolorpicker').on('input', function () {
        const pickedColor = $(this).val();
        updateThemeColor(pickedColor);
    });

    function updateThemeColor(color) {
        $(':root').css('--theme-color', color);
    }

    $(document).on('click','.switchIcon',function() {
        $('.color-scheme').toggleClass('active');
    });
    

    /*----------- 00. Woocommerce Toggle ----------*/
    // Ship To Different Address
    $("#ship-to-different-address-checkbox").on("change", function () {
        if ($(this).is(":checked")) {
            $("#ship-to-different-address")
                .next(".shipping_address")
                .slideDown();
        } else {
            $("#ship-to-different-address").next(".shipping_address").slideUp();
        }
    });

    // Login Toggle
    $(".woocommerce-form-login-toggle a").on("click", function (e) {
        e.preventDefault();
        $(".woocommerce-form-login").slideToggle();
    });

    // Coupon Toggle
    $(".woocommerce-form-coupon-toggle a").on("click", function (e) {
        e.preventDefault();
        $(".woocommerce-form-coupon").slideToggle();
    });

    // Woocommerce Shipping Method
    $(".shipping-calculator-button").on("click", function (e) {
        e.preventDefault();
        $(this).next(".shipping-calculator-form").slideToggle();
    });

    // Woocommerce Payment Toggle
    $('.wc_payment_methods input[type="radio"]:checked')
        .siblings(".payment_box")
        .show();
    $('.wc_payment_methods input[type="radio"]').each(function () {
        $(this).on("change", function () {
            $(".payment_box").slideUp();
            $(this).siblings(".payment_box").slideDown();
        });
    });

    // Woocommerce Rating Toggle
    $(".rating-select .stars a").each(function () {
        $(this).on("click", function (e) {
            e.preventDefault();
            $(this).siblings().removeClass("active");
            $(this).parent().parent().addClass("selected");
            $(this).addClass("active");
        });
    });

    // Quantity Plus Minus ---------------------------

    $(".quantity-plus").each(function () {
        $(this).on("click", function (e) {
            e.preventDefault();
            var $qty = $(this).siblings(".qty-input");
            var currentVal = parseInt($qty.val(), 10);
            if (!isNaN(currentVal)) {
                $qty.val(currentVal + 1);
            }
        });
    });

    $(".quantity-minus").each(function () {
        $(this).on("click", function (e) {
            e.preventDefault();
            var $qty = $(this).siblings(".qty-input");
            var currentVal = parseInt($qty.val(), 10);
            if (!isNaN(currentVal) && currentVal > 1) {
                $qty.val(currentVal - 1);
            }
        });
    });
    
    // /*----------- 00. Right Click Disable ----------*/
    //   window.addEventListener('contextmenu', function (e) {
    //     // do something here...
    //     e.preventDefault();
    //   }, false);

    // /*----------- 00. Inspect Element Disable ----------*/
    //   document.onkeydown = function (e) {
    //     if (event.keyCode == 123) {
    //       return false;
    //     }
    //     if (e.ctrlKey && e.shiftKey && e.keyCode == 'I'.charCodeAt(0)) {
    //       return false;
    //     }
    //     if (e.ctrlKey && e.shiftKey && e.keyCode == 'C'.charCodeAt(0)) {
    //       return false;
    //     }
    //     if (e.ctrlKey && e.shiftKey && e.keyCode == 'J'.charCodeAt(0)) {
    //       return false;
    //     }
    //     if (e.ctrlKey && e.keyCode == 'U'.charCodeAt(0)) {
    //       return false;
    //     }
    //   }
    
})(jQuery);








