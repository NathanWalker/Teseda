AppControllers.controller "PartnersCtrl", ["LogService", "$scope", "$rootScope", "$location", "$http", (log, s, $rootScope, $location, $http) ->

  logo = (name) ->
    "img/partners/#{name}.png"

  s.partners = [
    {
      name:'Cadence'
      logo:logo('cadence')
      link:"http://www.cadence.com/"
    },
    {
      name:'DTS'
      logo:logo('dts')
      link:"http://www.dynamic-test.com/"
    },
    {
      name:'Maojet'
      logo:logo('maojet')
      link:"http://www.maojet.com.tw/"
    },
    {
      name:'Mentor Graphics'
      logo:logo('mentor')
      link:"http://www.mentor.com/"
    },
    {
      name:'Neosem'
      logo:logo('neosem')
      link:"http://www.neosem.com/"
    },
    {
      name:'Qualitel'
      logo:logo('qualitel')
      link:"http://www.qualitelcorp.com/"
    },
    {
      name:'Ridgetop Group'
      logo:logo('ridgetop')
      link:"http://www.ridgetopgroup.com/"
    },
    {
      name:'Sector Technologies'
      logo:logo('sector')
      link:"http://www.sector-technologies.com/"
    },
    {
      name:'Synopsys'
      logo:logo('synopsys')
      link:"http://www.synopsys.com/"
    },
    {
      name:'Teradyne'
      logo:logo('teradyne')
      link:"http://www.teradyne.com/"
    },
    {
      name:'Testrong'
      logo:logo('testrong')
      link:"http://www.testrong.net/"
    }
  ]
  log('PartnersCtrl init()')
]
