var $ = jQuery.noConflict();

var SEMICOLON = SEMICOLON || {};

(function($) {
  'use strict';
  SEMICOLON.initialize = {
    init: function() {
      SEMICOLON.initialize.responsiveClasses();
      SEMICOLON.initialize.stickyElements();
      SEMICOLON.initialize.goToTop();
      SEMICOLON.initialize.fullScreen();
      SEMICOLON.initialize.verticalMiddle();
      SEMICOLON.initialize.imageFade();
      SEMICOLON.initialize.pageTransition();
      SEMICOLON.initialize.dataResponsiveClasses();
      SEMICOLON.initialize.dataResponsiveHeights();
      $('.fslider').addClass('preloader2');
    },

    responsiveClasses: function() {
      if (typeof jRespond === 'undefined') {
        console.log('responsiveClasses: jRespond not Defined.');
        return true;
      }

      var jRes = jRespond([
        {
          label: 'smallest',
          enter: 0,
          exit: 479,
        },
        {
          label: 'handheld',
          enter: 480,
          exit: 767,
        },
        {
          label: 'tablet',
          enter: 768,
          exit: 991,
        },
        {
          label: 'laptop',
          enter: 992,
          exit: 1199,
        },
        {
          label: 'desktop',
          enter: 1200,
          exit: 10000,
        },
      ]);
      jRes.addFunc([
        {
          breakpoint: 'desktop',
          enter: function() {
            $body.addClass('device-lg');
          },
          exit: function() {
            $body.removeClass('device-lg');
          },
        },
        {
          breakpoint: 'laptop',
          enter: function() {
            $body.addClass('device-md');
          },
          exit: function() {
            $body.removeClass('device-md');
          },
        },
        {
          breakpoint: 'tablet',
          enter: function() {
            $body.addClass('device-sm');
          },
          exit: function() {
            $body.removeClass('device-sm');
          },
        },
        {
          breakpoint: 'handheld',
          enter: function() {
            $body.addClass('device-xs');
          },
          exit: function() {
            $body.removeClass('device-xs');
          },
        },
        {
          breakpoint: 'smallest',
          enter: function() {
            $body.addClass('device-xxs');
          },
          exit: function() {
            $body.removeClass('device-xxs');
          },
        },
      ]);
    },

    verticalMiddle: function() {
      if ($verticalMiddleEl.length > 0) {
        $verticalMiddleEl.each(function() {
          var element = $(this),
            verticalMiddleH = element.outerHeight(),
            headerHeight = $header.outerHeight();

          if (
            element.parents('#slider').length > 0 &&
            !element.hasClass('ignore-header')
          ) {
            if (
              $header.hasClass('transparent-header') &&
              ($body.hasClass('device-lg') || $body.hasClass('device-md'))
            ) {
              verticalMiddleH = verticalMiddleH - 70;
              if ($slider.next('#header').length > 0) {
                verticalMiddleH = verticalMiddleH + headerHeight;
              }
            }
          }

          if ($body.hasClass('device-xs') || $body.hasClass('device-xxs')) {
            if (
              element.parents('.full-screen').length &&
              !element.parents('.force-full-screen').length
            ) {
              if (element.children('.col-padding').length > 0) {
                element
                  .css({
                    position: 'relative',
                    top: '0',
                    width: 'auto',
                    marginTop: '0',
                  })
                  .addClass('clearfix');
              } else {
                element
                  .css({
                    position: 'relative',
                    top: '0',
                    width: 'auto',
                    marginTop: '0',
                    paddingTop: '60px',
                    paddingBottom: '60px',
                  })
                  .addClass('clearfix');
              }
            } else {
              element.css({
                position: 'absolute',
                top: '50%',
                width: '100%',
                paddingTop: '0',
                paddingBottom: '0',
                marginTop: -(verticalMiddleH / 2) + 'px',
              });
            }
          } else {
            element.css({
              position: 'absolute',
              top: '50%',
              width: '100%',
              paddingTop: '0',
              paddingBottom: '0',
              marginTop: -(verticalMiddleH / 2) + 'px',
            });
          }
        });
      }
    },

    stickyElements: function() {
      if ($siStickyEl.length > 0) {
        var siStickyH = $siStickyEl.outerHeight();
        $siStickyEl.css({ marginTop: -(siStickyH / 2) + 'px' });
      }

      if ($dotsMenuEl.length > 0) {
        var opmdStickyH = $dotsMenuEl.outerHeight();
        $dotsMenuEl.css({ marginTop: -(opmdStickyH / 2) + 'px' });
      }
    },

    goToTop: function() {
      var elementScrollSpeed = $goToTopEl.attr('data-speed'),
        elementScrollEasing = $goToTopEl.attr('data-easing');

      if (!elementScrollSpeed) {
        elementScrollSpeed = 700;
      }
      if (!elementScrollEasing) {
        elementScrollEasing = 'easeOutQuad';
      }

      $goToTopEl.click(function() {
        $('body,html')
          .stop(true)
          .animate(
            {
              scrollTop: 0,
            },
            Number(elementScrollSpeed),
            elementScrollEasing
          );
        return false;
      });
    },

    goToTopScroll: function() {
      var elementMobile = $goToTopEl.attr('data-mobile'),
        elementOffset = $goToTopEl.attr('data-offset');

      if (!elementOffset) {
        elementOffset = 450;
      }

      if (
        elementMobile != 'true' &&
        ($body.hasClass('device-xs') || $body.hasClass('device-xxs'))
      ) {
        return true;
      }

      if ($window.scrollTop() > Number(elementOffset)) {
        $goToTopEl.fadeIn();
      } else {
        $goToTopEl.fadeOut();
      }
    },

    fullScreen: function() {
      if ($fullScreenEl.length > 0) {
        $fullScreenEl.each(function() {
          var element = $(this),
            scrHeight = window.innerHeight
              ? window.innerHeight
              : $window.height(),
            negativeHeight = element.attr('data-negative-height');

          if (element.attr('id') == 'slider') {
            var sliderHeightOff = $slider.offset().top;
            scrHeight = scrHeight - sliderHeightOff;
            if (
              $('#slider.with-header').next('#header:not(.transparent-header)')
                .length > 0 &&
              ($body.hasClass('device-lg') || $body.hasClass('device-md'))
            ) {
              var headerHeightOff = $header.outerHeight();
              scrHeight = scrHeight - headerHeightOff;
            }
          }
          if (element.parents('.full-screen').length > 0) {
            scrHeight = element.parents('.full-screen').height();
          }

          if ($body.hasClass('device-xs') || $body.hasClass('device-xxs')) {
            if (!element.hasClass('force-full-screen')) {
              scrHeight = 'auto';
            }
          }

          if (negativeHeight) {
            scrHeight = scrHeight - Number(negativeHeight);
          }

          element.css('height', scrHeight);
          if (
            element.attr('id') == 'slider' &&
            !element.hasClass('canvas-slider-grid')
          ) {
            if (element.has('.swiper-slide')) {
              element.find('.swiper-slide').css('height', scrHeight);
            }
          }
        });
      }
    },

    maxHeight: function() {
      if ($commonHeightEl.length > 0) {
        if ($commonHeightEl.hasClass('customjs')) {
          return true;
        }
        $commonHeightEl.each(function() {
          var element = $(this);
          if (element.find('.common-height').length > 0) {
            SEMICOLON.initialize.commonHeight(
              element.find('.common-height:not(.customjs)')
            );
          }

          SEMICOLON.initialize.commonHeight(element);
        });
      }
    },

    commonHeight: function(element) {
      var maxHeight = 0;
      element.children('[class*=col-]').each(function() {
        var element = $(this).children();
        if (element.hasClass('max-height')) {
          maxHeight = element.outerHeight();
        } else {
          if (element.outerHeight() > maxHeight)
            maxHeight = element.outerHeight();
        }
      });

      element.children('[class*=col-]').each(function() {
        $(this).height(maxHeight);
      });
    },

    testimonialsGrid: function() {
      if ($testimonialsGridEl.length > 0) {
        if (
          $body.hasClass('device-sm') ||
          $body.hasClass('device-md') ||
          $body.hasClass('device-lg')
        ) {
          var maxHeight = 0;
          $testimonialsGridEl.each(function() {
            $(this)
              .find('li > .testimonial')
              .each(function() {
                if ($(this).height() > maxHeight) {
                  maxHeight = $(this).height();
                }
              });
            $(this)
              .find('li')
              .height(maxHeight);
            maxHeight = 0;
          });
        } else {
          $testimonialsGridEl.find('li').css({ height: 'auto' });
        }
      }
    },

    imageFade: function() {
      $('.image_fade').hover(
        function() {
          $(this)
            .filter(':not(:animated)')
            .animate({ opacity: 0.8 }, 400);
        },
        function() {
          $(this).animate({ opacity: 1 }, 400);
        }
      );
    },

    pageTransition: function() {
      if ($body.hasClass('no-transition')) {
        return true;
      }

      if (!$().animsition) {
        $body.addClass('no-transition');
        console.log('pageTransition: Animsition not Defined.');
        return true;
      }

      window.onpageshow = function(event) {
        if (event.persisted) {
          window.location.reload();
        }
      };

      var animationIn = $body.attr('data-animation-in'),
        animationOut = $body.attr('data-animation-out'),
        durationIn = $body.attr('data-speed-in'),
        durationOut = $body.attr('data-speed-out'),
        loaderTimeOut = $body.attr('data-loader-timeout'),
        loaderStyle = $body.attr('data-loader'),
        loaderColor = $body.attr('data-loader-color'),
        loaderStyleHtml = $body.attr('data-loader-html'),
        loaderBgStyle = '',
        loaderBorderStyle = '',
        loaderBgClass = '',
        loaderBorderClass = '',
        loaderBgClass2 = '',
        loaderBorderClass2 = '';

      if (!animationIn) {
        animationIn = 'fadeIn';
      }
      if (!animationOut) {
        animationOut = 'fadeOut';
      }
      if (!durationIn) {
        durationIn = 1500;
      }
      if (!durationOut) {
        durationOut = 800;
      }
      if (!loaderStyleHtml) {
        loaderStyleHtml =
          '<div class="css3-spinner-bounce1"></div><div class="css3-spinner-bounce2"></div><div class="css3-spinner-bounce3"></div>';
      }

      if (!loaderTimeOut) {
        loaderTimeOut = false;
      } else {
        loaderTimeOut = Number(loaderTimeOut);
      }

      if (loaderColor) {
        if (loaderColor == 'theme') {
          loaderBgClass = ' bgcolor';
          loaderBorderClass = ' border-color';
          loaderBgClass2 = ' class="bgcolor"';
          loaderBorderClass2 = ' class="border-color"';
        } else {
          loaderBgStyle = ' style="background-color:' + loaderColor + ';"';
          loaderBorderStyle = ' style="border-color:' + loaderColor + ';"';
        }
        loaderStyleHtml =
          '<div class="css3-spinner-bounce1' +
          loaderBgClass +
          '"' +
          loaderBgStyle +
          '></div><div class="css3-spinner-bounce2' +
          loaderBgClass +
          '"' +
          loaderBgStyle +
          '></div><div class="css3-spinner-bounce3' +
          loaderBgClass +
          '"' +
          loaderBgStyle +
          '></div>';
      }

      if (loaderStyle == '2') {
        loaderStyleHtml =
          '<div class="css3-spinner-flipper' +
          loaderBgClass +
          '"' +
          loaderBgStyle +
          '></div>';
      } else if (loaderStyle == '3') {
        loaderStyleHtml =
          '<div class="css3-spinner-double-bounce1' +
          loaderBgClass +
          '"' +
          loaderBgStyle +
          '></div><div class="css3-spinner-double-bounce2' +
          loaderBgClass +
          '"' +
          loaderBgStyle +
          '></div>';
      } else if (loaderStyle == '4') {
        loaderStyleHtml =
          '<div class="css3-spinner-rect1' +
          loaderBgClass +
          '"' +
          loaderBgStyle +
          '></div><div class="css3-spinner-rect2' +
          loaderBgClass +
          '"' +
          loaderBgStyle +
          '></div><div class="css3-spinner-rect3' +
          loaderBgClass +
          '"' +
          loaderBgStyle +
          '></div><div class="css3-spinner-rect4' +
          loaderBgClass +
          '"' +
          loaderBgStyle +
          '></div><div class="css3-spinner-rect5' +
          loaderBgClass +
          '"' +
          loaderBgStyle +
          '></div>';
      } else if (loaderStyle == '5') {
        loaderStyleHtml =
          '<div class="css3-spinner-cube1' +
          loaderBgClass +
          '"' +
          loaderBgStyle +
          '></div><div class="css3-spinner-cube2' +
          loaderBgClass +
          '"' +
          loaderBgStyle +
          '></div>';
      } else if (loaderStyle == '6') {
        loaderStyleHtml =
          '<div class="css3-spinner-scaler' +
          loaderBgClass +
          '"' +
          loaderBgStyle +
          '></div>';
      } else if (loaderStyle == '7') {
        loaderStyleHtml =
          '<div class="css3-spinner-grid-pulse"><div' +
          loaderBgClass2 +
          loaderBgStyle +
          '></div><div' +
          loaderBgClass2 +
          loaderBgStyle +
          '></div><div' +
          loaderBgClass2 +
          loaderBgStyle +
          '></div><div' +
          loaderBgClass2 +
          loaderBgStyle +
          '></div><div' +
          loaderBgClass2 +
          loaderBgStyle +
          '></div><div' +
          loaderBgClass2 +
          loaderBgStyle +
          '></div><div' +
          loaderBgClass2 +
          loaderBgStyle +
          '></div><div' +
          loaderBgClass2 +
          loaderBgStyle +
          '></div><div' +
          loaderBgClass2 +
          loaderBgStyle +
          '></div></div>';
      } else if (loaderStyle == '8') {
        loaderStyleHtml =
          '<div class="css3-spinner-clip-rotate"><div' +
          loaderBorderClass2 +
          loaderBorderStyle +
          '></div></div>';
      } else if (loaderStyle == '9') {
        loaderStyleHtml =
          '<div class="css3-spinner-ball-rotate"><div' +
          loaderBgClass2 +
          loaderBgStyle +
          '></div><div' +
          loaderBgClass2 +
          loaderBgStyle +
          '></div><div' +
          loaderBgClass2 +
          loaderBgStyle +
          '></div></div>';
      } else if (loaderStyle == '10') {
        loaderStyleHtml =
          '<div class="css3-spinner-zig-zag"><div' +
          loaderBgClass2 +
          loaderBgStyle +
          '></div><div' +
          loaderBgClass2 +
          loaderBgStyle +
          '></div></div>';
      } else if (loaderStyle == '11') {
        loaderStyleHtml =
          '<div class="css3-spinner-triangle-path"><div' +
          loaderBgClass2 +
          loaderBgStyle +
          '></div><div' +
          loaderBgClass2 +
          loaderBgStyle +
          '></div><div' +
          loaderBgClass2 +
          loaderBgStyle +
          '></div></div>';
      } else if (loaderStyle == '12') {
        loaderStyleHtml =
          '<div class="css3-spinner-ball-scale-multiple"><div' +
          loaderBgClass2 +
          loaderBgStyle +
          '></div><div' +
          loaderBgClass2 +
          loaderBgStyle +
          '></div><div' +
          loaderBgClass2 +
          loaderBgStyle +
          '></div></div>';
      } else if (loaderStyle == '13') {
        loaderStyleHtml =
          '<div class="css3-spinner-ball-pulse-sync"><div' +
          loaderBgClass2 +
          loaderBgStyle +
          '></div><div' +
          loaderBgClass2 +
          loaderBgStyle +
          '></div><div' +
          loaderBgClass2 +
          loaderBgStyle +
          '></div></div>';
      } else if (loaderStyle == '14') {
        loaderStyleHtml =
          '<div class="css3-spinner-scale-ripple"><div' +
          loaderBorderClass2 +
          loaderBorderStyle +
          '></div><div' +
          loaderBorderClass2 +
          loaderBorderStyle +
          '></div><div' +
          loaderBorderClass2 +
          loaderBorderStyle +
          '></div></div>';
      }

      $wrapper.animsition({
        inClass: animationIn,
        outClass: animationOut,
        inDuration: Number(durationIn),
        outDuration: Number(durationOut),
        linkElement:
          '#primary-menu ul li a:not([target="_blank"]):not([href*=#]):not([data-lightbox])',
        loading: true,
        loadingParentElement: 'body',
        loadingClass: 'css3-spinner',
        loadingHtml: loaderStyleHtml,
        unSupportCss: [
          'animation-duration',
          '-webkit-animation-duration',
          '-o-animation-duration',
        ],
        overlay: false,
        overlayClass: 'animsition-overlay-slide',
        overlayParentElement: 'body',
        timeOut: loaderTimeOut,
      });
    },

    topScrollOffset: function() {
      var topOffsetScroll = 0;
      if (
        ($body.hasClass('device-lg') || $body.hasClass('device-md')) &&
        !SEMICOLON.isMobile.any()
      ) {
        if ($header.hasClass('sticky-header')) {
          if ($pagemenu.hasClass('dots-menu')) {
            topOffsetScroll = 100;
          } else {
            topOffsetScroll = 144;
          }
        } else {
          if ($pagemenu.hasClass('dots-menu')) {
            topOffsetScroll = 140;
          } else {
            topOffsetScroll = 184;
          }
        }

        if (!$pagemenu.length) {
          if ($header.hasClass('sticky-header')) {
            topOffsetScroll = 100;
          } else {
            topOffsetScroll = 140;
          }
        }
      } else {
        topOffsetScroll = 40;
      }
      return topOffsetScroll;
    },

    defineColumns: function(element) {
      var column = 4;
      if (element.hasClass('masonry-thumbs')) {
        var lgCol = element.attr('data-lg-col'),
          mdCol = element.attr('data-md-col'),
          smCol = element.attr('data-sm-col'),
          xsCol = element.attr('data-xs-col'),
          xxsCol = element.attr('data-xxs-col');

        if (element.hasClass('col-2')) column = 2;
        else if (element.hasClass('col-3')) column = 3;
        else if (element.hasClass('col-5')) column = 5;
        else if (element.hasClass('col-6')) column = 6;
        else column = 4;

        if ($body.hasClass('device-lg')) {
          if (lgCol) {
            column = Number(lgCol);
          }
        } else if ($body.hasClass('device-md')) {
          if (mdCol) {
            column = Number(mdCol);
          }
        } else if ($body.hasClass('device-sm')) {
          if (smCol) {
            column = Number(smCol);
          }
        } else if ($body.hasClass('device-xs')) {
          if (xsCol) {
            column = Number(xsCol);
          }
        } else if ($body.hasClass('device-xxs')) {
          if (xxsCol) {
            column = Number(xxsCol);
          }
        }
      }
      return column;
    },

    setFullColumnWidth: function(element) {
      if (!$().isotope) {
        console.log('setFullColumnWidth: Isotope not Defined.');
        return true;
      }
      element.css({ width: '' });
      if (element.hasClass('masonry-thumbs')) {
        var columns = SEMICOLON.initialize.defineColumns(element),
          containerWidth = element.innerWidth();

        if (containerWidth == windowWidth) {
          containerWidth = windowWidth * 1.004;
          element.css({ width: containerWidth + 'px' });
        }

        var postWidth = containerWidth / columns;

        postWidth = Math.floor(postWidth);

        if (postWidth * columns >= containerWidth) {
          element.css({ 'margin-right': '-1px' });
        }

        element.children('a').css({ width: postWidth + 'px' });

        var firstElementWidth = element.find('a:eq(0)').outerWidth();

        element.isotope({
          masonry: {
            columnWidth: firstElementWidth,
          },
        });

        var bigImageNumbers = element.attr('data-big');
        if (bigImageNumbers) {
          bigImageNumbers = bigImageNumbers.split(',');
          var bigImageNumber = '',
            bigi = '';
          for (bigi = 0; bigi < bigImageNumbers.length; bigi++) {
            bigImageNumber = Number(bigImageNumbers[bigi]) - 1;
            element
              .find('a:eq(' + bigImageNumber + ')')
              .css({ width: firstElementWidth * 2 + 'px' });
          }
          var t = setTimeout(function() {
            element.isotope('layout');
          }, 1000);
        }
      }
    },

    aspectResizer: function() {
      var $aspectResizerEl = $('.aspect-resizer');
      if ($aspectResizerEl.length > 0) {
        $aspectResizerEl.each(function() {
          var element = $(this),
            elementW = element.inlineStyle('width'),
            elementH = element.inlineStyle('height'),
            elementPW = element.parent().innerWidth();
        });
      }
    },

    dataResponsiveClasses: function() {
      var $dataClassXxs = $('[data-class-xxs]'),
        $dataClassXs = $('[data-class-xs]'),
        $dataClassSm = $('[data-class-sm]'),
        $dataClassMd = $('[data-class-md]'),
        $dataClassLg = $('[data-class-lg]');

      if ($dataClassXxs.length > 0) {
        $dataClassXxs.each(function() {
          var element = $(this),
            elementClass = element.attr('data-class-xxs'),
            elementClassDelete =
              element.attr('data-class-xs') +
              ' ' +
              element.attr('data-class-sm') +
              ' ' +
              element.attr('data-class-md') +
              ' ' +
              element.attr('data-class-lg');
          if ($body.hasClass('device-xxs')) {
            element.removeClass(elementClassDelete);
            element.addClass(elementClass);
          }
        });
      }

      if ($dataClassXs.length > 0) {
        $dataClassXs.each(function() {
          var element = $(this),
            elementClass = element.attr('data-class-xs'),
            elementClassDelete =
              element.attr('data-class-xxs') +
              ' ' +
              element.attr('data-class-sm') +
              ' ' +
              element.attr('data-class-md') +
              ' ' +
              element.attr('data-class-lg');

          if ($body.hasClass('device-xs')) {
            element.removeClass(elementClassDelete);
            element.addClass(elementClass);
          }
        });
      }

      if ($dataClassSm.length > 0) {
        $dataClassSm.each(function() {
          var element = $(this),
            elementClass = element.attr('data-class-sm'),
            elementClassDelete =
              element.attr('data-class-xxs') +
              ' ' +
              element.attr('data-class-xs') +
              ' ' +
              element.attr('data-class-md') +
              ' ' +
              element.attr('data-class-lg');

          if ($body.hasClass('device-sm')) {
            element.removeClass(elementClassDelete);
            element.addClass(elementClass);
          }
        });
      }

      if ($dataClassMd.length > 0) {
        $dataClassMd.each(function() {
          var element = $(this),
            elementClass = element.attr('data-class-md'),
            elementClassDelete =
              element.attr('data-class-xxs') +
              ' ' +
              element.attr('data-class-xs') +
              ' ' +
              element.attr('data-class-sm') +
              ' ' +
              element.attr('data-class-lg');

          if ($body.hasClass('device-md')) {
            element.removeClass(elementClassDelete);
            element.addClass(elementClass);
          }
        });
      }

      if ($dataClassLg.length > 0) {
        $dataClassLg.each(function() {
          var element = $(this),
            elementClass = element.attr('data-class-lg'),
            elementClassDelete =
              element.attr('data-class-xxs') +
              ' ' +
              element.attr('data-class-xs') +
              ' ' +
              element.attr('data-class-sm') +
              ' ' +
              element.attr('data-class-md');

          if ($body.hasClass('device-lg')) {
            element.removeClass(elementClassDelete);
            element.addClass(elementClass);
          }
        });
      }
    },

    dataResponsiveHeights: function() {
      var $dataHeightXxs = $('[data-height-xxs]'),
        $dataHeightXs = $('[data-height-xs]'),
        $dataHeightSm = $('[data-height-sm]'),
        $dataHeightMd = $('[data-height-md]'),
        $dataHeightLg = $('[data-height-lg]');

      if ($dataHeightXxs.length > 0) {
        $dataHeightXxs.each(function() {
          var element = $(this),
            elementHeight = element.attr('data-height-xxs');

          if ($body.hasClass('device-xxs')) {
            if (elementHeight != '') {
              element.css('height', elementHeight);
            }
          }
        });
      }

      if ($dataHeightXs.length > 0) {
        $dataHeightXs.each(function() {
          var element = $(this),
            elementHeight = element.attr('data-height-xs');

          if ($body.hasClass('device-xs')) {
            if (elementHeight != '') {
              element.css('height', elementHeight);
            }
          }
        });
      }

      if ($dataHeightSm.length > 0) {
        $dataHeightSm.each(function() {
          var element = $(this),
            elementHeight = element.attr('data-height-sm');

          if ($body.hasClass('device-sm')) {
            if (elementHeight != '') {
              element.css('height', elementHeight);
            }
          }
        });
      }

      if ($dataHeightMd.length > 0) {
        $dataHeightMd.each(function() {
          var element = $(this),
            elementHeight = element.attr('data-height-md');

          if ($body.hasClass('device-md')) {
            if (elementHeight != '') {
              element.css('height', elementHeight);
            }
          }
        });
      }

      if ($dataHeightLg.length > 0) {
        $dataHeightLg.each(function() {
          var element = $(this),
            elementHeight = element.attr('data-height-lg');

          if ($body.hasClass('device-lg')) {
            if (elementHeight != '') {
              element.css('height', elementHeight);
            }
          }
        });
      }
    },

    stickFooterOnSmall: function() {
      var windowH = $window.height(),
        wrapperH = $wrapper.height();

      if (
        !$body.hasClass('sticky-footer') &&
        $footer.length > 0 &&
        $wrapper.has('#footer')
      ) {
        if (windowH > wrapperH) {
          $footer.css({ 'margin-top': windowH - wrapperH });
        }
      }
    },

    stickyFooter: function() {
      if (
        $body.hasClass('sticky-footer') &&
        $footer.length > 0 &&
        ($body.hasClass('device-lg') || $body.hasClass('device-md'))
      ) {
        var stickyFooter = $footer.outerHeight();
        $content.css({ 'margin-bottom': stickyFooter });
      } else {
        $content.css({ 'margin-bottom': 0 });
      }
    },
  };

  SEMICOLON.header = {
    init: function() {
      SEMICOLON.header.superfish();
      SEMICOLON.header.menufunctions();
      SEMICOLON.header.fullWidthMenu();
      SEMICOLON.header.overlayMenu();
      SEMICOLON.header.stickyMenu();
      SEMICOLON.header.stickyPageMenu();
      SEMICOLON.header.sideHeader();
      SEMICOLON.header.sidePanel();
      SEMICOLON.header.onePageScroll();
      SEMICOLON.header.onepageScroller();
      SEMICOLON.header.logo();
    },

    superfish: function() {
      if ($body.hasClass('device-lg') || $body.hasClass('device-md')) {
        $('#primary-menu ul ul, #primary-menu ul .mega-menu-content').css(
          'display',
          'block'
        );
        SEMICOLON.header.menuInvert();
        $('#primary-menu ul ul, #primary-menu ul .mega-menu-content').css(
          'display',
          ''
        );
      }

      if (!$().superfish) {
        $body.addClass('no-superfish');
        console.log('superfish: Superfish not Defined.');
        return true;
      }

      $(
        'body:not(.side-header) #primary-menu > ul, body:not(.side-header) #primary-menu > div > ul, .top-links > ul'
      ).superfish({
        popUpSelector: 'ul,.mega-menu-content,.top-link-section',
        delay: 250,
        speed: 350,
        animation: { opacity: 'show' },
        animationOut: { opacity: 'hide' },
        cssArrows: false,
        onShow: function() {
          var megaMenuContent = $(this);
          if (megaMenuContent.find('.owl-carousel.customjs').length > 0) {
            megaMenuContent.find('.owl-carousel').removeClass('customjs');
            SEMICOLON.widget.carousel();
          }

          if (
            megaMenuContent.hasClass('mega-menu-content') &&
            megaMenuContent.find('.widget').length > 0
          ) {
            if ($body.hasClass('device-lg') || $body.hasClass('device-md')) {
              setTimeout(function() {
                SEMICOLON.initialize.commonHeight(megaMenuContent);
              }, 200);
            } else {
              megaMenuContent.children().height('');
            }
          }
        },
      });

      $('body.side-header #primary-menu > ul').superfish({
        popUpSelector: 'ul',
        delay: 250,
        speed: 350,
        animation: { opacity: 'show', height: 'show' },
        animationOut: { opacity: 'hide', height: 'hide' },
        cssArrows: false,
      });
    },

    menuInvert: function() {
      $('#primary-menu .mega-menu-content, #primary-menu ul ul').each(function(
        index,
        element
      ) {
        var $menuChildElement = $(element),
          menuChildOffset = $menuChildElement.offset(),
          menuChildWidth = $menuChildElement.width(),
          menuChildLeft = menuChildOffset.left;

        if (windowWidth - (menuChildWidth + menuChildLeft) < 0) {
          $menuChildElement.addClass('menu-pos-invert');
        }
      });
    },

    menufunctions: function() {
      $('#primary-menu ul li:has(ul)').addClass('sub-menu');
      $(
        '.top-links ul li:has(ul) > a, #primary-menu.with-arrows > ul > li:has(ul) > a > div, #primary-menu.with-arrows > div > ul > li:has(ul) > a > div, #page-menu nav ul li:has(ul) > a > div'
      ).append('<i class="icon-angle-down"></i>');
      $('.top-links > ul').addClass('clearfix');

      if ($body.hasClass('device-lg') || $body.hasClass('device-md')) {
        $('#primary-menu.sub-title')
          .children('ul')
          .children('.current')
          .prev()
          .css({ backgroundImage: 'none' });
      }

      if (SEMICOLON.isMobile.Android()) {
        $('#primary-menu ul li.sub-menu')
          .children('a')
          .on('touchstart', function(e) {
            if (
              !$(this)
                .parent('li.sub-menu')
                .hasClass('sfHover')
            ) {
              e.preventDefault();
            }
          });
      }

      if (SEMICOLON.isMobile.Windows()) {
        if ($().superfish) {
          $('#primary-menu > ul, #primary-menu > div > ul,.top-links > ul')
            .superfish('destroy')
            .addClass('windows-mobile-menu');
        } else {
          $(
            '#primary-menu > ul, #primary-menu > div > ul,.top-links > ul'
          ).addClass('windows-mobile-menu');
          console.log('menufunctions: Superfish not defined.');
        }

        $('#primary-menu ul li:has(ul)').append(
          '<a href="#" class="wn-submenu-trigger"><i class="icon-angle-down"></i></a>'
        );

        $('#primary-menu ul li.sub-menu')
          .children('a.wn-submenu-trigger')
          .click(function(e) {
            $(this)
              .parent()
              .toggleClass('open');
            $(this)
              .parent()
              .find('> ul, > .mega-menu-content')
              .stop(true, true)
              .toggle();
            return false;
          });
      }
    },

    fullWidthMenu: function() {
      if ($body.hasClass('stretched')) {
        if ($header.find('.container-fullwidth').length > 0) {
          $('.mega-menu .mega-menu-content').css({
            width: $wrapper.width() - 120,
          });
        }
        if ($header.hasClass('full-header')) {
          $('.mega-menu .mega-menu-content').css({
            width: $wrapper.width() - 60,
          });
        }
      } else {
        if ($header.find('.container-fullwidth').length > 0) {
          $('.mega-menu .mega-menu-content').css({
            width: $wrapper.width() - 120,
          });
        }
        if ($header.hasClass('full-header')) {
          $('.mega-menu .mega-menu-content').css({
            width: $wrapper.width() - 80,
          });
        }
      }
    },

    overlayMenu: function() {
      if ($body.hasClass('overlay-menu')) {
        var overlayMenuItem = $('#primary-menu')
            .children('ul')
            .children('li'),
          overlayMenuItemHeight = overlayMenuItem.outerHeight(),
          overlayMenuItemTHeight =
            overlayMenuItem.length * overlayMenuItemHeight,
          firstItemOffset = ($window.height() - overlayMenuItemTHeight) / 2;

        $('#primary-menu')
          .children('ul')
          .children('li:first-child')
          .css({ 'margin-top': firstItemOffset + 'px' });
      }
    },

    stickyMenu: function(headerOffset) {
      if ($window.scrollTop() > headerOffset) {
        if ($body.hasClass('device-lg') || $body.hasClass('device-md')) {
          $('body:not(.side-header) #header:not(.no-sticky)').addClass(
            'sticky-header'
          );
          if (!$headerWrap.hasClass('force-not-dark')) {
            $headerWrap.removeClass('not-dark');
          }
          SEMICOLON.header.stickyMenuClass();
        } else if (
          $body.hasClass('device-xs') ||
          $body.hasClass('device-xxs') ||
          $body.hasClass('device-sm')
        ) {
          if ($body.hasClass('sticky-responsive-menu')) {
            $('#header:not(.no-sticky)').addClass('responsive-sticky-header');
            SEMICOLON.header.stickyMenuClass();
          }
        }
      } else {
        SEMICOLON.header.removeStickyness();
      }
    },

    stickyPageMenu: function(pageMenuOffset) {
      if ($window.scrollTop() > pageMenuOffset) {
        if ($body.hasClass('device-lg') || $body.hasClass('device-md')) {
          $('#page-menu:not(.dots-menu,.no-sticky)').addClass(
            'sticky-page-menu'
          );
        } else if (
          $body.hasClass('device-xs') ||
          $body.hasClass('device-xxs') ||
          $body.hasClass('device-sm')
        ) {
          if ($body.hasClass('sticky-responsive-pagemenu')) {
            $('#page-menu:not(.dots-menu,.no-sticky)').addClass(
              'sticky-page-menu'
            );
          }
        }
      } else {
        $('#page-menu:not(.dots-menu,.no-sticky)').removeClass(
          'sticky-page-menu'
        );
      }
    },

    removeStickyness: function() {
      if ($header.hasClass('sticky-header')) {
        $('body:not(.side-header) #header:not(.no-sticky)').removeClass(
          'sticky-header'
        );
        $header.removeClass().addClass(oldHeaderClasses);
        $headerWrap.removeClass().addClass(oldHeaderWrapClasses);
        if (!$headerWrap.hasClass('force-not-dark')) {
          $headerWrap.removeClass('not-dark');
        }
        SEMICOLON.slider.swiperSliderMenu();
        SEMICOLON.slider.revolutionSliderMenu();
      }
      if ($header.hasClass('responsive-sticky-header')) {
        $('body.sticky-responsive-menu #header').removeClass(
          'responsive-sticky-header'
        );
      }
      if (
        ($body.hasClass('device-xs') ||
          $body.hasClass('device-xxs') ||
          $body.hasClass('device-sm')) &&
        typeof responsiveMenuClasses === 'undefined'
      ) {
        $header.removeClass().addClass(oldHeaderClasses);
        $headerWrap.removeClass().addClass(oldHeaderWrapClasses);
        if (!$headerWrap.hasClass('force-not-dark')) {
          $headerWrap.removeClass('not-dark');
        }
      }
    },

    sideHeader: function() {
      $('#header-trigger').click(function() {
        $('body.open-header').toggleClass('side-header-open');
        return false;
      });
    },

    sidePanel: function() {
      $('.side-panel-trigger').click(function() {
        $body.toggleClass('side-panel-open');
        if ($body.hasClass('device-touch')) {
          $body.toggleClass('ohidden');
        }
        return false;
      });
    },

    onePageScroll: function() {
      if ($onePageMenuEl.length > 0) {
        var onePageSpeed = $onePageMenuEl.attr('data-speed'),
          onePageOffset = $onePageMenuEl.attr('data-offset'),
          onePageEasing = $onePageMenuEl.attr('data-easing');

        if (!onePageSpeed) {
          onePageSpeed = 1000;
        }
        if (!onePageEasing) {
          onePageEasing = 'easeOutQuad';
        }

        $onePageMenuEl.find('a[data-href]').click(function() {
          var element = $(this),
            divScrollToAnchor = element.attr('data-href'),
            divScrollSpeed = element.attr('data-speed'),
            divScrollOffset = element.attr('data-offset'),
            divScrollEasing = element.attr('data-easing');

          if ($(divScrollToAnchor).length > 0) {
            if (!onePageOffset) {
              var onePageOffsetG = SEMICOLON.initialize.topScrollOffset();
            } else {
              var onePageOffsetG = onePageOffset;
            }

            if (!divScrollSpeed) {
              divScrollSpeed = onePageSpeed;
            }
            if (!divScrollOffset) {
              divScrollOffset = onePageOffsetG;
            }
            if (!divScrollEasing) {
              divScrollEasing = onePageEasing;
            }

            if ($onePageMenuEl.hasClass('no-offset')) {
              divScrollOffset = 0;
            }

            onePageGlobalOffset = Number(divScrollOffset);

            $onePageMenuEl.find('li').removeClass('current');
            $onePageMenuEl
              .find('a[data-href="' + divScrollToAnchor + '"]')
              .parent('li')
              .addClass('current');

            if (windowWidth < 768 || $body.hasClass('overlay-menu')) {
              if (
                $('#primary-menu').find('ul.mobile-primary-menu').length > 0
              ) {
                $(
                  '#primary-menu > ul.mobile-primary-menu, #primary-menu > div > ul.mobile-primary-menu'
                ).toggleClass(
                  'show',
                  function() {
                    $('html,body')
                      .stop(true)
                      .animate(
                        {
                          scrollTop:
                            $(divScrollToAnchor).offset().top -
                            Number(divScrollOffset),
                        },
                        Number(divScrollSpeed),
                        divScrollEasing
                      );
                  },
                  false
                );
              } else {
                $('#primary-menu > ul, #primary-menu > div > ul').toggleClass(
                  'show',
                  function() {
                    $('html,body')
                      .stop(true)
                      .animate(
                        {
                          scrollTop:
                            $(divScrollToAnchor).offset().top -
                            Number(divScrollOffset),
                        },
                        Number(divScrollSpeed),
                        divScrollEasing
                      );
                  },
                  false
                );
              }
            } else {
              $('html,body')
                .stop(true)
                .animate(
                  {
                    scrollTop:
                      $(divScrollToAnchor).offset().top -
                      Number(divScrollOffset),
                  },
                  Number(divScrollSpeed),
                  divScrollEasing
                );
            }

            onePageGlobalOffset = Number(divScrollOffset);
          }

          return false;
        });
      }
    },

    onepageScroller: function() {
      $onePageMenuEl.find('li').removeClass('current');
      $onePageMenuEl
        .find(
          'a[data-href="#' + SEMICOLON.header.onePageCurrentSection() + '"]'
        )
        .parent('li')
        .addClass('current');
    },

    onePageCurrentSection: function() {
      var currentOnePageSection = 'home',
        headerHeight = $headerWrap.outerHeight();

      if ($body.hasClass('side-header')) {
        headerHeight = 0;
      }

      $pageSectionEl.each(function(index) {
        var h = $(this).offset().top;
        var y = $window.scrollTop();

        var offsetScroll = headerHeight + onePageGlobalOffset;

        if (
          y + offsetScroll >= h &&
          y < h + $(this).height() &&
          $(this).attr('id') != currentOnePageSection
        ) {
          currentOnePageSection = $(this).attr('id');
        }
      });

      return currentOnePageSection;
    },

    logo: function() {
      if (
        ($header.hasClass('dark') || $body.hasClass('dark')) &&
        !$headerWrap.hasClass('not-dark')
      ) {
        if (defaultDarkLogo) {
          defaultLogo.find('img').attr('src', defaultDarkLogo);
        }
        if (retinaDarkLogo) {
          retinaLogo.find('img').attr('src', retinaDarkLogo);
        }
      } else {
        if (defaultLogoImg) {
          defaultLogo.find('img').attr('src', defaultLogoImg);
        }
        if (retinaLogoImg) {
          retinaLogo.find('img').attr('src', retinaLogoImg);
        }
      }
      if ($header.hasClass('sticky-header')) {
        if (defaultStickyLogo) {
          defaultLogo.find('img').attr('src', defaultStickyLogo);
        }
        if (retinaStickyLogo) {
          retinaLogo.find('img').attr('src', retinaStickyLogo);
        }
      }
      if ($body.hasClass('device-xs') || $body.hasClass('device-xxs')) {
        if (defaultMobileLogo) {
          defaultLogo.find('img').attr('src', defaultMobileLogo);
        }
        if (retinaMobileLogo) {
          retinaLogo.find('img').attr('src', retinaMobileLogo);
        }
      }
    },

    stickyMenuClass: function() {
      if (stickyMenuClasses) {
        var newClassesArray = stickyMenuClasses.split(/ +/);
      } else {
        var newClassesArray = '';
      }
      var noOfNewClasses = newClassesArray.length;

      if (noOfNewClasses > 0) {
        var i = 0;
        for (i = 0; i < noOfNewClasses; i++) {
          if (newClassesArray[i] == 'not-dark') {
            $header.removeClass('dark');
            $headerWrap.addClass('not-dark');
          } else if (newClassesArray[i] == 'dark') {
            $headerWrap.removeClass('not-dark force-not-dark');
            if (!$header.hasClass(newClassesArray[i])) {
              $header.addClass(newClassesArray[i]);
            }
          } else if (!$header.hasClass(newClassesArray[i])) {
            $header.addClass(newClassesArray[i]);
          }
        }
      }
    },

    responsiveMenuClass: function() {
      if (
        $body.hasClass('device-xs') ||
        $body.hasClass('device-xxs') ||
        $body.hasClass('device-sm')
      ) {
        if (responsiveMenuClasses) {
          var newClassesArray = responsiveMenuClasses.split(/ +/);
        } else {
          var newClassesArray = '';
        }
        var noOfNewClasses = newClassesArray.length;

        if (noOfNewClasses > 0) {
          var i = 0;
          for (i = 0; i < noOfNewClasses; i++) {
            if (newClassesArray[i] == 'not-dark') {
              $header.removeClass('dark');
              $headerWrap.addClass('not-dark');
            } else if (newClassesArray[i] == 'dark') {
              $headerWrap.removeClass('not-dark force-not-dark');
              if (!$header.hasClass(newClassesArray[i])) {
                $header.addClass(newClassesArray[i]);
              }
            } else if (!$header.hasClass(newClassesArray[i])) {
              $header.addClass(newClassesArray[i]);
            }
          }
        }
        SEMICOLON.header.logo();
      }
    },
  };

  SEMICOLON.slider = {
    init: function() {
      SEMICOLON.slider.sliderRun();
      SEMICOLON.slider.captionPosition();
    },
    sliderRun: function() {
      if (typeof Swiper === 'undefined') {
        console.log('sliderRun: Swiper not Defined.');
        return true;
      }

      if ($slider.hasClass('customjs')) {
        return true;
      }

      if ($slider.hasClass('swiper_wrapper')) {
        var element = $slider.filter('.swiper_wrapper'),
          elementDirection = element.attr('data-direction'),
          elementSpeed = element.attr('data-speed'),
          elementAutoPlay = element.attr('data-autoplay'),
          elementLoop = element.attr('data-loop'),
          elementEffect = element.attr('data-effect'),
          elementGrabCursor = element.attr('data-grab'),
          slideNumberTotal = element.find('#slide-number-total'),
          slideNumberCurrent = element.find('#slide-number-current');

        if (!elementSpeed) {
          elementSpeed = 300;
        }
        if (!elementDirection) {
          elementDirection = 'horizontal';
        }
        if (elementAutoPlay) {
          elementAutoPlay = Number(elementAutoPlay);
        }
        if (elementLoop == 'true') {
          elementLoop = true;
        } else {
          elementLoop = false;
        }
        if (!elementEffect) {
          elementEffect = 'slide';
        }
        if (elementGrabCursor == 'false') {
          elementGrabCursor = false;
        } else {
          elementGrabCursor = true;
        }
        var elementNavNext = '#slider-arrow-right',
          elementNavPrev = '#slider-arrow-left';

        swiperSlider = new Swiper(element.find('.swiper-parent'), {
          direction: elementDirection,
          speed: Number(elementSpeed),
          autoplay: elementAutoPlay,
          loop: elementLoop,
          effect: elementEffect,
          slidesPerView: 1,
          grabCursor: elementGrabCursor,
          prevButton: elementNavPrev,
          nextButton: elementNavNext,
          onInit: function(swiper) {
            element.find('.yt-bg-player').removeClass('customjs');
            $('.swiper-slide-active [data-caption-animate]').each(function() {
              var $toAnimateElement = $(this),
                toAnimateDelay = $toAnimateElement.attr('data-caption-delay'),
                toAnimateDelayTime = 0;
              if (toAnimateDelay) {
                toAnimateDelayTime = Number(toAnimateDelay) + 750;
              } else {
                toAnimateDelayTime = 750;
              }
              if (!$toAnimateElement.hasClass('animated')) {
                $toAnimateElement.addClass('not-animated');
                var elementAnimation = $toAnimateElement.attr(
                  'data-caption-animate'
                );
                setTimeout(function() {
                  $toAnimateElement
                    .removeClass('not-animated')
                    .addClass(elementAnimation + ' animated');
                }, toAnimateDelayTime);
              }
            });
            $('[data-caption-animate]').each(function() {
              var $toAnimateElement = $(this),
                elementAnimation = $toAnimateElement.attr(
                  'data-caption-animate'
                );
              if (
                $toAnimateElement
                  .parents('.swiper-slide')
                  .hasClass('swiper-slide-active')
              ) {
                return true;
              }
              $toAnimateElement
                .removeClass('animated')
                .removeClass(elementAnimation)
                .addClass('not-animated');
            });
            SEMICOLON.slider.swiperSliderMenu();
          },
          onSlideChangeStart: function(swiper) {
            if (slideNumberCurrent.length > 0) {
              if (elementLoop == true) {
                slideNumberCurrent.html(
                  Number(
                    element
                      .find('.swiper-slide.swiper-slide-active')
                      .attr('data-swiper-slide-index')
                  ) + 1
                );
              } else {
                slideNumberCurrent.html(swiperSlider.activeIndex + 1);
              }
            }
            $('[data-caption-animate]').each(function() {
              var $toAnimateElement = $(this),
                elementAnimation = $toAnimateElement.attr(
                  'data-caption-animate'
                );
              if (
                $toAnimateElement
                  .parents('.swiper-slide')
                  .hasClass('swiper-slide-active')
              ) {
                return true;
              }
              $toAnimateElement
                .removeClass('animated')
                .removeClass(elementAnimation)
                .addClass('not-animated');
            });
            SEMICOLON.slider.swiperSliderMenu();
          },
        });

        if (slideNumberCurrent.length > 0) {
          if (elementLoop == true) {
            slideNumberCurrent.html(
              Number(
                element
                  .find('.swiper-slide.swiper-slide-active')
                  .attr('data-swiper-slide-index')
              ) + 1
            );
          } else {
            slideNumberCurrent.html(swiperSlider.activeIndex + 1);
          }
        }
        if (slideNumberTotal.length > 0) {
          slideNumberTotal.html(
            element.find('.swiper-slide:not(.swiper-slide-duplicate)').length
          );
        }
      }
    },
    captionPosition: function() {
      $slider.find('.slider-caption:not(.custom-caption-pos)').each(function() {
        var scapHeight = $(this).outerHeight();
        var scapSliderHeight = $slider.outerHeight();
        if (
          $(this)
            .parents('#slider')
            .prev('#header')
            .hasClass('transparent-header') &&
          ($body.hasClass('device-lg') || $body.hasClass('device-md'))
        ) {
          if (
            $(this)
              .parents('#slider')
              .prev('#header')
              .hasClass('floating-header')
          ) {
            $(this).css({
              top: (scapSliderHeight + 160 - scapHeight) / 2 + 'px',
            });
          } else {
            $(this).css({
              top: (scapSliderHeight + 100 - scapHeight) / 2 + 'px',
            });
          }
        } else {
          $(this).css({ top: (scapSliderHeight - scapHeight) / 2 + 'px' });
        }
      });
    },

    swiperSliderMenu: function(onWinLoad) {
      onWinLoad = typeof onWinLoad !== 'undefined' ? onWinLoad : false;
      if ($body.hasClass('device-lg') || $body.hasClass('device-md')) {
        var activeSlide = $slider.find('.swiper-slide.swiper-slide-active');
        SEMICOLON.slider.headerSchemeChanger(activeSlide, onWinLoad);
      }
    },

    revolutionSliderMenu: function(onWinLoad) {
      onWinLoad = typeof onWinLoad !== 'undefined' ? onWinLoad : false;
      if ($body.hasClass('device-lg') || $body.hasClass('device-md')) {
        var activeSlide = $slider.find('.active-revslide');
        SEMICOLON.slider.headerSchemeChanger(activeSlide, onWinLoad);
      }
    },

    headerSchemeChanger: function(activeSlide, onWinLoad) {
      if (activeSlide.length > 0) {
        var darkExists = false;
        if (activeSlide.hasClass('dark')) {
          if (oldHeaderClasses) {
            var oldClassesArray = oldHeaderClasses.split(/ +/);
          } else {
            var oldClassesArray = '';
          }
          var noOfOldClasses = oldClassesArray.length;

          if (noOfOldClasses > 0) {
            var i = 0;
            for (i = 0; i < noOfOldClasses; i++) {
              if (oldClassesArray[i] == 'dark' && onWinLoad == true) {
                darkExists = true;
                break;
              }
            }
          }
          $(
            '#header.transparent-header:not(.sticky-header,.semi-transparent,.floating-header)'
          ).addClass('dark');
          if (!darkExists) {
            $(
              '#header.transparent-header.sticky-header,#header.transparent-header.semi-transparent.sticky-header,#header.transparent-header.floating-header.sticky-header'
            ).removeClass('dark');
          }
          $headerWrap.removeClass('not-dark');
        } else {
          if ($body.hasClass('dark')) {
            activeSlide.addClass('not-dark');
            $(
              '#header.transparent-header:not(.semi-transparent,.floating-header)'
            ).removeClass('dark');
            $(
              '#header.transparent-header:not(.sticky-header,.semi-transparent,.floating-header)'
            )
              .find('#header-wrap')
              .addClass('not-dark');
          } else {
            $(
              '#header.transparent-header:not(.semi-transparent,.floating-header)'
            ).removeClass('dark');
            $headerWrap.removeClass('not-dark');
          }
        }
        SEMICOLON.header.logo();
      }
    },

    owlCaptionInit: function() {
      if ($owlCarouselEl.length > 0) {
        $owlCarouselEl.each(function() {
          var element = $(this);
          if (element.find('.owl-dot').length > 0) {
            element.addClass('with-carousel-dots');
          }
        });
      }
    },
  };

  SEMICOLON.widget = {
    init: function() {
      SEMICOLON.widget.animations();
      SEMICOLON.widget.toggles();
      SEMICOLON.widget.accordions();
      SEMICOLON.widget.progress();
      SEMICOLON.widget.linkScroll();
    },

    animations: function() {
      if (!$().appear) {
        console.log('animations: Appear not Defined.');
        return true;
      }

      var $dataAnimateEl = $('[data-animate]');
      if ($dataAnimateEl.length > 0) {
        if (
          $body.hasClass('device-lg') ||
          $body.hasClass('device-md') ||
          $body.hasClass('device-sm')
        ) {
          $dataAnimateEl.each(function() {
            var element = $(this),
              animationOut = element.attr('data-animate-out'),
              animationDelay = element.attr('data-delay'),
              animationDelayOut = element.attr('data-delay-out'),
              animationDelayTime = 0,
              animationDelayOutTime = 3000;

            if (element.parents('.fslider.no-thumbs-animate').length > 0) {
              return true;
            }

            if (animationDelay) {
              animationDelayTime = Number(animationDelay) + 500;
            } else {
              animationDelayTime = 500;
            }
            if (animationOut && animationDelayOut) {
              animationDelayOutTime =
                Number(animationDelayOut) + animationDelayTime;
            }

            if (!element.hasClass('animated')) {
              element.addClass('not-animated');
              var elementAnimation = element.attr('data-animate');
              element.appear(
                function() {
                  setTimeout(function() {
                    element
                      .removeClass('not-animated')
                      .addClass(elementAnimation + ' animated');
                  }, animationDelayTime);

                  if (animationOut) {
                    setTimeout(function() {
                      element
                        .removeClass(elementAnimation)
                        .addClass(animationOut);
                    }, animationDelayOutTime);
                  }
                },
                { accX: 0, accY: -120 },
                'easeInCubic'
              );
            }
          });
        }
      }
    },

    loadFlexSlider: function() {
      if (!$().flexslider) {
        console.log('loadFlexSlider: FlexSlider not Defined.');
        return true;
      }

      var $flexSliderEl = $('.fslider:not(.customjs)').find('.flexslider');
      if ($flexSliderEl.length > 0) {
        $flexSliderEl.each(function() {
          var $flexsSlider = $(this),
            flexsAnimation = $flexsSlider
              .parent('.fslider')
              .attr('data-animation'),
            flexsEasing = $flexsSlider.parent('.fslider').attr('data-easing'),
            flexsDirection = $flexsSlider
              .parent('.fslider')
              .attr('data-direction'),
            flexsSlideshow = $flexsSlider
              .parent('.fslider')
              .attr('data-slideshow'),
            flexsPause = $flexsSlider.parent('.fslider').attr('data-pause'),
            flexsSpeed = $flexsSlider.parent('.fslider').attr('data-speed'),
            flexsVideo = $flexsSlider.parent('.fslider').attr('data-video'),
            flexsPagi = $flexsSlider.parent('.fslider').attr('data-pagi'),
            flexsArrows = $flexsSlider.parent('.fslider').attr('data-arrows'),
            flexsThumbs = $flexsSlider.parent('.fslider').attr('data-thumbs'),
            flexsHover = $flexsSlider.parent('.fslider').attr('data-hover'),
            flexsSheight = $flexsSlider
              .parent('.fslider')
              .attr('data-smooth-height'),
            flexsUseCSS = false;

          if (!flexsAnimation) {
            flexsAnimation = 'slide';
          }
          if (!flexsEasing || flexsEasing == 'swing') {
            flexsEasing = 'swing';
            flexsUseCSS = true;
          }
          if (!flexsDirection) {
            flexsDirection = 'horizontal';
          }
          if (!flexsSlideshow) {
            flexsSlideshow = true;
          } else {
            flexsSlideshow = false;
          }
          if (!flexsPause) {
            flexsPause = 5000;
          }
          if (!flexsSpeed) {
            flexsSpeed = 600;
          }
          if (!flexsVideo) {
            flexsVideo = false;
          }
          if (flexsSheight == 'false') {
            flexsSheight = false;
          } else {
            flexsSheight = true;
          }
          if (flexsDirection == 'vertical') {
            flexsSheight = false;
          }
          if (flexsPagi == 'false') {
            flexsPagi = false;
          } else {
            flexsPagi = true;
          }
          if (flexsThumbs == 'true') {
            flexsPagi = 'thumbnails';
          } else {
            flexsPagi = flexsPagi;
          }
          if (flexsArrows == 'false') {
            flexsArrows = false;
          } else {
            flexsArrows = true;
          }
          if (flexsHover == 'false') {
            flexsHover = false;
          } else {
            flexsHover = true;
          }

          $flexsSlider.flexslider({
            selector: '.slider-wrap > .slide',
            animation: flexsAnimation,
            easing: flexsEasing,
            direction: flexsDirection,
            slideshow: flexsSlideshow,
            slideshowSpeed: Number(flexsPause),
            animationSpeed: Number(flexsSpeed),
            pauseOnHover: flexsHover,
            video: flexsVideo,
            controlNav: flexsPagi,
            directionNav: flexsArrows,
            smoothHeight: flexsSheight,
            useCSS: flexsUseCSS,
            start: function(slider) {
              SEMICOLON.widget.animations();
              SEMICOLON.initialize.verticalMiddle();
              slider.parent().removeClass('preloader2');
              var t = setTimeout(function() {
                $('.grid-container').isotope('layout');
              }, 1200);
              $('.flex-prev').html('<i class="icon-angle-left"></i>');
              $('.flex-next').html('<i class="icon-angle-right"></i>');
            },
          });
        });
      }
    },

    toggles: function() {
      var $toggle = $('.toggle');
      if ($toggle.length > 0) {
        $toggle.each(function() {
          var element = $(this),
            elementState = element.attr('data-state');

          if (elementState != 'open') {
            element.children('.togglec').hide();
          } else {
            element.children('.togglet').addClass('toggleta');
          }

          element.children('.togglet').click(function() {
            $(this)
              .toggleClass('toggleta')
              .next('.togglec')
              .slideToggle(300);
            return true;
          });
        });
      }
    },

    accordions: function() {
      var $accordionEl = $('.accordion');
      if ($accordionEl.length > 0) {
        $accordionEl.each(function() {
          var element = $(this),
            elementState = element.attr('data-state'),
            accordionActive = element.attr('data-active');

          if (!accordionActive) {
            accordionActive = 0;
          } else {
            accordionActive = accordionActive - 1;
          }

          element.find('.acc_content').hide();

          if (elementState != 'closed') {
            element
              .find('.acctitle:eq(' + Number(accordionActive) + ')')
              .addClass('acctitlec')
              .next()
              .show();
          }

          element.find('.acctitle').click(function() {
            if (
              $(this)
                .next()
                .is(':hidden')
            ) {
              element
                .find('.acctitle')
                .removeClass('acctitlec')
                .next()
                .slideUp('normal');
              $(this)
                .toggleClass('acctitlec')
                .next()
                .slideDown('normal');
            }
            return false;
          });
        });
      }
    },

    counter: function() {
      if (!$().appear) {
        console.log('counter: Appear not Defined.');
        return true;
      }

      if (!$().countTo) {
        console.log('counter: countTo not Defined.');
        return true;
      }

      var $counterEl = $('.counter:not(.counter-instant)');
      if ($counterEl.length > 0) {
        $counterEl.each(function() {
          var element = $(this);
          var counterElementComma = $(this)
            .find('span')
            .attr('data-comma');
          if (!counterElementComma) {
            counterElementComma = false;
          } else {
            counterElementComma = true;
          }
          if ($body.hasClass('device-lg') || $body.hasClass('device-md')) {
            element.appear(
              function() {
                SEMICOLON.widget.runCounter(element, counterElementComma);
                if (element.parents('.common-height')) {
                  SEMICOLON.initialize.maxHeight();
                }
              },
              { accX: 0, accY: -120 },
              'easeInCubic'
            );
          } else {
            SEMICOLON.widget.runCounter(element, counterElementComma);
          }
        });
      }
    },
    progress: function() {
      if (!$().appear) {
        console.log('progress: Appear not Defined.');
        return true;
      }

      var $progressEl = $('.progress');
      if ($progressEl.length > 0) {
        $progressEl.each(function() {
          var element = $(this),
            skillsBar = element.parent('li'),
            skillValue = skillsBar.attr('data-percent');

          if ($body.hasClass('device-lg') || $body.hasClass('device-md')) {
            element.appear(
              function() {
                if (!skillsBar.hasClass('skills-animated')) {
                  element.find('.counter-instant span').countTo();
                  skillsBar
                    .find('.progress')
                    .css({ width: skillValue + '%' })
                    .addClass('skills-animated');
                }
              },
              { accX: 0, accY: -120 },
              'easeInCubic'
            );
          } else {
            element.find('.counter-instant span').countTo();
            skillsBar.find('.progress').css({ width: skillValue + '%' });
          }
        });
      }
    },

    linkScroll: function() {
      $('a[data-scrollto]').click(function() {
        var element = $(this),
          divScrollToAnchor = element.attr('data-scrollto'),
          divScrollSpeed = element.attr('data-speed'),
          divScrollOffset = element.attr('data-offset'),
          divScrollEasing = element.attr('data-easing'),
          divScrollHighlight = element.attr('data-highlight');

        if (!divScrollSpeed) {
          divScrollSpeed = 750;
        }
        if (!divScrollOffset) {
          divScrollOffset = SEMICOLON.initialize.topScrollOffset();
        }
        if (!divScrollEasing) {
          divScrollEasing = 'easeOutQuad';
        }

        $('html,body')
          .stop(true)
          .animate(
            {
              scrollTop:
                $(divScrollToAnchor).offset().top - Number(divScrollOffset),
            },
            Number(divScrollSpeed),
            divScrollEasing,
            function() {
              if (divScrollHighlight) {
                if ($(divScrollToAnchor).find('.highlight-me').length > 0) {
                  $(divScrollToAnchor)
                    .find('.highlight-me')
                    .animate({ backgroundColor: divScrollHighlight }, 300);
                  var t = setTimeout(function() {
                    $(divScrollToAnchor)
                      .find('.highlight-me')
                      .animate({ backgroundColor: 'transparent' }, 300);
                  }, 500);
                } else {
                  $(divScrollToAnchor).animate(
                    { backgroundColor: divScrollHighlight },
                    300
                  );
                  var t = setTimeout(function() {
                    $(divScrollToAnchor).animate(
                      { backgroundColor: 'transparent' },
                      300
                    );
                  }, 500);
                }
              }
            }
          );

        return false;
      });
    },
  };

  SEMICOLON.isMobile = {
    Android: function() {
      return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function() {
      return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function() {
      return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function() {
      return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function() {
      return navigator.userAgent.match(/IEMobile/i);
    },
    any: function() {
      return (
        SEMICOLON.isMobile.Android() ||
        SEMICOLON.isMobile.BlackBerry() ||
        SEMICOLON.isMobile.iOS() ||
        SEMICOLON.isMobile.Opera() ||
        SEMICOLON.isMobile.Windows()
      );
    },
  };

  SEMICOLON.documentOnResize = {
    init: function() {
      var t = setTimeout(function() {
        SEMICOLON.header.fullWidthMenu();
        SEMICOLON.header.overlayMenu();
        SEMICOLON.initialize.fullScreen();
        SEMICOLON.initialize.verticalMiddle();
        SEMICOLON.initialize.maxHeight();
        SEMICOLON.initialize.testimonialsGrid();
        SEMICOLON.initialize.stickyFooter();
        SEMICOLON.slider.captionPosition();
        SEMICOLON.initialize.dataResponsiveClasses();
        SEMICOLON.initialize.dataResponsiveHeights();
        if ($gridContainer.length > 0) {
          if (!$gridContainer.hasClass('.customjs')) {
            if ($().isotope) {
              $gridContainer.isotope('layout');
            } else {
              console.log('documentOnResize > init: Isotope not defined.');
            }
          }
        }
        if ($body.hasClass('device-lg') || $body.hasClass('device-md')) {
          $('#primary-menu')
            .find('ul.mobile-primary-menu')
            .removeClass('show');
        }
      }, 500);
      windowWidth = $window.width();
    },
  };

  SEMICOLON.documentOnReady = {
    init: function() {
      SEMICOLON.initialize.init();
      SEMICOLON.header.init();
      if ($slider.length > 0) {
        SEMICOLON.slider.init();
      }
      SEMICOLON.widget.init();
      SEMICOLON.documentOnReady.windowscroll();
    },

    windowscroll: function() {
      var headerOffset = 0,
        headerWrapOffset = 0,
        pageMenuOffset = 0;

      if ($header.length > 0) {
        headerOffset = $header.offset().top;
      }
      if ($header.length > 0) {
        headerWrapOffset = $headerWrap.offset().top;
      }
      if ($pagemenu.length > 0) {
        if ($header.length > 0 && !$header.hasClass('no-sticky')) {
          if (
            $header.hasClass('sticky-style-2') ||
            $header.hasClass('sticky-style-3')
          ) {
            pageMenuOffset = $pagemenu.offset().top - $headerWrap.outerHeight();
          } else {
            pageMenuOffset = $pagemenu.offset().top - $header.outerHeight();
          }
        } else {
          pageMenuOffset = $pagemenu.offset().top;
        }
      }

      var headerDefinedOffset = $header.attr('data-sticky-offset');
      if (typeof headerDefinedOffset !== 'undefined') {
        if (headerDefinedOffset == 'full') {
          headerWrapOffset = $window.height();
          var headerOffsetNegative = $header.attr(
            'data-sticky-offset-negative'
          );
          if (typeof headerOffsetNegative !== 'undefined') {
            headerWrapOffset = headerWrapOffset - headerOffsetNegative - 1;
          }
        } else {
          headerWrapOffset = Number(headerDefinedOffset);
        }
      }

      SEMICOLON.header.stickyMenu(headerWrapOffset);
      SEMICOLON.header.stickyPageMenu(pageMenuOffset);
      $window.on('scroll', function() {
        SEMICOLON.initialize.goToTopScroll();
        $('body.open-header.close-header-on-scroll').removeClass(
          'side-header-open'
        );
        SEMICOLON.header.stickyMenu(headerWrapOffset);
        SEMICOLON.header.stickyPageMenu(pageMenuOffset);
        SEMICOLON.header.logo();
      });

      if ($onePageMenuEl.length > 0) {
        if ($().scrolled) {
          $window.scrolled(function() {
            SEMICOLON.header.onepageScroller();
          });
        } else {
          console.log('windowscroll: Scrolled Function not defined.');
        }
      }
    },
  };

  SEMICOLON.documentOnLoad = {
    init: function() {
      SEMICOLON.slider.captionPosition();
      SEMICOLON.slider.swiperSliderMenu(true);
      SEMICOLON.slider.revolutionSliderMenu(true);
      SEMICOLON.initialize.maxHeight();
      SEMICOLON.initialize.testimonialsGrid();
      SEMICOLON.initialize.verticalMiddle();
      SEMICOLON.initialize.stickFooterOnSmall();
      SEMICOLON.initialize.stickyFooter();
      SEMICOLON.widget.loadFlexSlider();
      SEMICOLON.header.responsiveMenuClass();
    },
  };

  var $window = $(window),
    $body = $('body'),
    $wrapper = $('#wrapper'),
    $header = $('#header'),
    $headerWrap = $('#header-wrap'),
    $content = $('#content'),
    $footer = $('#footer'),
    windowWidth = $window.width(),
    oldHeaderClasses = $header.attr('class'),
    oldHeaderWrapClasses = $headerWrap.attr('class'),
    stickyMenuClasses = $header.attr('data-sticky-class'),
    responsiveMenuClasses = $header.attr('data-responsive-class'),
    defaultLogo = $('#logo').find('.standard-logo'),
    retinaLogo = $('#logo').find('.retina-logo'),
    defaultLogoImg = defaultLogo.find('img').attr('src'),
    retinaLogoImg = retinaLogo.find('img').attr('src'),
    defaultDarkLogo = defaultLogo.attr('data-dark-logo'),
    retinaDarkLogo = retinaLogo.attr('data-dark-logo'),
    defaultStickyLogo = defaultLogo.attr('data-sticky-logo'),
    retinaStickyLogo = retinaLogo.attr('data-sticky-logo'),
    defaultMobileLogo = defaultLogo.attr('data-mobile-logo'),
    retinaMobileLogo = retinaLogo.attr('data-mobile-logo'),
    $pagemenu = $('#page-menu'),
    $onePageMenuEl = $('.one-page-menu'),
    onePageGlobalOffset = 0,
    $gridContainer = $('.grid-container'),
    $slider = $('#slider'),
    swiperSlider = '',
    $verticalMiddleEl = $('.vertical-middle'),
    $siStickyEl = $('.si-sticky'),
    $dotsMenuEl = $('.dots-menu'),
    $goToTopEl = $('#gotoTop'),
    $fullScreenEl = $('.full-screen'),
    $commonHeightEl = $('.common-height'),
    $testimonialsGridEl = $('.testimonials-grid'),
    $pageSectionEl = $('.page-section'),
    $owlCarouselEl = $('.owl-carousel');

  $(document).ready(SEMICOLON.documentOnReady.init);
  $window.load(SEMICOLON.documentOnLoad.init);
  $window.on('resize', SEMICOLON.documentOnResize.init);
})(jQuery);
