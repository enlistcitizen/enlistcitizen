jQuery(function($){

  // on scroll stories animations
function ctlStoryAnimation_loadMore(){
	// enabled animation on page scroll
	$(".cooltimeline_cont").each(function(index ){
		var timeline_id=$(this).attr('id');
		var animations=$("#"+timeline_id).attr("data-animations");
	if(animations!="none") {
		// You can also pass an optional settings object
		// below listed default settings
		AOS.init({
			// Global settings:
			disable:'mobile', // accepts following values: 'phone', 'tablet', 'mobile', boolean, expression or function
			startEvent: 'DOMContentLoaded', // name of the event dispatched on the document, that AOS should initialize on
			offset: 75, // offset (in px) from the original trigger point
			delay: 0, // values from 0 to 3000, with step 50ms
			duration: 750, // values from 0 to 3000, with step 50ms
			easing: 'ease-in-out-sine', // default easing for AOS animations
			mirror: true,
		});
			
			}
	});
}

  // story timeline load more 
  if(typeof ctlloadmore != 'undefined' && typeof ctlloadmore.attribute != 'undefined') 
    {   
    var page =2;
    var loading = false;

      if($('.cool_timeline').find('.ctl_load_more').attr("data-max-num-pages") == 1) {
        $('.cool_timeline').find('.ctl_load_more').hide();
      }
      else{
        // enable load more button in year navigation
        var timelineWrapper=$(".cool_timeline");
        naviLoadMoreBtn(timelineWrapper);
      }
  
   
    $('body').on('click', '.ctl_load_more', function(){
       var timeline_wrp= $(this).parents('.cool_timeline');
       var org_label=$(this).text();
       var loading_text=$(this).attr("data-loading-text");
       var button = timeline_wrp.find('.ctl_load_more');
       var type=$(this).attr("data-timeline-type");
       var last_year = timeline_wrp.find('.timeline-year:last').data('section-title');
        if(type=="compact"){
            var last_year = timeline_wrp.find('.compact-year:last').data('section-title');
         }else{
            var last_year = timeline_wrp.find('.timeline-year:last').data('section-title');
         }
         var allAtts= ctlloadmore.attribute;
         var alternate = timeline_wrp.find('.timeline-post:last').data('alternate');
         
       if($('.ct-cat-filters').length  && $('.ct-cat-filters').hasClass('active-category')) {
            var filterCat=$('.active-category').data('term-slug');
            allAtts.category=filterCat;
       }

        if( ! loading ) {
           $(this).html(loading_text);
          var max_pages= $(this).attr("data-max-num-pages");
          var max_page_num=parseInt(max_pages)+1;
          loading = true;
                var data = {
                    action: 'ctl_ajax_load_more',
                    page: page,
                    last_year:last_year,
                    alternate:alternate,
                    attribute:allAtts,
                    nonce:ctlloadmore.nonce
                };
                $.post(ctlloadmore.url, data, function(res) {
                    if( res.success) {
                    if(type=="compact"){
                        var $grid= timeline_wrp.find('.clt-compact-cont').append( res.data );
                        ctlCompactSettings($grid);
                    }else{
                       timeline_wrp.find('.cooltimeline_cont').append( res.data );
                    }
                //    if(type!="compact"){
                    storyYearNavigation(timeline_wrp);
                  //  }
                    enableStoryPopup(timeline_wrp);
                    storySlideShow(timeline_wrp);
                    naviLoadMoreBtn(timeline_wrp);
                   ctlStoryAnimation_loadMore();
                       button.html(org_label);
                       page = page + 1;
                         loading = false;
                       if(page>=max_page_num){
                        $('.ctl_load_more , .ctl_load_more_clone').hide();
                          }

                    } else {
                        // console.log(res);
                    }
                }).fail(function(xhr, textStatus, e) {
                   console.log(xhr.responseText);
                });

            }
        });
  }

// content timeline load more
if(typeof ct_load_more != 'undefined' && typeof ct_load_more.attribute != 'undefined') 
    {   

    var page =2;
    var loading = false;
    
    $('body').on('click', '.ctl_load_more', function(){
       var timeline_wrp= $(this).parents('.cool_timeline');
       var button = timeline_wrp.find('.ctl_load_more');
         var type=$(this).attr("data-timeline-type");
         if(type=="compact"){
            var last_year = timeline_wrp.find('.compact-year:last').data('section-title');
         }else{
        var last_year = timeline_wrp.find('.timeline-year:last').data('section-title');
         }
 
       var alternate = timeline_wrp.find('.timeline-post:last').data('alternate');
       var org_label=$(this).text();
       var loading_text=$(this).attr("data-loading-text");
       var allAtts= ct_load_more.attribute;
     
       if($('.ct-cat-filters').length  && $('.ct-cat-filters').hasClass('active-category')) {
            var filterCat=$('.active-category').data('term-slug');
            allAtts['post-category']=filterCat;
           
       }

        if( ! loading ) {
          $(this).html(loading_text);
          var max_pages= $(this).attr("data-max-num-pages");
          var max_page_num=parseInt(max_pages)+1;
         
             loading = true;
                var data = {
                    action: 'ct_ajax_load_more',
                    page: page,
                    last_year:last_year,
                    alternate:alternate,
                    attribute:allAtts,
                    nonce:ct_load_more.nonce
                };

             $.post(ct_load_more.url, data, function(res) {
                    if( res.success) {
                     if(type=="compact"){
                        var $grid= timeline_wrp.find('.clt-compact-cont').append( res.data );
                        ctlCompactSettings($grid);
                    }else{
                       timeline_wrp.find('.cooltimeline_cont').append( res.data );
                    }
                       storyYearNavigation(timeline_wrp);
                       enableStoryPopup(timeline_wrp);
                         page = page + 1;
                         loading = false;
                        button.html(org_label);
                         timeline_wrp.find("a[class^='ctl_prettyPhoto']").prettyPhoto({
                             social_tools: false 
                             });
                           timeline_wrp.find("a[rel^='ctl_prettyPhoto']").prettyPhoto({
                              social_tools: false
                            });
                       if(page>=max_page_num){
                            button.hide();
                          }

                    } else {
                        // console.log(res);
                    }
                }).fail(function(xhr, textStatus, e) {
                   console.log(xhr.responseText);
                });

            }
       });
   }

   // category based dynamic filtering for both layouts
    $(".ct-cat-filters").on("click",function($event){
        $event.preventDefault();
        
      $(".cat-filter-wrp ul li a").removeClass('active-category');
      $(this).addClass('active-category');
       var cat_name=$(this).text();
       var parent_wrp= $(this).parents(".cool_timeline");
       var preloader= parent_wrp.find('.filter-preloaders');
 //   parent_wrp.find(".custom-pagination").hide();
 //    parent_wrp.find(".ctl_load_more").hide();
   //     $(this).parents().find('.ctl_load_more').show();
  
       preloader.show();
       var parent_id=parent_wrp.attr("id");
       var navigation="#"+parent_id+"-navi";
       var termSlug=$(this).data("term-slug");
       var totalPosts=parseInt($(this).data("post-count"));
        var action=$(this).data("action");
        var tm_type=$(this).data("tm-type");
        var type=$(this).data("type"); 
       var loading = false;
       var org_label=$(this).text();
       var loading_text=$(this).attr("data-loading-text");
     
       if(type=="compact"){
          var last_year = parent_wrp.find('.compact-year:last').data('section-title');
       }else{
      var last_year = parent_wrp.find('.timeline-year:last').data('section-title');
       }
       var alternate = parent_wrp.find('.timeline-post:last').data('alternate');
        if(tm_type=="story-tm"){
           var all_attrs= ctlloadmore.attribute;
           var ajax_url= ctlloadmore.url;
           var nonce= ctlloadmore.nonce;
        }else{
         var all_attrs= ct_load_more.attribute;
         var ajax_url= ct_load_more.url;
         var nonce= ct_load_more.nonce;
        }
    
        var showPosts=$(".cool-timeline-wrapper").attr("data-showposts");
        var countPages=Math.ceil(totalPosts/showPosts);

        $('.ctl_load_more').attr('data-max-num-pages',  countPages);
        page =2;
       
        if(totalPosts>showPosts){
            $(this).parents('.cool_timeline').find('.ctl_load_more').show();
         }
        else {
            $(this).parents('.cool_timeline').find('.ctl_load_more').hide();
        }

        all_attrs.category=termSlug;
        if( ! loading ) {
            if(type=="compact"){
                 parent_wrp.find('.clt-compact-cont').html(' ');
            }else{
                 parent_wrp.find('.cooltimeline_cont').html(' ');
            }
               loading = true;
                var data = {
                    action:action,
                    last_year:last_year,
                    alternate:alternate,
                    termslug:termSlug,
                    attribute:all_attrs,
                    nonce:nonce
                };
                $.post(ajax_url, data, function(res) {
                    if(typeof res =='string'){
                        if(res!= 'undefined'){
                          res = JSON.parse(res) 
                          }
                    }
                    if( res.success) {
                        if(type=="compact"){
                          if(res.data!==undefined && res.data!=""){
                        parent_wrp.find('.clt-compact-cont').append('<div class="center-line"></div>');
                        var $grid= parent_wrp.find('.clt-compact-cont').append( res.data );
                        ctlCompactSettings($grid);
                        parent_wrp.find(".ctl_load_more").removeClass('clt-hide-it');
                          }else{
                            parent_wrp.find(".ctl_load_more").addClass('clt-hide-it'); 
                          }
                    }else{
                      if(res.data!==undefined && res.data!=""){
                       parent_wrp.find('.cooltimeline_cont').append( res.data );
                       parent_wrp.find(".ctl_load_more").removeClass('clt-hide-it');
                      }else{
                        parent_wrp.find(".ctl_load_more").addClass('clt-hide-it');
                      }
                    }   
                           loading = false;
                           preloader.hide();
                      
                          $(parent_wrp).find(".timeline-main-title").text(cat_name);
                          $(parent_wrp).find(".no-content").hide();
                           storyYearNavigation(parent_wrp);
                           enableStoryPopup(parent_wrp);
                           storySlideShow(parent_wrp);
                            naviLoadMoreBtn(parent_wrp);
                        
                            var timeline_id=jQuery('.cooltimeline_cont').attr('id');
                            var animations=jQuery("#"+timeline_id).attr("data-animations");
                            if(animations!="none") {
                              AOS.refreshHard();
                            }
                    } else {
                        // console.log(res);
                    }
                }).fail(function(xhr, textStatus, e) {
                   console.log(xhr.responseText);
                });
               
          }      
       });

    /*
    *  Helper funcitons
    */


  // re-enable compact masonry layout grid
  function ctlCompactSettings($grid){
    if($grid !=undefined){
      $grid.masonry('reloadItems');
      $grid.imagesLoaded().progress( function() {
        $grid.masonry('layout');
      });
      $grid.on( 'layoutComplete',
        function() {
          var leftPos = 0;
          var topPosDiff;
          $grid.find('.timeline-mansory').each(function(index) {
              leftPos = $(this).position().left;
              if (leftPos <= 0) {
                  $(this).removeClass("ctl-right").addClass('ctl-left');
              } else {
                  $(this).removeClass("ctl-left").addClass('ctl-right');
              }

              topPosDiff = $(this).position().top - $(this).prev().position().top;
              if(topPosDiff < 40) {
                  $(this).find('.timeline-icon').css({
                      'margin-top': '32px'
                  });
                  $(this).prev().find('.timeline-icon').css({
                      'margin-top': '6px'
                  });

                  $(this).find('.content-title').removeClass("compact-afterup").addClass('compact-afterdown');
                  $(this).prev().find('.content-title').removeClass("compact-afterdown").addClass('compact-afterup');
              }
          });
          var timeline_id=jQuery('.cooltimeline_cont').attr('id');
          var animations=jQuery("#"+timeline_id).attr("data-animations");
         	if(animations!="none") {
        		AOS.refreshHard();
        	}
          
        }
      );
    }  
  }


    // re-enable pretty photo
  function enableStoryPopup(timeline_wrp){
     if(timeline_wrp !=undefined){
    timeline_wrp.find("a[class^='ctl_prettyPhoto']").prettyPhoto({
     social_tools: false 
     });
    timeline_wrp.find("a[rel^='ctl_prettyPhoto']").prettyPhoto({
      social_tools: false
    });
    $(".cool_timeline").find("a[ref^='prettyPhoto']").prettyPhoto({
      social_tools: false,
      show_title:false,
     changepicturecallback: function(){ initialize(); },
      callback: function(){unInitialize()},
   }); 
    }     
  }



function storySlideShow(container){
 	container.find(".ctl_flexslider .slides").not('.slick-initialized').each(function(){
	$(this).find("a[class^='ctl_prettyPhoto']").prettyPhoto({ social_tools:false, show_title:false }); 
	var autoplaySpeed=parseInt($(this).data('animationspeed'));
	var slideshow=$(this).data('slideshow');
	$(this).slick({
		dots: false,
		infinite: false,
		arrows:true,
		mobileFirst:true,
		pauseOnHover:true,
		slidesToShow:1,
		autoplay:slideshow,
		autoplaySpeed:autoplaySpeed,
		 adaptiveHeight: true,
	  });      
	}); 
}
// year navigation load more function
  function naviLoadMoreBtn(parent_wrp){
 
    if(parent_wrp.find(".ctl_load_more").length && $("body").find(".ctl-bullets-container ul li").length){
      parent_wrp.find(".ctl_load_more").each(function(){
        var loadMoreBtn=$(this);
        var timelineId=loadMoreBtn.parents(".cool_timeline").attr("id");
          var naviContainer=$("#"+timelineId+"-navi");
         
          var buttonHtml='<button data-text="..Loading" class="ctl_load_more_clone">Load More</button>'
           naviContainer.find("ul").after(buttonHtml);
           naviContainer.find(".ctl_load_more_clone").on("click",function(){
            var text=$(this).data("text");
            $(this).text(text);
            loadMoreBtn.trigger("click");
          });
      });
  
   
     
 /*  $(".ctl_load_more_clone").on("click",function(){
     var text=$(this).data("text");
     $(this).text(text);
      $('.cool_timeline').find('.ctl_load_more').trigger("click");
    }); */
  }
  }

  // enable slideshow in popup in minimal design
  function initialize(){
    $(".ctl_popup_slick .slides").each(function(){
      $(this).slick({
        dots: false,
        infinite: false,
        slidesToShow:1,
        autoplay:false,
        autoplaySpeed: 2000,
         adaptiveHeight: true
      });      
      }); 
    }

    //unset on close
    function unInitialize(){
      $(".ctl_popup_slick .slides").each(function(){
      $(this).slick('unslick');      
      }); 
      }


  // re-enable scrolling navigation 
function storyYearNavigation(timeline_wrp){
      if(timeline_wrp !=undefined){
      var wrp_id= timeline_wrp.attr("id");
      $("#"+wrp_id+'-navi').remove();

      var pagination= timeline_wrp.attr('data-pagination');
              var pagination_position= timeline_wrp.attr('data-pagination-position');
              var bull_cls='';
              var position='';
              if(pagination_position=="left"){
                 bull_cls='section-bullets-left';
                position='left';
              }else if(pagination_position=="right"){
                 bull_cls='section-bullets-right';
                position='right';
              }else if(pagination_position=="bottom"){
                 bull_cls='section-bullets-bottom';
                position='bottom';
              } 
            $('body').sectionScroll({
                // CSS class for bullet navigation
                bulletsClass:bull_cls,
               // CSS class for sectioned content
                sectionsClass:'scrollable-section',
                // scroll duration in ms
                scrollDuration: 1500,
               // displays titles on hover
                titles: true,
                 // top offset in pixels
                topOffset:2,
              // easing opiton
                easing: '',
                id:wrp_id,
                position:position,
              });
              }        
      }


});
