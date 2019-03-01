var $xBar = $(".x-bar"),
  $sideNav = $(".side-nav"),
  $menuIcon = $(".menu-icon"),
  $reqQuote = $(".reqQuote"),
  $addVend = $(".addVend"),
  $modVend = $(".modVend")
  ;



$menuIcon.click(function() {
  $sideNav.css({
    left: 0
  });
  $menuIcon.fadeOut(5);
  $xBar.css({
    top: 300
  });
  if ($(window).width() < 767) {
    $sideNav.css({
      left: 0
    });
  }
  if ($(window).width() < 992) {
    $sideNav.css({
      width: 270
    });
  }
});



$xBar.click(function() {
  $sideNav.css({
    left: -307
  });
  $menuIcon.fadeIn(500);
  $xBar.css({
    top: -30,
   
  });
  if ($(window).width() < 767) {
    $sideNav.css({
      left: -100 + "%"
    });
  }
  if ($(window).width() < 991 && $(window).width() > 1199) {
    $sideNav.css({
      left: -270
    }) ;
  }
});



$(document).ready(function(){

  $addUser.click(function() {
    $("form").load('/partials/partial-purch/quote.ejs').css({
       opacity: 0 ,}).delay( 150 ).fadeTo("normal",1);
});



$removeUser.click(function() {
  $("form").load('/partials/partial-admin/remove.ejs').css({
    opacity: 0 ,}).delay( 150 ).fadeTo("normal",1);
});



  $reqQuote.click(function() {
      $("form").load('/partials/partial-purch/quote.ejs').css({
         opacity: 0 ,}).delay( 150 ).fadeTo("normal",1);
  });



  $addVend.click(function() {
    $("form").load('/partials/partial-purch/addvend.ejs').css({
      opacity: 0 ,}).delay( 150 ).fadeTo("normal",1);
  });




  $modVend.click(function() {
    $("form").load('/partials/partial-purch/modvend.ejs').css({
      opacity: 0 ,}).delay( 150 ).fadeTo("normal",1);
  });


});
