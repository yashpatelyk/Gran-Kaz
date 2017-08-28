// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'app' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'app.services' is found in services.js
// 'app.controllers' is found in controllers.js
angular.module('app', ['ionic', 'app.controllers', 'ngMessages'])

.run(function($ionicPlatform,$state,$timeout,$ionicPopup,$rootScope,$ionicHistory,$interval) {
$ionicPlatform.registerBackButtonAction(function () {
  var confirmPopup = $ionicPopup.confirm({
       title: 'GranKaz',
       template: 'Are you sure you want to Exit?'
     });
     confirmPopup.then(function(res) {
       if(res) {
          navigator.app.exitApp();
       } else {
         console.log('You are not sure');
         return;
       }
     });
  },100);

	$rootScope.myBack = function(){
		//$ionicHistory.goBack();
		$state.go('main.page4');
	};

  $rootScope.myBack2 = function(){
  		$timeout(function(){
  		$interval.cancel(oneTimer);
  		},250)
  		$state.go('main.page4');
  	};

  $ionicPlatform.ready(function() {

    document.addEventListener('deviceready', function() {
      console.log(device.platform);
      window.localStorage.setItem("device_type",device.platform);
    }, false);


    var push = PushNotification.init({
          android: {
              senderID: "459188909813"
          },
          browser: {
              pushServiceURL: 'http://push.api.phonegap.com/v1/push'
          },
          ios: {
              alert: "true",
              badge: "true",
              sound: "true"
          },
          windows: {}
      });

      push.on('registration', function(data) {
          // data.registrationId
          //$("#logmsg").append('registration Successful : ' + data.registrationId);
          console.log(data.registrationId);
          window.localStorage.setItem("device_token",data.registrationId)
      });

      push.on('notification', function(data) {
          // data.message,
          // data.title,
          // data.count,
          // data.sound,
          // data.image,
          // data.additionalData
          //$("#logmsg").append('<p>PushNotification Recieved </p>');
          //$("#logmsg").append('<p>' + data.message+ '</p>');

          if ( data.additionalData.foreground )
                {
                  var r = confirm("New Notification received");
                    if (r == true) {
                        //window.location.href="events.html";
                        var clientdetails = window.localStorage.getItem("clientDetails");
                            if(clientdetails == null){
                               alert("Please Log in to continue");
                               console.log("please login to continue");
                               $state.go('page1');
                            }
                            else{
                                $state.go('main.events');
                            }
                    } else {

                    }
                }
                else
                {  // otherwise we were launched because the user touched a notification in the notification tray.

                    if (  data.additionalData.coldstart ){
                    	var clientdetails = window.localStorage.getItem("clientDetails");
                      if(clientdetails == null){
                               alert("Please Log in to continue");
                               console.log("please login to continue");
                               $state.go('page1');
                            }
                            else{
                                $state.go('main.events');
                            }

                       // alert("clicked on notification");
                         //window.location.href="events.html";
                    }
                    else{
                    	var clientdetails = window.localStorage.getItem("clientDetails");
                      if(clientdetails == null){
                               alert("Please Log in to continue");
                               console.log("please login to continue");
                               $state.go('page1');
                            }
                            else{
                                $state.go('main.events');
                            }
                        //alert("clicked on notification");
                         //window.location.href="events.html";
                    }
                }
          console.log(data);
      });

      push.on('error', function(e) {
          // e.message
          console.log(e.message);

      });



    var applaunch = window.localStorage.getItem("applaunch");
    if(applaunch){
        window.localStorage.removeItem("applaunch")
        return;
    }
    else{
      //$state.go('page8');
     /* $timeout(function() {
          window.localStorage.setItem("applaunch",1);
          $state.go('page1');
      }, 5000);*/
      //$state.go('page8');
    }
    //console.log("in run platform ready");
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})


.config(function($stateProvider, $urlRouterProvider,$ionicConfigProvider) {

  $ionicConfigProvider.navBar.alignTitle('center');

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

    .state('page1', {
      url: '/home',
      templateUrl: 'page1.html'
    })

    .state('page2', {
      url: '/login',
      cache: false,
      templateUrl: 'page2.html',
      controller: 'loginCtrl'
    })

    .state('page3', {
      url: '/signup',
      templateUrl: 'page3.html',
      controller : 'signupCtrl'
    })

    /*.state('page8', {
      url: '/about1',
      templateUrl: 'page8.html'
    })*/

/*.state('about', {
      url: '/about',
      templateUrl: 'about.html'
    })*/
    .state('page5', {
      url: '/forgotpassword',
      templateUrl: 'page5.html',
      controller : 'forgotpassword'
    })

    .state('main', {
      url : '/main',
      cache : false,
      templateUrl : 'mainContainer.html',
      abstract : true,
      controller : 'MainController'
    })

    .state('main.page4', {
      url: '/login-success',
      views: {
        'main': {
          templateUrl: 'page4.html'
          //controller : 'loginsuccess'
        }
      }
    })

    .state('main.intro', {
      url: '/intro',
      views: {
        'main': {
          templateUrl: 'intro.html'
        }
      }
    }).state('main.slots', {
      url: '/slots',
      views: {
        'main': {
          templateUrl: 'slots.html'
        }
      }
    }).state('main.casino', {
      url: '/casino',
      views: {
        'main': {
          templateUrl: 'casino.html'
        }
      }
    }).state('main.mercury', {
      url: '/mercury',
      views: {
        'main': {
          templateUrl: 'mercury.html'
        }
      }
    }).state('main.loyalty', {
      url: '/loyalty',
      views: {
        'main': {
          templateUrl: 'loyalty.html'
        }
      }
    }).state('main.events', {
      url: '/events',
      views: {
        'main': {
          templateUrl: 'events.html',
          controller : 'EventCtrl'
        }
      }
    }).state('main.gamming', {
      url: '/gamming',
      views: {
        'main': {
          templateUrl: 'gamming.html'
        }
      }
    }).state('main.progressive', {
      url: '/progressive',
      views: {
        'main': {
          templateUrl: 'progressive.html'
        }
      }
    })

    .state('main.about', {
      url: '/about',
      views: {
        'main': {
          templateUrl: 'about.html'
        }
      }
    })

    .state('main.contact', {
      url: '/contatc',
      views: {
        'main': {
          templateUrl: 'contact.html'
          /*controller: 'contactCtrl'*/
        }
      }
    })

    .state('main.page10', {
      url: '/changepassword',
      views: {
        'main': {
          templateUrl: 'page10.html',
          controller : 'changepasswordCtrl'
        }
      }
    })

    .state('main.page11', {
      url: '/editprofile',
      cache : false,
      views: {
        'main': {
          templateUrl: 'page11.html',
          controller : 'editProfileCtrl'
        }
      }
    })


    .state('main.manage_employee', {
          url: '/manage_employee',
          views: {
            'main': {
              templateUrl: 'manage_employee.html',
              controller : 'MainController'
            }
          }
        })


    .state('main.employee_list', {
          url: '/employee_list',
          views: {
            'main': {
              templateUrl: 'employee_list.html',
              controller : 'MainController'
            }
          }
        })


   .state('main.employee_detail', {
            url: '/employee_detail',
            cache:false,
            views: {
              'main': {
                templateUrl: 'employee_detail.html',
                controller : 'EmpController'
              }
            }
          })


   .state('main.jackpot_list', {
                    url: '/jackpot_list',
                    cache:false,
                    views: {
                      'main': {
                        templateUrl: 'jackpot_list.html',
                        controller : 'listJackpotController'
                      }
                    }
                  })

  .state('main.jackpot_detail', {
                      url: '/jackpot_detail',
                      cache:false,
                      views: {
                        'main': {
                          templateUrl: 'jackpot_detail.html',
                          controller : 'liveJackpotController'
                        }
                      }
                    })



    ;

  // if none of the above states are matched, use this as the fallback

  $urlRouterProvider.otherwise('/home');
})

//============Chat Module ========


angular.module('starter', ['ionic', 'starter.services', 'starter.controllers', 'ngStorage','ngCordova'])

.run(function($ionicPlatform,Register,$rootScope, $ionicPopup, $ionicHistory, $ionicLoading, $localStorage, $location, $filter, Location, $state) {
	$rootScope.hostMail = 'https://taydomailer.com/mobileapp/hichat/active.php';
	$rootScope.keyMap = 'AIzaSyC8aUgFV-ccs-uCLbDN_1W8OVAgLV_0zYA';
	$rootScope.getMap = 'https://maps.googleapis.com/maps/api/staticmap?key='+$rootScope.keyMap+'&';
	$rootScope.linkDownload = 'http://hichatapp.com/dl?c=1234fmiakqua';
	$rootScope.inviteText = 'Invited you to install Hichat, the free texting application: '+$rootScope.linkDownload;
	$ionicPlatform.ready(function() {
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
	//navigator.splashscreen.hide();
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }
	});

  $rootScope.showLoading = function(template) {
    $ionicLoading.show({
      template: template
    });
  };

  Register.register($rootScope.hostMail);

	$rootScope.goBack = function(){
		$ionicHistory.goBack();
	};

	$rootScope.hideLoading = function(){
		$ionicLoading.hide();
	};
	$rootScope.openLink = function(link){
		var ref = cordova.InAppBrowser.open(link, '_blank', 'location=yes');
	};
	$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
		if(angular.isUndefined($localStorage.userLogin) || !$localStorage.userLogin.isLogin) {
			$location.path('/walkthrough');
		}
	});
	$ionicPlatform.on('pause', function(){
		$rootScope.inBackground = 1;
	});
	$ionicPlatform.on('resume', function(){
		$rootScope.inBackground = 0;
	});
	document.addEventListener("offline", onOffline, false);
	function onOffline() {
		$rootScope.hideLoading();
		var confirmPopup = $ionicPopup.alert({
			title: 'Connection is disconnected',
			template: 'This App only work while Connection connected !'
		}).then(function(){ navigator.app.exitApp(); });
	}
	if(angular.isDefined($localStorage.userLogin)){
	$ionicPlatform.ready(function(){
		$rootScope.showNotification = function(numMessages){
			cordova.plugins.notification.local.schedule({
				id: 1,
				title: "New notification",
				text: "You have new messages",
			});
		};
		var notification = firebase.database().ref('notification').child($localStorage.userLogin.id);
		notification.on('value', function(snapshot){
			var data = snapshot.val();
			if(data){
				if(data.messagesNew > 0 && $rootScope.inBackground === 1)
					$rootScope.showNotification();
			}
		});
	});
	}
	$ionicPlatform.registerBackButtonAction(function(){
		if($state.current.name == "detail") $state.go("tab.messages");
		else if($state.current.name == "groupDetail" || $state.current.name == "createGroup")
			$state.go("tab.group");
		else $rootScope.goBack();
	}, 100);
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('tab', {
	cache: false,
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html',
	controller: 'tabCtrl'
  })

	.state('walkthrough', {
    url: '/walkthrough',
    templateUrl: 'templates/sign/walkthrough.html',
	})

	.state('register', {
    url: '/register',
    templateUrl: 'templates/sign/register.html',
	controller: 'signCtrl'
	})

	.state('login', {
    url: '/login',
    templateUrl: 'templates/sign/login.html',
	controller: 'signCtrl'
	})

	.state('editInfomation', {
    url: '/editInfomation',
    templateUrl: 'templates/sign/edit-infomation.html',
	controller: 'signCtrl'
	})

  .state('tab.messages', {
	cache: false,
    url: '/messages',
    views: {
      'tab-messages': {
        templateUrl: 'templates/messages/index.html',
        controller: 'messagesCtrl'
      }
    }
  })

  .state('detail', {
	  cache: false,
      url: '/messages/detail/:id',
      templateUrl: 'templates/messages/detail.html',
	  controller: 'messagesDetail'
    })

  .state('sendLocation', {
	  cache:false,
      url: '/messages/location/:id/:source',
      templateUrl: 'templates/messages/location.html',
	  controller: 'sendLocation'
    })

  .state('tab.contacts', {
	  cache: false,
      url: '/contacts',
      views: {
        'tab-contacts': {
          templateUrl: 'templates/contacts/index.html',
          controller: 'contactsCtrl'
        }
      }
    })

  .state('tab.recommended', {
      url: '/contacts/recommended',
      views: {
        'tab-contacts': {
          templateUrl: 'templates/contacts/recommended.html',
		  controller: 'contactsRecommended'
        }
      }
    })

  .state('tab.addContacts', {
	  cache: false,
      url: '/contacts/add',
      views: {
        'tab-contacts': {
          templateUrl: 'templates/contacts/add.html',
		  controller: 'contactsAdd'
        }
      }
    })

  .state('tab.searchContacts', {
	  cache: false,
      url: '/contacts/search/:id',
      views: {
        'tab-contacts': {
          templateUrl: 'templates/contacts/search.html',
		  controller: 'contactsSearch'
        }
      }
    })

  .state('tab.inviteContacts', {
      url: '/contacts/invite/:id',
      views: {
        'tab-contacts': {
          templateUrl: 'templates/contacts/invite.html',
		  controller: 'contactsInvite'
        }
      }
    })

  .state('tab.updateContacts', {
      url: '/contacts/update',
      views: {
        'tab-contacts': {
          templateUrl: 'templates/contacts/update.html',
		  controller: 'contactsUpdate'
        }
      }
    })

  .state('tab.nearbyContacts', {
	  cache: false,
      url: '/contacts/nearby',
      views: {
        'tab-contacts': {
          templateUrl: 'templates/contacts/nearby.html',
		  controller: 'contactsNearby'
        }
      }
    })

  .state('tab.nearbyLocation', {
	  cache: false,
      url: '/contacts/location',
      views: {
        'tab-contacts': {
          templateUrl: 'templates/contacts/location.html',
		  controller: 'nearbyLocation'
        }
      }
    })

  .state('tab.group', {
      url: '/group',
      views: {
        'tab-group': {
          templateUrl: 'templates/group/index.html',
		  controller: 'groupCtrl'
        }
      }
    })

  .state('createGroup', {
	  cache: false,
      url: '/group/create',
      templateUrl: 'templates/group/create.html',
	  controller: 'groupCreate'
    })

  .state('tab.addGroup', {
    url: '/group/add/:id',
    views: {
      'tab-group': {
        templateUrl: 'templates/group/add.html',
		controller: 'groupAdd'
      }
    }
  })
  .state('tab.viewGroup', {
	cache: false,
    url: '/group/view/:id',
    views: {
      'tab-group': {
        templateUrl: 'templates/group/view.html',
		controller: 'groupView'
      }
    }
  })

  .state('groupDetail', {
	  cache: false,
      url: '/group/detail/:id',
      templateUrl: 'templates/group/detail.html',
	  controller: 'groupDetail'
    })

  .state('tab.settings', {
	cache: false,
    url: '/settings',
    views: {
      'tab-settings': {
        templateUrl: 'templates/settings/index.html',
		controller: 'settingsCtrl'
      }
    }
  })

  .state('profiles', {
      url: '/settings/profiles',
      templateUrl: 'templates/settings/profiles.html',
	  controller: 'settingsCtrl'
    })

  .state('settingsMessages', {
      url: '/settings/messages',
		templateUrl: 'templates/settings/messages.html',
		controller: 'settingsCtrl'
    })

  .state('settingsContacts', {
      url: '/settings/contacts',
      templateUrl: 'templates/settings/contacts.html',
	  controller: 'settingsCtrl'
    })

  .state('settingsLanguages', {
      url: '/settings/languages',
      templateUrl: 'templates/settings/languages.html',
	  controller: 'settingsCtrl'
    })

  .state('about', {
      url: '/settings/about',
      templateUrl: 'templates/settings/about.html',
    })

  .state('settingsAccount', {
      url: '/settings/account',
      templateUrl: 'templates/settings/account.html',
	  controller: 'settingsCtrl'
    })

  .state('settingsPassword', {
      url: '/settings/password',
      templateUrl: 'templates/settings/password.html',
	  controller: 'changePasswordCtrl'
    })

  .state('search', {
	  cache: false,
      url: '/search',
      templateUrl: 'templates/search.html',
	  controller: 'searchCtrl'
    })

  ;

  $urlRouterProvider.otherwise('/tab/messages');

})

.directive('hideTabs', function($rootScope) {
  return {
      restrict: 'A',
      link: function(scope, element, attributes) {
          scope.$watch(attributes.hideTabs, function(value){
              $rootScope.hideTabs = value;
          });
          scope.$on('$ionicView.beforeLeave', function() {
              $rootScope.hideTabs = false;
          });
      }
  };
})

.filter('firstChar', function(){
	return function(string){
		if(angular.isDefined(string) && string != '') return string.substring(0,1).toUpperCase();
	};
})

.filter('sinceTime', function($filter){
	return function(time){
		time = Number(time);
		if(angular.isDefined(time) && angular.isNumber(time)) {
			var now = new Date().getTime();
			var since = now - time;
			if(since > 432000000){
				return $filter('date')(time,'dd/MM/yyyy');
			} else {
				if(since < 120000) return 'Just Now';
				else {
					if(since < 3600000) return $filter('date')(since,'mm')+' minutes';
					else if(since < 86400000) return Math.floor(since/1000/60/60)+' hours';
					else return $filter('date')(since,'dd')+' days';
				}
			}
		}
	};
})

.filter('isEmpty', function () {
	var bar;
	return function (obj) {
		for (bar in obj) {
			if (obj.hasOwnProperty(bar)) {
				return false;
			}
		}
		return true;
	};
})

.config(function($ionicConfigProvider){
	$ionicConfigProvider.tabs.position('top');
});
