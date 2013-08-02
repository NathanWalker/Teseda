AppControllers.controller "HomeCtrl", ["LogService", "$scope", "$rootScope", "$filter", "$timeout", (log, s, $rootScope, $filter, $timeout) ->
  s.carouselInterval = 6000;
  s.slides = [
    {
      active:true,
      view:'views/carousel/1.html'
    },
    {
      active:false,
      view:'views/carousel/2.html'
    },
    {
      active:false,
      view:'views/carousel/3.html'
    },
    {
      active:false,
      view:'views/carousel/4.html'
    }
  ]

  s.slides2 = [
    {
      active:true,
      view:'assets/carousel_1.jpg'
    },
    {
      active:false,
      view:'assets/carousel_2.gif'
    },
    {
      active:false,
      view:'assets/carousel_3.gif'
    }
  ]
]
