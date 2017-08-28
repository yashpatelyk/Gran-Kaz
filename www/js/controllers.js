angular.module('app.controllers', ['starter.controllers'])

.run(function($rootScope, $state, $ionicHistory, $ionicPlatform, $ionicLoading, $window, $ionicPopup) {
    var tags = new Array();
    /*$rootScope.hitme = function(){

      $( ".autocomplete" ).autocomplete({
            source: function( request, response ) {
              var matcher = new RegExp( "^" + $.ui.autocomplete.escapeRegex( request.term ), "i" );
              response( $.grep( tags, function( item ){
                return matcher.test( item );
              }) );
            }
          });
    }*/

    $ionicLoading.show({
        template: "Loading..."
    });

    /*$.ajax({
       url: 'http://gappsapk.com/WireFrame/webservice/countrylist.php',
       type: 'POST',
       success: function(response){
           console.log(response);
           alert(countrydetails);
           console.log(countrydetails);
       },
       error: function(error){
         alert(error);
         console.log(error);
       }
    });*/

    $rootScope.getCountryCode = function() {
        $.ajax({
            crossOrigin: true,
            url: "http://gappsapk.com/WireFrame/webservice/countrylist.php",
            success: function(result) {
                //alert('success' + JSON.stringify(result));
                //var obj = JSON.parse(result);
                //$( '#test' ).html(result);
                var data = result.countrydetails;
                //alert(JSON.stringify(data));
                $.each(data, function() {
                    //console.log(this.areacode);
                    option = $("<option></option>");
                    option.val(this.areacode);
                    option.attr('id', this.id);
                    option.attr('name', this.name);
                    option.html('+' + this.areacode + '  ' + this.name);
                    $('#countryCode').append(option);
                    $ionicLoading.hide();
                });
            },
            error: function(error) {
                alert(error);
                $ionicLoading.hide();
            }
        });
    }
    $ionicLoading.hide();
    /*$.ajax({
        url: 'http://calorie.textilemarketresearch.com/services/getAllCities',
        type: 'POST',
        success: function (response) {
          //alert(JSON.stringify(response));
          $rootScope.cities = response;
          //console.log($rootScope.cities);
          $.each(response ,function(index,value){
            tags.push(value.city_name);
          });
          $ionicLoading.hide();
          //tags = response;
          //alert(tags);
        },
        error: function () {
          $ionicLoading.hide();
        }
    });*/


    $rootScope.appLaunch = function() {
        window.localStorage.setItem("applaunch", 1);
        if (window.localStorage.getItem("clientDetails") == null) {
            $rootScope.goToState('page1');
            //$rootScope.goToState('main.events');
        } else {
            $rootScope.goToState('main.page4');
        }

    }
    $rootScope.myGoBack = function() {
        $ionicHistory.goBack();
    }
    $rootScope.logOut = function() {
        /*var txt;
        var r = confirm("Are you sure you want to logout?");
        if (r == true) {
            //console.log("You pressed OK!");
            window.localStorage.removeItem("clientDetails");
            window.localStorage.removeItem("password");
            window.localStorage.clear();
        } else {
            console.log("You pressed cancel!");
        }*/

        var confirmPopup = $ionicPopup.confirm({
            title: 'GranKaz',
            template: 'Are you sure you want to logout?'
        });
        confirmPopup.then(function(res) {
            if (res) {
                window.localStorage.removeItem("clientDetails");
                window.localStorage.removeItem("password");
                window.localStorage.clear();
                //navigator.app.exitApp();
                $rootScope.goToState('page2');
            } else {
                console.log('You are not sure');
                //return;
            }
        });
    };

    $rootScope.sendEmail = function() {
        window.plugin.email.open({
                to: ["hiten03_shah@yahoo.com"], // email addresses for TO field
                //attachments: 'file://img/logo.png',
                subject: "Test Mail",
                body: "Test Mail ",
                isHtml: true,
            }, function() {
                console.log('email view dismissed');
            },
            this);
    }

    $rootScope.clicked = function() {

        $window.location.href = "./chat.html"
    }

    $rootScope.goToState = function(statename) {
        $state.go('' + statename + '');
    }
})

.service('myservice', function() {
    this.setName = function(data) {
        this.name = data.first_name;
        this.id = data.id;

    }
})

.controller('MainController', ['$scope', '$ionicLoading', '$rootScope', '$timeout', '$state', '$http', '$ionicPopup', '$interval', function($scope, $ionicLoading, $rootScope, $timeout, $state, $http, $ionicPopup, $interval) {

        $scope.toggleMenu = function() {
            $scope.sideMenuController.toggleLeft();
            $ionicSideMenuDelegate.toggleLeft();
        };

        /* ************************ DATE : 16-4-2017  **************************** */
        var error_server = "No response from Server";
        var arr_months = ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
        $rootScope.monthList = arr_months;
        var mnth_index = new Date().getMonth();
        var current_year = new Date().getFullYear();
        var back10years = current_year - 10;
        var temp = [];
        for (var i = 0; i < 11; i++) {
            temp.push(back10years++);
        }
        $rootScope.yearList = temp;
        $scope.currentYear2 = temp[0];
        $scope.currentMonth2 = arr_months[0];

        $scope.showLog = function(msg) {
            //console.log(msg)
        };

        localStorage.setItem("pref_shift_year", null);
        localStorage.setItem("pref_shift_month", null);

        $scope.ManageShift = function() {
            $ionicLoading.show();
            var req = {
                method: 'POST',
                url: 'http://gappsapk.com/WireFrame/webservice/stafflist.php',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: null
            };

            $http(req).success(function(data) {
                    $ionicLoading.hide();
                    $scope.showLog("==>" + JSON.stringify(data));
                    var status = data.status;
                    if (status == 1 || status == '1') {
                        $rootScope.staffdetails = data.staffdetails;
                        $rootScope.categorydetails = data.categorydetails;

                        $timeout(function() {
                            $state.go('main.manage_employee');
                        });

                    } else {
                        $scope.showLog("status ==>" + status);
                        $scope.showLog("==>" + JSON.stringify(data));
                    }

                })
                .error(function() {
                    $ionicLoading.hide();
                    alert(error_server);
                });
        };

        $scope.getEmployeeOfDepartment = function(objDepartment) {
            $scope.showLog("clicked department ==>" + JSON.stringify(objDepartment));
            var dept_id = objDepartment.nCatId;
            var dept_name = objDepartment.sCat;

            var temp_arr_emp = [];
            for (var i = 0; i < $rootScope.staffdetails.length; i++) {
                if (dept_id == $rootScope.staffdetails[i].nCatId) {
                    temp_arr_emp.push($rootScope.staffdetails[i]);
                }
            }
            $rootScope.employeeList = temp_arr_emp;
            $timeout(function() {
                $state.go('main.employee_list')
            });
        };

        $scope.goToEmpDetail = function(objEmp) {
            $scope.showLog("clicked employee ==>" + JSON.stringify(objEmp));
            localStorage.setItem("pref_clicked_employee", JSON.stringify(objEmp));

            $timeout(function() {
                $state.go('main.employee_detail')
            });


        };

        $scope.showSelectValueYear = function(mySelect) {
            localStorage.setItem("pref_shift_year", mySelect);
        }

        $scope.showSelectValueMonth = function(mySelect) {
            localStorage.setItem("pref_shift_month", mySelect);
        }

        $scope.getEmployeeShift = function() {

            var shift_year = localStorage.getItem("pref_shift_year");
            var shift_month = localStorage.getItem("pref_shift_month");

            if (shift_year == null) {

                var alertPopup = $ionicPopup.alert({
                    title: 'Application',
                    template: 'Please select year'
                });

                $ionicLoading.hide();

            } else if (shift_month == null) {

                var alertPopup = $ionicPopup.alert({
                    title: 'Application',
                    template: 'Please select month'
                });

                $ionicLoading.hide();

            } else {
                $ionicLoading.show();

                var shift_year = localStorage.getItem("pref_shift_year");
                var shift_month = localStorage.getItem("pref_shift_month");

                var objEmp = JSON.parse(localStorage.getItem("pref_clicked_employee"));

                var emp_staff_id = objEmp.nStaffId;
                var emp_name = objEmp.sName;
                var emp_cat_id = objEmp.nCatId;

                var post_data = {
                    "nStaffId": emp_staff_id,
                    "sMonth": shift_month,
                    "sYear": shift_year
                };

                $scope.showLog("Request Params ==>" + JSON.stringify(post_data));


                $ionicLoading.show();
                $.ajax({
                    type: "POST",
                    url: 'http://gappsapk.com/WireFrame/webservice/shiftlist.php',
                    data: post_data,
                    success: function(data) {
                        $ionicLoading.hide();
                        $scope.showLog("==>" + JSON.stringify(data));
                        var status = data.Setting;
                        if (status == true) {
                            var objShift = data.shiftdetails;

                            $rootScope.activeMonth = objShift.sMonth;

                            $timeout(function() {
                                for (key in objShift) {
                                    delete objShift['nShiftId'];
                                    delete objShift['nStaffId'];
                                    delete objShift['nCatId'];
                                    delete objShift['sMonth'];
                                    delete objShift['sYear'];
                                }
                                $rootScope.viewShift = objShift;

                            });
                        } else {
                            var alertPopup = $ionicPopup.alert({
                                title: 'Application',
                                template: data.msg
                            });

                            $ionicLoading.hide();

                            $timeout(function() {
                                $rootScope.viewShift = {};
                            });
                        }

                    },
                    error: function(error) {
                        alert(error_server);
                        $ionicLoading.hide();
                    }
                })

            }

        };

        $scope.showShift = function(check_shift) {
            check_shift = check_shift.toLowerCase();
            if (check_shift == "d") {
                return "Day";
            } else if (check_shift == "n") {
                return "Night";
            } else if (check_shift == "a") {
                return "Afternoon";
            } else if (check_shift == "o") {
                return "Off";
            } else if (check_shift == "ph") {
                return "PH";
            } else if (check_shift == "al") {
                return "AL";
            }
        };

        $scope.AddEmployee = function() {};

        $scope.EmployeeShift = function() {};

        /* ************************ DATE : 16-4-2017  **************************** */


        $scope.$on('$ionicView.beforeEnter', function($state) {
            $timeout(function() {
                $scope.showLog("==>" + oneTimer)
                $interval.cancel(oneTimer);
            }, 200)
        });
        $scope.$on('$ionicView.Enter', function($state) {});
        $scope.$on('$ionicView.afterEnter', function($state) {});

    }])
    /* ************************ DATE : 26-4-2017  **************************** */
    .controller('EmpController', function($http, $scope, $state, $filter, $ionicLoading, $rootScope, $timeout) {
        $scope.field = "";
        $scope.field2 = "";
        $scope.currentYear2 = "";
        $scope.currentMonth2 = "";
        $rootScope.viewShift = {};
    })

/* ************************ DATE : 4-5-2017  **************************** */

.controller('listJackpotController', ['$scope', '$ionicLoading', '$rootScope', '$timeout', '$state', '$http', '$ionicPopup', function($scope, $ionicLoading, $rootScope, $timeout, $state, $http, $ionicPopup) {
    $rootScope.jackpotValue = "";
    $scope.goToLiveUpdate = function(clicked_item) {
        $rootScope.jackpotValue = "";
        var old_ip = "41.86.39.131";
        var new_ip = "41.86.43.179";
        $scope.showLog("clicked_item ==>" + clicked_item);
        if (clicked_item == 'gran_jackpot') {
            callApi = 'http://'+new_ip+':2012/api/custom/casino/table/onlinejackpotvalues?jpId=SM-1&format=json';
        } else if (clicked_item == 'mardi_jackpot') {
            callApi = 'http://'+new_ip+':2012/api/custom/casino/table/onlinejackpotvalues?jpId=SM-2&format=json';
        } else if (clicked_item == 'karnival_jackpot') {
            callApi = 'http://'+new_ip+':2012/api/custom/casino/table/onlinejackpotvalues?jpId=SM-3&format=json';
        } else if (clicked_item == 'mississippi_jackpot') {
            callApi = 'http://'+new_ip+':2012/api/custom/casino/table/onlinejackpotvalues?jpId=SM-4&format=json';
        } else if (clicked_item == 'double_jackpot') {
            callApi = 'http://'+new_ip+':2012/api/custom/casino/table/onlinejackpotvalues?jpId=LP-2&format=json';
        } else if (clicked_item == 'redeye_jackpot') {
            callApi = 'http://'+new_ip+':2012/api/custom/casino/table/onlinejackpotvalues?jpId=LP-5&format=json';
        }

        localStorage.setItem('currentApi', callApi);

        $.ajax({
            type: "GET",
            url: callApi,
            success: function(res) {
                //$ionicLoading.hide();
                $scope.showLog("==>" + JSON.stringify(res));

                var response = res.result;
                var calc_time = response.calcTime;
                var is_cached = response.isCached;
                var is_running = response.isRunning;

                var res_id = response[0].id;
                var res_name = response[0].name;
                var res_value = response[0].value;
                var res_error = response[0].error;

                $timeout(function() {
                    $rootScope.jackpotValue = res_value / 100;
                    $state.go('main.jackpot_detail');
                });
            },
            error: function(error) {
                alert("No response from Server");
                //$ionicLoading.hide();
            }
        })
    };
    $scope.$on('$ionicView.afterEnter', function($state) {});

    /* ************************ DATE : 4-5-2017  **************************** */

}])

.controller('liveJackpotController', function($http, $scope, $state, $filter, $ionicLoading, $rootScope, $timeout, $interval) {

        $scope.callLiveUpdate = function() {
            $ionicLoading.show({
                template: "Loading..."
            });
            var callApi_url = localStorage.getItem('currentApi');
            $.ajax({
                type: "GET",
                url: callApi_url,
                success: function(res) {
                    $ionicLoading.hide();
                    $scope.showLog("==>" + JSON.stringify(res));

                    var response = res.result;
                    var calc_time = response.calcTime;
                    var is_cached = response.isCached;
                    var is_running = response.isRunning;

                    var res_id = response[0].id;
                    var res_name = response[0].name;
                    var res_value = response[0].value;
                    var res_error = response[0].error;

                    $timeout(function() {
                        $rootScope.jackpotValue = res_value / 100;
                    });

                },
                error: function(error) {
                    alert("No response from Server");
                    $ionicLoading.hide();
                }
            })
        };

        $scope.$on('$ionicView.afterEnter', function($state) {
            $timeout(function() {
                oneTimer = $interval(function() {
                    $scope.callLiveUpdate();
                }, 30000);
            }, 100);

        });
    })
    /* ************************ DATE : 4-5-2017  **************************** */

.controller('contactCtrl', function($http, $scope, $state, $filter, $ionicLoading, $rootScope) {
    $scope.contact = {};

    $ionicLoading.show({
        template: "Loading..."
    });

    $scope.ContactUs = function() {

        $ionicLoading.show({
            template: "Loading..."
        });

        var name = $scope.contact.name;
        var email = $scope.contact.email;
        var feedback = $scope.contact.feedback;

        console.log(JSON.stringify($scope.contact));

        if (name == null) {
            alert("Please enter Name, it can't be blank");
            $ionicLoading.hide();
        } else if (email == null) {
            alert("Please enter Email, it can't be blank");
            $ionicLoading.hide();
        } else if (feedback == null) {
            alert("Please enter feedback, it can't be blank");
            $ionicLoading.hide();
        } else {
            if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
                alert("Email id is not valid");
                $ionicLoading.hide();
                return;
            }
            /*$.ajax({
          type:"POST",
          url: 'http://gappsapk.com/WireFrame/webservice/registration.php',
          data:{
            "action": "Registration",
            "firstname": firstName,
            "device_id": "XYZ123",
            "lastname": lastName,
            "countrycode":countrycode,
            "mobile": mobile,
            "email": email,
            "password": password,
            "dob": dob,
            "loyality_card_type": loyalityCardType,
            "loyality_card_no": loyalityCardNumber,
            "address": address,
            "city": city
          },

          success: function(result){
            console.log(JSON.stringify(result));
             var obj = result[0];
             //console.log(JSON.stringify(obj));
            if(obj.Setting == "true"){
              console.log(JSON.stringify(result));
              alert(obj.message);
              $ionicLoading.hide();
              $state.go('page2');
            }else{
              alert(obj.message);
              console.log("Error occured :" + obj.message);
              $ionicLoading.hide();
            }
          },
          error: function(error){
            alert("No response from Server");
            $ionicLoading.hide();
        }
      })*/
        }
    }
})

.controller('changepasswordCtrl', function($scope, $http, $state) {
    $scope.changepassword = {}
    var clientdetails = JSON.parse(window.localStorage.getItem("clientDetails"));
    $scope.changepassword.email = clientdetails.email.trim();
    $scope.changepassword.id = clientdetails.id;
    $scope.changePassword = function() {

        var email = clientdetails.email.trim();
        var password = $scope.changepassword.oldPass;
        var newpassword = $scope.changepassword.newPass;

        console.log(email + " " + password + ' ' + newpassword);

        if (password == null || newpassword == null) {
            alert("Password or new password cannot be null");
            return;
        } else if (password == "" || newpassword == "") {
            alert("Password or new password cannot be null");
            return;
        } else if (password == newpassword) {
            alert("Old Password and New Password cannot be same,Please enter different password");
            return;
        } else {
            var req = {
                method: 'POST',
                url: 'http://gappsapk.com/WireFrame/webservice/change_password.php',
                headers: {
                    'Content-Type': 'application/json'
                },
                //data: "email="+email+"&password="+password+"&newpassword="+newpassword+""
                data: {
                    "id": $scope.changepassword.id,
                    "old_password": password,
                    "new_password": newpassword
                }

            }
            $http(req).success(function(data) {
                    if (data.Setting == true) {
                        alert(data.message);
                        document.getElementById("changeoldpass").value = "";
                        document.getElementById("changenewpass").value = "";
                        $scope.changepassword.oldPass = "";
                        $scope.changepassword.newPass = "";
                        //$state.go('main.page4', data);
                    } else {
                        alert(data.message);
                        document.getElementById("changeoldpass").value = "";
                        document.getElementById("changenewpass").value = "";
                        $scope.changepassword.oldPass = "";
                        $scope.changepassword.newPass = "";
                    }
                })
                .error(function() {
                    alert("No response from Server");
                    $ionicLoading.hide();
                });
        }
    }
})

.controller('forgotpassword', function($scope, $http, $state, $ionicPopup) {
    $scope.forgetpassword = {};


    $scope.forgetPassword = function() {
        var email = $scope.forgetpassword.email;

        if (email == null) {
            alert("Email id cant be blank.")
            return;
        } else {
            if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
                alert("Email id is not valid");
                return;
            }

            var req = {
                method: 'POST',
                url: 'http://gappsapk.com/WireFrame/webservice/forgotpassword.php',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: {
                    "email": email
                }
            }
            $http(req).success(function(data) {
                    if (data.Setting == true) {
                        var alertPopup = $ionicPopup.alert({
                            title: 'Application',
                            template: data.message
                        });
                        document.getElementById("forgetemail").value = "";
                        $state.go('page2', data);
                    } else {
                        //alert(data.message);
                        var alertPopup = $ionicPopup.alert({
                            title: 'Application',
                            template: data.message
                        });
                        document.getElementById("forgetemail").value = "";
                    }
                })
                .error(function() {
                    alert("No response from Server");
                    $ionicLoading.hide();
                });
        }
    }
})

.controller('signupCtrl', function($http, $scope, $state, $filter, $ionicLoading, $rootScope) {
    $scope.signup = {};
    window.localStorage.removeItem("clientDetails");
    window.localStorage.removeItem("password");
    $ionicLoading.show({
        template: "Loading..."
    });
    $rootScope.getCountryCode();

    getCityId = function(city) {

        var len = 0;
        for (var o in $scope.cities) {
            len++;
        }

        for (var i = 0; i < len; i++) {
            if (city == $scope.cities[i].city_name) {
                console.log("Matched :" + $scope.cities[i].city_id);
                return $scope.cities[i].city_id;
            }
        }
    }

    CheckTrueFlase = function(data) {
        if (data == true) {
            return 1;
        } else {
            return 0;
        }

    };

    $scope.CreateUser = function() {

        $ionicLoading.show({
            template: "Loading..."
        });

        var firstName = $scope.signup.firstName;
        var lastName = $scope.signup.lastName;
        var email = $scope.signup.email;
        var countrycode = $scope.signup.countrycode;
        var mobile = $scope.signup.mobile;
        var dob = $filter('date')($scope.signup.dob, 'yyyy-MM-dd'); // formats the date in yyyy-MM-dd format
        var loyalityCardType = $scope.signup.loyalityCardType;
        var loyalityCardNumber = $scope.signup.loyalityCardNumber;
        var address = $scope.signup.address;
        var city = 1;
        var device_token = window.localStorage.getItem("device_token");
        //var city = getCityId($("#cityName").val());
        //console.log(city);
        var password = $scope.signup.password;
        var cpassword = $scope.signup.cpassword;
        console.log(JSON.stringify($scope.signup));

        if (firstName == null) {
            alert("Please enter first Name, it can't be blank");
            $ionicLoading.hide();
        }
        /*else if(dob == null){
              alert("Please enter Birthdate, it can't be blank");$ionicLoading.hide();}*/
        else if (lastName == null) {
            alert("Please enter last Name, it can't be blank");
            $ionicLoading.hide();
        } else if (email == null) {
            alert("Please enter Email, it can't be blank");
            $ionicLoading.hide();
        } else if (mobile == null) {
            alert("Please enter Mobile Number, it can't be blank");
            $ionicLoading.hide();
        }
        /*else if(loyalityCardType == null){
              alert("Please enter loyalityCardType, it can't be blank");
              $ionicLoading.hide();
            }else if(loyalityCardNumber == null){
              alert("Please enter loyalityCardNumber, it can't be blank");
              $ionicLoading.hide();
            }*/
        else if (address == null) {
            alert("Please enter your address, it can't be blank");
            $ionicLoading.hide();
        } else if (password == null) {
            alert("Please enter your Password, it can't be blank");
            $ionicLoading.hide();
        } else if (cpassword == null) {
            alert("Please enter your Confirm Password, it can't be blank.");
            $ionicLoading.hide();
        } else {
            /*  if(mobile.toString().length != 7){
                alert("Mobile must be 7 digits.");
                $ionicLoading.hide();
              }*/
            if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
                alert("Email id is not valid");
                $ionicLoading.hide();
                return;
            }
            if (cpassword != password) {
                alert("Password did not match.");
                $ionicLoading.hide();
                return;
            }


            $.ajax({
                type: "POST",
                url: 'http://gappsapk.com/WireFrame/webservice/registration.php',
                data: {
                    "email": email,
                    "password": password,
                    "action": "Registration",
                    "firstname": firstName,
                    "lastname": lastName,
                    "loyality_card_type": loyalityCardType,
                    "loyality_card_no": loyalityCardNumber,
                    "address": address,
                    "city": city,
                    "mobile": mobile,
                    "dob": dob,
                    "countrycode": countrycode,
                    "id": device_token
                },

                success: function(result) {
                    console.log(JSON.stringify(result));
                    var obj = result[0];
                    //console.log(JSON.stringify(obj));
                    if (obj.Setting == "true") {
                        console.log(JSON.stringify(result));
                        alert(obj.message);
                        $ionicLoading.hide();
                        $state.go('page2');
                    } else {
                        alert(obj.message);
                        console.log("Error occured :" + obj.message);
                        $ionicLoading.hide();
                    }
                },
                error: function(error) {
                    alert("No response from Server");
                    $ionicLoading.hide();
                }
            })
        }
    }
})

.controller('loginCtrl', function($rootScope, $scope, $http, $state, myservice, $ionicLoading, $ionicPopup) {

    $scope.$on('$ionicView.beforeEnter', function($state) {
        var clientdetails = window.localStorage.getItem("clientDetails");
        if (clientdetails == null) {
            //alert("Please Log in to continue");
            console.log("please login to continue");
        } else {
            console.log("logged in still");
            $rootScope.goToState('main.page4');
        }
    });
    // Form data for the login modal
    $scope.loginData = {};
    $scope.clientdetails = {};

    $scope.login = function() {
        $ionicLoading.show({
            template: "Loading..."
        });
        var device_token = window.localStorage.getItem("device_token");
        var device_type = window.localStorage.getItem("device_type");
        var email = $scope.loginData.email;
        var password = $scope.loginData.password;
        var device_id = device_token; //this is push notifaction device_token

        if (email == null || password == null) {
            /*alert("email or password should not be empty");*/

            //For ionic alert popup
            var alertPopup = $ionicPopup.alert({
                title: 'Application',
                template: 'email or password should not be empty.'
            });

            $ionicLoading.hide();
        } else {
            $.ajax({
                url: 'http://gappsapk.com/WireFrame/webservice/login.php',
                type: 'POST',
                data: {
                    "email": email,
                    "password": password,
                    "device_id": device_id,
                    "device_type": device_type
                },
                success: function(response) {
                    console.log(JSON.stringify(response));

                    if (response.Setting == true) {
                        window.localStorage.setItem("password", password);
                        //alert(JSON.stringify(data));
                        //alert(data.details.name);
                        var clientDetails = JSON.stringify(response.userdetails);
                        console.log("------------------------------");
                        console.log(clientDetails);
                        console.log("------------------------------");
                        $scope.name = response.first_name;
                        myservice.setName(response);
                        //alert(JSON.stringify($scope.name));
                        window.localStorage.setItem("clientDetails", clientDetails);
                        $ionicLoading.hide();
                        $state.go('main.page4', response);


                    } else {
                        $ionicLoading.hide();
                        alert(response.msg);
                    }
                },
                error: function(error) {
                    //your error code
                    console.log(JSON.stringify(error));
                    alert("No response from Server");
                    $ionicLoading.hide();
                }
            });


            /* $http.defaults.useXDomain = true;
      var req = {
        method: 'POST',
        url: 'http://gappsapk.com/WireFrame/webservice/login.php',
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          "email": email,
          "password": password,
          "device_id": device_id,
          "device_type": device_type
        }
      }
      $http(req).success(function(data){
        if(data.Setting == true){
          window.localStorage.setItem("password",password);
          //alert(JSON.stringify(data));
          //alert(data.details.name);
          var clientDetails = JSON.stringify(data);
          console.log(clientDetails);
          $scope.name = data.first_name;
          myservice.setName(data);
          //alert(JSON.stringify($scope.name));
          window.localStorage.setItem("clientDetails",clientDetails);
          $ionicLoading.hide();
          $state.go('main.page4', data);

        }
        else{
          $ionicLoading.hide();
          console.log(data);
          alert("Wrong username/password");

        }
      })
      .error(function(error){
        console.log(error)
        alert("No response from Server");
        $ionicLoading.hide();
      });*/
        }
    }
})

.controller('EventCtrl', function($http, $scope, $filter, $ionicLoading, $rootScope, $state) {

    var clientdetails = window.localStorage.getItem("clientDetails");
    if (clientdetails == null) {
        alert("Please Log in to continue");
        console.log("please login to continue");
        $state.go('page1');
    } else {
        console.log("logged in still");
        var device_type = "android";
        $.ajax({
            url: 'http://gappsapk.com/WireFrame/webservice/eventlist.php',
            type: 'POST',
            data: {
                "pname": device_type
            },
            success: function(response) {
                console.log(JSON.stringify(response));

                if (response.status == "1") {

                    $.each(response.eventdetails, function(index, data) {

                        if (data.sEventImage) {

                            $("#EventDiv").append('<img src=' + data.sEventImage + 'style="width: 100%; height: 40%;">');
                        }
                        /*$("#EventDiv").append('<div class="events"><h2>'+data.sEventName+'</h2><p>'+data.dDate+'</p><p>'+data.sContent+'</p></div>'); */
                        $("#EventDiv").append('<div><h3 style="color: white;">' + data.sEventName + '</h3>');
                        $("#EventDiv").append('<div><h3 style="color: white;">' + data.dDate + '</h3>');
                        $("#EventDiv").append(data.sContent);
                    });
                } else {
                    console.log(response.msg);
                    $ionicLoading.hide();
                    //console.log(data);
                    alert(response.msg);
                }
            },
            error: function(error) {
                //your error code
                console.log(JSON.stringify(error));
                alert("No response from Server");
                $ionicLoading.hide();
            }
        });
    }
})

.controller('editProfileCtrl', function($http, $scope, $filter, $ionicLoading, $rootScope, $state) {

    $scope.loyalityCardTypeOpts = [{
        name: 'Gold Card',
        value: '1'
    }, {
        name: 'Silver Card',
        value: '2'
    }, {
        name: 'Club Seven',
        value: '3'
    }];

    checkValue = function(data) {
        if (data == 1) {
            //console.log("called check 0");
            return 1;
        }
        if (data == 2) {
            //console.log("called check 1");
            return 2;
        }
        if (data == 3) {
            //console.log("called check 0");
            return 3;
        }
    }

    $scope.edit = {};
    var clientdetails = JSON.parse(window.localStorage.getItem("clientDetails"));
    console.log(JSON.stringify(clientdetails));

    $scope.edit.firstName = clientdetails.first_name;
    $scope.edit.lastName = clientdetails.last_name;
    $scope.edit.dob = clientdetails.date_of_birth;
    $scope.edit.email = clientdetails.email.trim();
    $scope.edit.countrycode = clientdetails.countrycode;
    $scope.edit.mobile = clientdetails.mobile;
    $scope.edit.loyalityCardType = $scope.loyalityCardTypeOpts[checkValue(parseInt(clientdetails.loyality_card_type))];
    //$scope.edit.loyalityCardType = clientdetails.loyality_card_type;
    //console.log(JSON.stringify($scope.edit.loyalityCardType));
    $scope.edit.loyalityCardNumber = clientdetails.loyality_card_number;
    $scope.edit.address = clientdetails.address;
    //$scope.edit.city = getCityName(parseInt(clientdetails.city_id));
    $scope.edit.city = clientdetails.city;



    $scope.editUser = function() {
        $ionicLoading.show({
            template: "Loading..."
        });
        var id = clientdetails.id;
        var firstName = $scope.edit.firstName;
        var lastName = $scope.edit.lastName;
        var dob = $filter('date')($scope.edit.dob, 'yyyy-MM-dd'); // formats the date in yyyy-MM-dd format
        var email = $scope.edit.email;
        var countrycode = $scope.edit.countrycode;
        var mobile = $scope.edit.mobile;
        var loyalityCardType = $scope.edit.loyalityCardType;
        var loyalityCardNumber = $scope.edit.loyalityCardNumber;
        var address = $scope.edit.address;
        var city = $scope.edit.city;
        var device_token = window.localStorage.getItem("device_token");
        console.log(JSON.stringify($scope.edit));

        $.ajax({
            type: "POST",
            url: 'http://gappsapk.com/WireFrame/webservice/registration.php',
            data: {
                "action": "EditProfile",
                "id": id,
                "firstname": firstName,
                "device_id": device_token,
                "lastname": lastName,
                "countrycode": countrycode,
                "mobile": mobile,
                "email": email,
                "password": "123456",
                "dob": dob,
                "loyality_card_type": loyalityCardType,
                "loyality_card_no": loyalityCardNumber,
                "address": address,
                "city": "1"
            },

            success: function(obj) {
                console.log(JSON.stringify(obj));
                //var obj = result[0];
                //console.log(JSON.stringify(obj));
                if (obj.Setting == "true") {
                    //console.log(JSON.stringify());
                    alert(obj.message);
                    window.localStorage.removeItem('clientDetails');
                    window.localStorage.setItem('clientDetails', JSON.stringify(obj));
                    $ionicLoading.hide();
                    $state.go('page2');
                } else {
                    alert(obj.message);
                    console.log("Error occured :" + obj.message);
                    $ionicLoading.hide();
                }
            },
            error: function(error) {
                alert("No response from Server");
                $ionicLoading.hide();
            }
        })

        /*var req = {
            type: 'POST',
            url: 'http://gappsapk.com/WireFrame/webservice/registration.php',
            headers: {
              'Content-Type': 'application/json'
            },
            //data: "mobile="+mobile+"&name="+fullname+"&dob="+dob+"&gender="+gender+"&married="+married+"&hfeet="+hfeet+"&hinch="+hinch+"&weight="+weight+"&waist="+waist+"&diabetes="+diabetes+"&hypertension="+hypertension+"&kidney="+kidney+"&smoker="+smoker+"&drinker="+drinker+"&teeto="+teeto+"&mobile="+mobile+"&email="+email+"&street1="+street1+"&street2="+street2+"&city_id="+city+"&pin="+pin+"&doctor_name="+drname+"&doctor_place="+drplace+""
            data: {
              "action": "EditProfile",
              "id": id,
              "firstname": firstName,
              "device_id": "XYZ123",
              "lastname": lastName,
              "countrycode":countrycode,
              "mobile": mobile,
              "email": email,
              "password": "123456" ,
              "dob": dob,
              "loyality_card_type": loyalityCardType,
              "loyality_card_no": loyalityCardNumber,
              "address": address,
              "city": "1"
            }
        }

        $http(req).success(function(data){
          console.log(JSON.stringify(data));
            if(data.Setting == true){
             // alert(JSON.stringify(data));
              window.localStorage.removeItem("clientDetails");
              var clientDetails = JSON.stringify(data);
              window.localStorage.setItem("clientDetails",clientDetails);
              //alert(data.message);
              $ionicLoading.hide();
              //$state.go('main.page4');
            }
            else{
              alert("else");
              //alert(JSON.stringify(data));
              //alert(data.message);
              $ionicLoading.hide();
            }
        })

        .error(function(){
          alert("No response from Server");
          $ionicLoading.hide();
        });*/
    }
})

.filter('formatDate', function($filter) {

    // Create the return function
    // set the required parameter name to **number**
    return function(date) {

        var d = new Date(date);
        var date1 = $filter('date')(d, 'mediumDate');
        return date1;
    }
});

//==========chat module ==========================


angular.module('starter.controllers', ['ionic.closePopup'])

/*.service('Register', function($scope,$http,$window) {
    this.register = function () {
      console.log('service called');
      $scope.showLoading("Loading...");
      var clientdetails = window.localStorage.getItem("clientdetails");
      $http.head($scope.hostMail+'?email='+clientdetails.email+'&phone='+$clientdetails.mobile).then(function(){
      $scope.hideLoading();
      })
    }
})*/

.controller('areacodeCtrl', function($scope, $ionicModal, Areacode) {
    $scope.areacodes = Areacode;
    $ionicModal.fromTemplateUrl('templates/sign/areacode.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.areaCode = modal;
    });
    $scope.closeareaCode = function() {
        $scope.areaCode.hide();
    };
    $scope.showareaCode = function() {
        $scope.areaCode.show();
    };
    $scope.choseAreaCode = function(name, areacode) {
        $scope.choseArea.name = name;
        $scope.choseArea.areacode = areacode;
        $scope.closeareaCode();
    };
})

.controller('signCtrl', function($scope, $state, $http, $ionicPopup, Login, User, Camera, $filter, $localStorage) {
    $scope.data = {};
    $scope.choseArea = {
        name: "India",
        "areacode": "91"
    };
    $scope.showValue = {
        "type": "password",
        "text": "Show"
    };
    $scope.login = function() {
        if (!angular.isDefined($scope.data.phone)) {
            $scope.data.notification = "Plese enter your phone number to continue";
        } else {
            $scope.showLoading("Loading...");
            $scope.data.notification = false;
            $scope.data.fullPhone = $scope.choseArea.areacode + $scope.data.phone;
            $scope.userLogin = Login().get($scope.data.fullPhone);
            $scope.userLogin.$loaded(function() {
                $scope.hideLoading();
                if (angular.isDefined($scope.userLogin.active)) {
                    $scope.data.notification = "Your account is inactive, please active mail for register";
                } else {
                    if ($scope.userLogin.password == $scope.data.password) {

                        $localStorage.userLogin = {};
                        $localStorage.userLogin.isLogin = true;
                        $localStorage.userLogin.id = $scope.userLogin.id;
                        $localStorage.userLogin.phone = $scope.userLogin.$id;
                        $localStorage.userLogin.password = $scope.data.password;
                        $localStorage.userLogin.areacode = Number($scope.choseArea.areacode);
                        $state.go("tab.messages");
                    } else {
                        $scope.data.notification = "The password you entered is incorrect";
                    }
                }
            });
        }
    };
    $scope.register = function() {
        if (!$scope.data.phone || !$scope.data.password) {
            $scope.data.notification = "Plese enter data to continue";
        } else if ($scope.data.password != $scope.data.repassword) {
            $scope.data.notification = "Confirmation password do not match";
        } else {
            $scope.showLoading("Loading...");
            $scope.data.notification = false;
            $scope.data.fullPhone = $scope.choseArea.areacode + $scope.data.phone;
            $scope.userLogin = Login().get($scope.data.fullPhone);
            $scope.userLogin.$loaded(function() {
                if (angular.isUndefined($scope.userLogin.$value)) {
                    $scope.data.notification = "Phone number is already registered";
                    $scope.hideLoading();
                } else {
                    $scope.checkEmail = Login().getEmail($scope.data.email);
                    $scope.checkEmail.$loaded(function() {
                        if (angular.isDefined($scope.checkEmail.$value)) {
                            console.log($scope.data.fullPhone);
                            Login().set($scope.data.fullPhone);
                            Login().changePass($scope.data.fullPhone, $scope.data.password);
                            $http.head($scope.hostMail + '?email=' + $scope.data.email + '&phone=' + $scope.data.fullPhone).then(function() {

                                //var clientdetails = JSON.parse(window.localStorage.getItem("clientDetails"));
                                //$http.head($scope.hostMail+'?email='+clientdetails.email+'&phone='+clientdetails.mobile).then(function(){
                                $scope.hideLoading();
                                $state.go('login');
                            });
                        } else {
                            $scope.hideLoading();
                            $scope.data.notification = "Email is already registered";
                        }
                    });
                }
            });
        }
    };
    $scope.showForgot = function() {
        if (!$scope.data.phone) {
            $scope.data.notification = "Plese enter your phone number to continue";
        } else {
            $scope.showLoading("Loading...");
            $scope.data.notification = false;
            $scope.data.fullPhone = $scope.choseArea.areacode + $scope.data.phone;
            $scope.userForgot = Login().get($scope.data.fullPhone);
            $scope.userForgot.$loaded(function() {
                if (angular.isDefined($scope.userForgot.$value)) {
                    $scope.hideLoading();
                    $scope.data.notification = "Phone number is not registered";
                } else {
                    $scope.hideLoading();
                    var confirmPopup = $ionicPopup.confirm({
                        scope: $scope,
                        title: 'Confirm number',
                        cssClass: 'popup-forgot text-center',
                        templateUrl: 'templates/sign/forgot.html',
                        buttons: [{
                            text: 'Change'
                        }, {
                            text: 'Confirm',
                            onTap: function(e) {
                                $scope.showLoading("Loading...");
                                $http.head($scope.hostMail + '?action=forgot&phone=' + $scope.data.fullPhone).then(function() {
                                    $scope.hideLoading();
                                });
                            }
                        }]
                    });
                }
            });
        }
    };
    $scope.showPassword = function() {
        if ($scope.showValue.type == "password") {
            $scope.showValue = {
                "type": "text",
                "text": "Hide"
            }
        } else {
            $scope.showValue = {
                "type": "password",
                "text": "Show"
            }
        }
    };
    $scope.takeAvatar = function() {
        var options = {
            sourceType: 0,
            allowEdit: true,
            targetWidth: 160,
            targetHeight: 160,
            destinationType: 0
        };
        Camera.getPicture(options).then(function(imageData) {
            $scope.data.avatar = "data:image/jpeg;base64," + imageData;
        }, function(err) {
            console.log(err);
        });
    };
    $scope.editInfomation = function() {
        delete $scope.data.notification;
        if (angular.isUndefined($scope.data.name) || angular.isUndefined($scope.data.birthday)) {
            $scope.data.notification = "Plese enter Name and Birthday to continue";
        } else {
            $scope.data.birthday = $filter('date')($scope.data.birthday, 'dd/MM/yyyy');
            $scope.data.phone = $localStorage.userLogin.phone;
            User($localStorage.userLogin.id).set($scope.data);
            $state.go('tab.messages');
        }
    };
})

.controller('tabCtrl', function($scope, $localStorage, Notification) {
    $scope.notification = Notification($localStorage.userLogin.id).get();
})

.controller('messagesCtrl', function($scope, $ionicPopup, $rootScope, Messages, User, $state, $localStorage) {


    $scope.checkProfiles = User($localStorage.userLogin.id).get();
    $scope.checkProfiles.$loaded(function() {
        if (angular.isDefined($scope.checkProfiles.$value)) $state.go("editInfomation");
        else User($localStorage.userLogin.id).update();
    });
    $scope.showLoading('Loading...');
    $scope.messages = Messages($localStorage.userLogin.id).get();
    $scope.messages.$loaded(function() {
        $scope.loadMessage = function() {
            angular.forEach($scope.messages, function(value) {
                value.name = User(value.$id).getName();
                value.avatar = User(value.$id).getAvatar();
            });
        };
        $scope.loadMessage();
        var watch = firebase.database().ref('messages').child($localStorage.userLogin.id);
        watch.on('value', function() {
            $scope.loadMessage();
        });
        $scope.hideLoading();
        $scope.$watch('messages.length', function(newVal, oldVal) {
            if (oldVal != newVal) $state.reload();
        });
    });
    $scope.message = {};
    $scope.choseMessagesCount = 0;
    $scope.choseMessage = function(message) {
        if (message.selected) {
            $scope.choseMessagesCount++
        } else {
            $scope.choseMessagesCount--
        }
        if ($scope.choseMessagesCount == 0) $rootScope.hideTabs = false;
        else $rootScope.hideTabs = true;
    };
    $scope.cancelChoseMessages = function() {
        angular.forEach($scope.messages, function(value) {
            delete value.selected;
        });
        $scope.choseMessagesCount = 0;
        $rootScope.hideTabs = false;
    };

    $scope.deleteMessages = function() {
        var confirmPopup = $ionicPopup.confirm({
            template: 'Delete all selected messages?',
            cssClass: 'popup-confirm-delete',
            buttons: [{
                text: 'NO',
                type: 'button-clear button-no-delete'
            }, {
                text: 'DELETE',
                type: 'button-clear',
                onTap: function(e) {
                    angular.forEach($scope.messages, function(value) {
                        if (value.selected) {
                            Messages($localStorage.userLogin.id).delete(value.$id, value.unread)
                        }
                    });
                    location.reload();
                }
            }]
        });
    };
})

.controller('messagesDetail', function($scope, $ionicScrollDelegate, $ionicTabsDelegate, $ionicSideMenuDelegate, $timeout, $ionicPopup, IonicClosePopupService, Notification, Block, Messages, Camera, DetailMessages, User, $localStorage, $state, $stateParams, Location, $cordovaFile,$sce) {
    $scope.showLoading('Loading...');
    $scope.Unread = Messages($localStorage.userLogin.id).getUnread($stateParams.id);
    $scope.Unread.$loaded(function() {
        if ($scope.Unread.$value > 0) {
            Notification($localStorage.userLogin.id).update($scope.Unread.$value);
            Messages($localStorage.userLogin.id).reset($stateParams.id);
        }
    });
    var onNewMessage = firebase.database().ref('detailMessages/' + $localStorage.userLogin.id).child($stateParams.id);
    onNewMessage.on('value', function() {
        $ionicScrollDelegate.$getByHandle('mainScroll').scrollBottom();
    });
    $scope.Detail = DetailMessages($localStorage.userLogin.id).get($stateParams.id);
    $scope.Me = {};
    $scope.Me.name = User($localStorage.userLogin.id).getName();
    $scope.Me.avatar = User($localStorage.userLogin.id).getAvatar();
    $scope.Friend = User($stateParams.id).get();
    $scope.$watch(function() {
            return $ionicSideMenuDelegate.getOpenRatio();
        },
        function(right) {
            if (right === -1) $scope.menuRightActived = true;
            else $scope.menuRightActived = false;
        });
    $scope.showPopupMenuMessages = function(type, title, id) {
        if (type != "text") title = "Select action";
        var popupMenuMessages = $ionicPopup.show({
            title: '"' + title + '"',
            cssClass: 'popup-menu-messages',
            scope: $scope,
            buttons: [{
                text: 'Copy',
                type: 'button-clear'
            }, {
                text: 'Delete',
                type: 'button-clear',
                onTap: function(e) {
                    DetailMessages($localStorage.userLogin.id).delete($stateParams.id, id);
                }
            }, ]
        });
        IonicClosePopupService.register(popupMenuMessages);
    };

    $scope.Block = Block($localStorage.userLogin.id).get($stateParams.id);
    $scope.Block.$loaded(function() {
        if (!$scope.Block.$value) {
            $scope.contentBottom = '100px';
            $scope.messageInput = function(option) {
                if (option == "text") $scope.contentBottom = '100px';
                else $scope.contentBottom = '220px';
            };

            $scope.inputText = {
                "from": 0,
                "type": "text"
            };
            $scope.sendText = function() {
                if (angular.isDefined($scope.inputText.content) && angular.isString($scope.inputText.content)) {
                    var now = new Date().getTime();
                    $scope.inputText.time = now;
                    DetailMessages($localStorage.userLogin.id).post($stateParams.id, $scope.inputText);
                    $scope.Messages = {};
                    $scope.Messages.content = $scope.inputText.content;
                    $scope.Messages.time = $scope.inputText.time;
                    $scope.Messages.unread = 0;
                    Messages($localStorage.userLogin.id).post($stateParams.id, $scope.Messages);
                    Notification().post($stateParams.id);
                    $scope.inputText = {
                        "from": 0,
                        "type": "text"
                    };
                }
            };

            $scope.inputPicture = {
                "from": 0,
                "type": "picture"
            };
            $scope.takePicture = function() {
                $ionicTabsDelegate.select(1);
                var options = {
                    quality: 75,
                    targetWidth: 720,
                    targetHeight: 1280,
                    destinationType: 0
                };
                Camera.getPicture(options).then(function(imageData) {
                    $scope.inputPicture.content = "data:image/jpeg;base64," + imageData;
                }, function(err) {
                    console.log(err);
                });
            };
            $scope.sendPicture = function() {
                if (angular.isDefined($scope.inputPicture.content)) {
                    var now = new Date().getTime();
                    $scope.inputPicture.time = now;
                    DetailMessages($localStorage.userLogin.id).post($stateParams.id, $scope.inputPicture);
                    $scope.Messages = {};
                    $scope.Messages.content = "[picture]";
                    $scope.Messages.time = $scope.inputPicture.time;
                    $scope.Messages.unread = 0;
                    Messages($localStorage.userLogin.id).post($stateParams.id, $scope.Messages);
                    Notification().post($stateParams.id);
                    $scope.inputPicture = {
                        "from": 0,
                        "type": "picture"
                    };
                } else $scope.takePicture();
            };

            $scope.showInputImages = function() {
                var options = {
                    sourceType: 0,
                    destinationType: 0
                };
                Camera.getPicture(options).then(function(imageData) {
                    $scope.inputPicture.content = "data:image/jpeg;base64," + imageData;
                    $ionicTabsDelegate.select(1);
                }, function(err) {
                    console.log(err);
                });
            };

            $scope.inputSticker = {
                "from": 0,
                "type": "sticker"
            };
            $scope.sendSticker = function(sticker) {
                if (angular.isDefined(sticker) && angular.isNumber(sticker)) {
                    var now = new Date().getTime();
                    $scope.inputSticker.time = now;
                    $scope.inputSticker.content = sticker;
                    DetailMessages($localStorage.userLogin.id).post($stateParams.id, $scope.inputSticker);
                    $scope.Messages = {};
                    $scope.Messages.content = "[sticker]";
                    $scope.Messages.time = $scope.inputSticker.time;
                    $scope.Messages.unread = 0;
                    Messages($localStorage.userLogin.id).post($stateParams.id, $scope.Messages);
                    Notification().post($stateParams.id);
                    $scope.inputSticker = {
                        "from": 0,
                        "type": "sticker"
                    };
                }
            };

            $scope.showSendLocation = function() {
                $state.go('sendLocation', {
                    id: $stateParams.id
                });
            };
        }
        $scope.hideLoading();
        $ionicScrollDelegate.scrollBottom();
    });

    $scope.blockPerson = function() {
        if (!$scope.Block.$value) {
            Block($localStorage.userLogin.id).remove($stateParams.id);
            location.reload();
        } else {
            var confirmPopup = $ionicPopup.confirm({
                template: 'This person will not be able to send messages to you.Block him/her?',
                cssClass: 'popup-confirm-delete',
                buttons: [{
                    text: 'NO',
                    type: 'button-clear',
                    onTap: function(e) {
                        $scope.Block.$value = false
                    }
                }, {
                    text: 'YES',
                    type: 'button-clear button-no-delete',
                    onTap: function(e) {
                        Block($localStorage.userLogin.id).block($stateParams.id);
                        location.reload();
                    }
                }, ]
            });
        }
    };

    $scope.clearHistory = function() {
        var confirmPopup = $ionicPopup.confirm({
            template: 'Delete chat history with this person?',
            cssClass: 'popup-confirm-delete',
            buttons: [{
                text: 'NO',
                type: 'button-clear button-no-delete'
            }, {
                text: 'YES',
                type: 'button-clear',
                onTap: function(e) {
                    DetailMessages($localStorage.userLogin.id).clear($stateParams.id);
                    Messages($localStorage.userLogin.id).clear($stateParams.id);
                }
            }, ]
        });
    };

    /* ***************************** Firebase Audio Work-around ****************************************/

    $scope.micSymbol = "ion-mic-a dark";
    $scope.playSymbol = "ion-play";
    $scope.pauseSymbol = "ion-pause";
    $scope.stopSymbol = "ion-stop";
    $scope.recordSymbol = "ion-record assertive";
    $scope.setIcon = "ion-mic-a dark"; // default is mic
    var mediaRec;
    $scope.isRecording = false;
      $scope.inputAud = {
          "from": 0,
          "type": "audio"
      };

      $scope.toggleAudio = function(){
      if($scope.isRecording == false || $scope.isRecording == "false"){
      $timeout(function(){
       $scope.isRecording = true;
       $scope.inputAudio();
      });

      }else{
      $timeout(function(){
      $scope.isRecording = false;
       mediaRec.stopRecord();
       });
      }
      };

    $scope.inputAudio = function(){
       var src = "myrecording.mp3";
        mediaRec = new Media(src,
            // success callback
            function() {
                console.log("recordAudio():Audio Success");
                 $scope.getFileee("file:///storage/emulated/0/myrecording.mp3");
            },
            // error callback
            function(err) {
                console.log("recordAudio():Audio Error: "+ err.code);
            });

        // Record audio
        mediaRec.startRecord();
    };

    $scope.getFileee = function(fileURI){

    firebase.auth().signInAnonymously()
                .then(function() {

                window.resolveLocalFileSystemURL(fileURI, function( fileEntry ){

                      fileEntry.file(function (resFile) {

                      console.log(resFile);

                        var reader = new FileReader();
                        reader.onloadend = function(evt) {

                          console.log(evt.target.result);

                          var imgBlob = new Blob([evt.target.result], {type: 'audio/mp3'});
                          var random_name = new Date().getTime();
                          imgBlob.name = random_name+'.mp3';
                          console.log(JSON.stringify(imgBlob));

                          var uploadTask = firebase.storage().ref('audios/'+random_name+'.mp3').put(imgBlob);

                          uploadTask.on('state_changed', function(snapshot){
                            console.log('state_changed');
                          }, function(error) {
                            console.log(JSON.stringify(error));
                          }, function() {
                            // Handle successful uploads on complete
                            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                            var downloadURL = uploadTask.snapshot.downloadURL;
                            console.log("downloadURL ==>"+downloadURL);
                            $scope.inputAud.content = downloadURL;
                            $scope.storeMessage();
                          });
                        };

                        reader.readAsArrayBuffer(resFile);

                      });
                    });

                })
                .catch(function(error){
                });

    };



      $scope.storeMessage = function(){
          var now = new Date().getTime();
          $scope.inputAud.time = now;
          DetailMessages($localStorage.userLogin.id).post($stateParams.id, $scope.inputAud);
          $scope.Messages = {};
          $scope.Messages.content = "[audio]";
          $scope.Messages.time = $scope.inputAud.time;
          $scope.Messages.unread = 0;
          Messages($localStorage.userLogin.id).post($stateParams.id, $scope.Messages);
          Notification().post($stateParams.id);
          $scope.inputAud = {
              "from": 0,
              "type": "audio"
          };
      };


    /* ***************************** Firebase Audio Work-around ****************************************/

    /* ***************************** Play Audio in Message ****************************************/

    $scope.getAudioAndPlay = function(audioUrl){
    console.log("audioUrl ==>"+audioUrl);

       firebase.auth().signInAnonymously()
       .then(function(){
       var refStorage = firebase.storage().refFromURL("gs://testchat-99595.appspot.com/audios").child("test.mp3");
       refStorage.getDownloadURL()
       .then(function(url) {
           console.log("refStorage url ==>"+url);
          var URL = "https://firebasestorage.googleapis.com/v0/b/testchat-99595.appspot.com/o/audios%2Ftest.mp3?alt=media&token=1b873749-54c3-414b-8cfe-7c43d9d57425";//audioUrl; //"http://cordova.apache.org/static/img/cordova_bot.png";
          var Folder_Name = "GranKaz";
          var File_Name = "maulika";//new Date().getTime();
          $scope.download(url, Folder_Name, File_Name); //If available download function call*/

       })
       .catch(function(e){ alert("e1"+e)});
       })
       .catch(function(e){ alert("e2"+e)});



    };
      $scope.downloadFile = function() {
            var URL = "http://cordova.apache.org/static/img/cordova_bot.png";
            var Folder_Name = "CHECK_FILES";
            var File_Name = "maulika";
            $scope.download(URL, Folder_Name, File_Name); //If available download function call
        };

        $scope.download = function(URL, Folder_Name, File_Name) {
            window.requestFileSystem(cordova.file.dataDirectory, 0,
                function fileSystemSuccess(fileSystem) {
                    var download_link = encodeURI(URL);

                    var temp_ext = URL.split("?");
                    temp_ext = temp_ext[0];
                    console.log("temp_ext==>"+temp_ext);
                    ext = temp_ext.substr(temp_ext.lastIndexOf('.') + 1); //Get extension of URL
                    console.log("ext==>"+ext);

                    var directoryEntry = fileSystem.root; // to get root path of directory
                    console.log("directoryEntry ==>" + JSON.stringify(directoryEntry));
                    directoryEntry.getDirectory(Folder_Name, {
                            create: true,
                            exclusive: false
                        },
                        function onDirectorySuccess(parent) {
                            // Directory created successfuly
                            console.log("onDirectorySuccess ==>" + JSON.stringify(parent));

                            var rootdir = fileSystem.root;
                            console.log("rootdir ==>" + JSON.stringify(rootdir));
                            var fp = rootdir.nativeURL; // Returns Fulpath of local directory
                            console.log("rootdir ==>" + fp);
                            fp = fp + "" + Folder_Name + "/" + File_Name + "." + ext; // fullpath and name of the file which we want to give
                            console.log("fp ==>" + fp);
                            // download function call
                            $scope.filetransfer(download_link, fp);
                        },
                        function onDirectoryFail(error) {
                            //Error while creating directory
                            console.log("Unable to create new directory: " + error.code);
                        }); // creating folder in sdcard

                },
                function fileSystemFail(evt) {
                    //Unable to access file system
                    console.log(evt.target.error.code);
                });
        };

        $scope.filetransfer = function(download_link, fp) {
            var fileTransfer = new FileTransfer();
            // File download function with URL and local path
            fileTransfer.download(download_link, fp,
                function(entry) {
                    console.log("download complete: " + JSON.stringify(entry));
                    console.log(typeof(entry.toURL()));
                    var localAudioPath = entry.toURL();
                    /* Play audio asa downloaded */
                    $scope.playAudio(localAudioPath);

                },
                function(error) {
                    //Download abort errors or download failed errors
                    alert("download error source " + error.source);
                    //alert("download error target " + error.target);
                    //alert("upload error code" + error.code);
                }
            );
        };

        $scope.playAudio = function(local_audio_path){
         var my_media = new Media(local_audio_path,
                // success callback
                function () {
                    console.log("playAudio():Audio Success");
                },
                // error callback
                function (err) {
                    console.log("playAudio():Audio Error: " + err);
                }
            );
            // Play audio
            my_media.play();
        };

        $scope.getAudioUrl = function(){
               firebase.auth().signInAnonymously()
               .then(function(){
//               console.log(JSON.stringify(firebase.storage().ref()));
               var storageRef = firebase.storage().ref("audios/test.mp3");
               storageRef.getDownloadURL()
               .then(function(url) {
                  // This can be downloaded directly:
                    var xhr = new XMLHttpRequest();
                    xhr.responseType = 'blob';
                    xhr.onload = function(event) {
                      var blob = xhr.response;
                    };
                    xhr.open('GET', url);
                    xhr.send();
                    console.log("refStorage url ==>"+url);

                   return $sce.trustAsResourceUrl(url);

               })
               .catch(function(e){ alert("e1"+e)});
               })
               .catch(function(e){ alert("e2"+e)});
        };


              $scope.changeUrl = function(inputURl){
              console.log("changeUrl ==>"+$sce.trustAsResourceUrl(inputURl));
              return $sce.trustAsResourceUrl(inputURl);
              };

        /* ***************************** Play Audio in Message ****************************************/


})

.controller('sendLocation', function($scope, Location, $state, $stateParams, $localStorage, Messages, DetailMessages, DetailGroups, $ionicModal) {
    Location($localStorage.userLogin.id).update();
    $scope.inputLocation = {
        "from": 0,
        "type": "location"
    };
    if (angular.isUndefined($localStorage.recentLocation)) $localStorage.recentLocation = [];
    $scope.recent = $localStorage.recentLocation;
    $scope.Me = Location($localStorage.userLogin.id).get();
    $scope.Me.$loaded(function() {
        if (angular.isDefined($scope.Me.$value)) $scope.Me = {
            lat: 21.036728,
            lng: 105.8346994
        };
        $scope.location = {};
        $scope.location.lat = $scope.Me.lat;
        $scope.location.lng = $scope.Me.lng;
        var mapOptions = {
            center: {
                lat: $scope.location.lat,
                lng: $scope.location.lng
            },
            zoom: 18,
        };
        $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
        //Marker location of user logined
        $scope.markerIcon = {
            url: 'css/img/icon-location-marker.png',
            scaledSize: new google.maps.Size(32, 32)
        };
        $scope.createMarker = function() {
            $scope.marker = new google.maps.Marker({
                map: $scope.map,
                position: $scope.location,
                icon: $scope.markerIcon
            });
        };
        $scope.createMarker();
        $scope.data = {};
        $scope.$watch('data.search', function() {
            if ($scope.data.search) {
                var request = {};
                request.query = $scope.data.search;
                $scope.search = new google.maps.places.PlacesService($scope.map);
                $scope.search.textSearch(request, function(resuilt, status) {
                    if (status == google.maps.places.PlacesServiceStatus.OK) {
                        $scope.resuilt = resuilt;
                    }
                });
            }
        });
        $scope.selectLocation = function(location) {
            $scope.location.lat = location.geometry.location.lat();
            $scope.location.lng = location.geometry.location.lng();
            $scope.data.name = location.name;
            $scope.data.address = location.formatted_address;
            $scope.createMarker();
            $scope.map.panTo($scope.location);
            $scope.closeSearchLocation();
        };
        $scope.selectRecent = function(location) {
            $scope.location = location.location;
            $scope.data.name = location.name;
            $scope.data.address = location.address;
            $scope.createMarker();
            $scope.map.panTo($scope.location);
        };
    });

    $ionicModal.fromTemplateUrl('templates/messages/search-location.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.modalsearchLocation = modal;
    });
    $scope.showSearchLocation = function() {
        $scope.modalsearchLocation.show();
    };
    $scope.closeSearchLocation = function() {
        $scope.modalsearchLocation.hide();
    };

    $scope.sendLocation = function() {
        $scope.inputLocation.content = $scope.location;
        if (angular.isDefined($scope.inputLocation.content)) {
            if (angular.isDefined($scope.data.name)) {
                var check = true;
                angular.forEach($localStorage.recentLocation, function(value) {
                    if (value.name = $scope.data.name) check = false;
                });
                if (check == true) {
                    var newRecent = {};
                    newRecent.location = $scope.inputLocation.content;
                    newRecent.name = $scope.data.name;
                    newRecent.address = $scope.data.address;
                    $localStorage.recentLocation.push(newRecent);
                }
            }
            var now = new Date().getTime();
            $scope.inputLocation.time = now;
            if ($stateParams.source == 'group') {
                $state.go('groupDetail', {
                    id: $stateParams.id
                });
                $scope.inputLocation.from = $localStorage.userLogin.id;
                DetailGroups($stateParams.id).post($scope.inputLocation);
                $scope.inputLocation = {
                    "from": 0,
                    "type": "location"
                };
            } else {
                $state.go('detail', {
                    id: $stateParams.id
                });
                DetailMessages($localStorage.userLogin.id).post($stateParams.id, $scope.inputLocation);
                $scope.Messages = {};
                $scope.Messages.content = '[location]';
                $scope.Messages.time = $scope.inputLocation.time;
                $scope.Messages.unread = 0;
                Messages($localStorage.userLogin.id).post($stateParams.id, $scope.Messages);
                Notification().post($stateParams.id);
                $scope.inputLocation = {
                    "from": 0,
                    "type": "location"
                };
            }
        }
    };
})

.controller('messagesCall', function($scope, $ionicModal, $timeout) {
    $scope.callStatus = "Calling";
    $scope.callTime = {};
    $scope.callTime = {
        "minute": 0,
        "second": 0
    };
    $scope.call = {};
    $scope.call.recount = 0;
    $scope.call.size = 140;
    $scope.call.spacing = 20;
    $scope.call.margin = -70;
    $scope.call.top = -40;
    $scope.changeBackground = function() {
        if ($scope.call.size >= 300) {
            $scope.call.size = 140;
            $scope.call.spacing = 20;
            $scope.call.margin = -70;
            $scope.call.top = -40;
            $scope.call.recount++;
        } else {
            $scope.call.size += 40;
            $scope.call.spacing += 10;
            $scope.call.margin -= 20;
            $scope.call.top -= 20;
        }
        if ($scope.call.recount >= 2) $scope.callStatus = "Ringing...";
        if ($scope.call.recount >= 3) {
            $scope.callStatus = "Quality:";
            $scope.callListing = true;
        }
        if ($scope.callStatus == "Quality:") {
            $scope.callTime.second++;
            if ($scope.callTime.second >= 60) {
                $scope.callTime.minute++;
                $scope.callTime.second = 0;
            }
        }
        $scope.autoChange = $timeout(function() {
            $scope.changeBackground();
        }, 1000);
    }
    $scope.changeBackground();
    $ionicModal.fromTemplateUrl('templates/messages/call.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.modalmessagesCall = modal;
    });
    $scope.showMessagesCall = function() {
        $scope.modalmessagesCall.show();
    };
    $scope.closeMessagesCall = function() {
        $scope.modalmessagesCall.hide();
        location.reload();
    };
})

.controller('contactsCtrl', function($scope, $ionicPopup, IonicClosePopupService, Block, Contacts, ContactsRecommended, User, $localStorage, $filter) {
    $scope.showLoading('Loading...');
    $scope.timeNow = new Date().getTime();
    $scope.contactRecommended = ContactsRecommended($localStorage.userLogin.id).get();
    $scope.contacts = Contacts($localStorage.userLogin.id).get();
    $scope.contacts.$loaded(function() {
        $scope.hideLoading();
        angular.forEach($scope.contacts, function(value) {
            value.name = User(value.$id).getName();
            value.avatar = User(value.$id).getAvatar();
            value.lastSign = User(value.$id).getLastSign();
        });
        $scope.getAlpha = function(id) {
            if (id >= 1) {
                $scope.contacts = $filter('orderBy')($scope.contacts, 'name.$value');
                var lastName = $filter('firstChar')($scope.contacts[id - 1].name.$value);
                var nowName = $filter('firstChar')($scope.contacts[id].name.$value);
                if (lastName == nowName) return false;
                else return true;
            }
        };
    });
    $scope.showMenuSearch = function(name, id) {
        var confirmPopup = $ionicPopup.confirm({
            title: name,
            cssClass: 'popup-menu-contact',
            buttons: [{
                text: 'Block',
                type: 'button-clear',
                onTap: function(e) {
                    $scope.Block = Block($localStorage.userLogin.id).get(id);
                    $scope.Block.$loaded(function() {
                        if ($scope.Block.$value) {
                            Block($localStorage.userLogin.id).remove(id);
                            location.reload();
                        } else {
                            var confirmPopup = $ionicPopup.confirm({
                                template: 'This person will not be able to send messages to you.Block him/her?',
                                cssClass: 'popup-confirm-delete',
                                buttons: [{
                                    text: 'NO',
                                    type: 'button-clear',
                                }, {
                                    text: 'YES',
                                    type: 'button-clear button-no-delete',
                                    onTap: function(e) {
                                        Block($localStorage.userLogin.id).block(id);
                                        location.reload();
                                    }
                                }, ]
                            });
                        }
                    });
                }
            }, {
                text: 'Remove friend',
                type: 'button-clear',
                onTap: function(e) {
                    Contacts($localStorage.userLogin.id).remove(id);
                }
            }]
        });
        IonicClosePopupService.register(confirmPopup);
    };
})

.controller('contactsRecommended', function($scope, ContactsRecommended, Contacts, User, $localStorage) {
    $scope.showLoading('Loading...');
    $scope.contacts = ContactsRecommended($localStorage.userLogin.id).get();
    $scope.contacts.$loaded(function() {
        $scope.hideLoading();
        angular.forEach($scope.contacts, function(value) {
            value.name = User(value.$id).getName();
            value.avatar = User(value.$id).getAvatar();
            value.phone = User(value.$id).getPhone();
        });
    });
    $scope.accept = function(id) {
        Contacts($localStorage.userLogin.id).post(id);
        ContactsRecommended($localStorage.userLogin.id).remove(id);
    };
})

.controller('contactsAdd', function($scope, $state, $localStorage, $ionicPopup, Login) {
    $scope.choseArea = {
        name: "United States",
        "areacode": "1"
    };
    $scope.warning = false;
    $scope.searchPerson = function(phone) {
        $scope.warning = false;
        $scope.phoneFull = $scope.choseArea.areacode + phone;
        if ($scope.phoneFull.length < 9) {
            $scope.warning = true
        } else {
            $scope.person = Login().get($scope.phoneFull);
            $scope.person.$loaded(function() {
                if (angular.isDefined($scope.person.id) && $scope.person.id != $localStorage.userLogin.id) {
                    $state.go('tab.searchContacts', {
                        id: $scope.person.id
                    });
                } else {
                    $scope.warning = true
                }
            });
        }
    };
    $scope.inviteSms = function() {
        window.plugins.socialsharing.shareViaSMS(
            $scope.inviteText,
            null,
            function(msg) {
                console.log('ok: ' + msg)
            },
            function(msg) {
                alert('Error: ' + msg)
            }
        );
    };
})

.controller('contactsSearch', function($scope, $state, $stateParams, User, Contacts, $localStorage) {
    $scope.showLoading("Loading...");
    $scope.contact = User($stateParams.id).get();
    $scope.contact.$loaded(function() {
        $scope.myFriend = Contacts($localStorage.userLogin.id).getFriend();
        $scope.myFriend.$loaded(function() {
            $scope.myFriend = Object.keys($scope.myFriend);
            if ($scope.myFriend.indexOf($scope.contact.$id) != -1) $scope.isFriend = true;
            $scope.hideLoading();
        });
    });
    $scope.inviteFriend = function(id) {
        $state.go('tab.inviteContacts', {
            id: id
        });
    };
})

.controller('contactsUpdate', function($scope, $timeout, $localStorage, Login, ContactsRecommended) {
    $scope.lastupdate = $localStorage.lastUpdate;
    document.addEventListener("deviceready", onDeviceReady, false);

    function onDeviceReady() {
        $scope.showLoading("Loading...");

        function onSuccess(contacts) {
            $scope.contacts = {};
            var nowPhone;
            angular.forEach(contacts, function(value) {
                if (angular.isArray(value.phoneNumbers)) {
                    angular.forEach(value.phoneNumbers, function(phone) {
                        if (phone.type == "mobile") {
                            nowPhone = phone.value.match(/\d/g);
                            if (nowPhone != null) {
                                nowPhone = Number(nowPhone.join(""));
                                nowPhone = $localStorage.userLogin.areacode + nowPhone.toString();
                                $scope.contacts[nowPhone] = Login().getId(nowPhone);
                            }
                        }
                    });
                }
            });
            $scope.hideLoading();
            $scope.updateContacts = function() {
                $scope.showLoading("Loading...");
                angular.forEach($scope.contacts, function(valuePhone) {
                    ContactsRecommended($localStorage.userLogin.id).post(valuePhone.$value);
                });
                $localStorage.lastUpdate = new Date().getTime();
                $scope.lastupdate = $localStorage.lastUpdate;
                $scope.hideLoading();
            };
        };

        function onError(contactError) {
            $scope.hideLoading();
            alert(contactError);
        };
        var fields = ["phoneNumbers"];
        navigator.contacts.find(fields, onSuccess, onError);
    }
})

.controller('contactsNearby', function($scope, $http, $ionicModal, $ionicPopup, User, Contacts, $localStorage) {
    $scope.settings = {
        "gender": "All",
        "fromage": 15,
        "toage": 80,
        "visible": "All"
    };
    $scope.getRangeAge = function() {
        $scope.beforefrom = $scope.settings.fromage - 1;
        $scope.afterfrom = $scope.settings.fromage + 1;
        $scope.beforeto = $scope.settings.toage - 1;
        $scope.afterto = $scope.settings.toage + 1;
        if ($scope.beforefrom < 15) $scope.beforefrom = 80;
        if ($scope.beforeto < 15) $scope.beforeto = 80;
        if ($scope.afterfrom > 80) $scope.afterfrom = 15;
        if ($scope.afterto > 80) $scope.afterto = 15;
    };
    $scope.getRangeAge();
    $scope.selectRange = function(to, number) {
        if (to == 1) {
            $scope.settings.toage = number;
        } else {
            $scope.settings.fromage = number;
        }
        $scope.getRangeAge();
    };
    $scope.plusFromAge = function() {
        $scope.settings.fromage = $scope.afterfrom;
        $scope.getRangeAge();
    };
    $scope.minusFromAge = function() {
        $scope.settings.fromage = $scope.beforefrom;
        $scope.getRangeAge();
    };
    $scope.plusToAge = function() {
        $scope.settings.toage = $scope.afterto;
        $scope.getRangeAge();
    };
    $scope.minusToAge = function() {
        $scope.settings.toage = $scope.beforeto;
        $scope.getRangeAge();
    };

    $ionicModal.fromTemplateUrl('templates/contacts/nearby-setting.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.modalnearbySetting = modal;
    });
    $scope.showNearbySetting = function() {
        $scope.iSettings = angular.copy($scope.settings);
        $scope.modalnearbySetting.show();
    };
    $scope.closeNearbySetting = function() {
        $scope.modalnearbySetting.hide();
    };
    $scope.cancelNearbySetting = function() {
        $scope.settings = $scope.iSettings;
        $scope.closeNearbySetting();
    };
    $scope.updateNearbySetting = function() {
        $scope.closeNearbySetting();
        $scope.updateNearby();
    };

    $scope.selectRangeAge = function() {
        $scope.iRangeAge = angular.copy($scope.settings);
        var selectRangeAge = $ionicPopup.confirm({
            title: 'Select age',
            templateUrl: 'templates/contacts/select-range-age.html',
            scope: $scope,
            cssClass: 'popup-select-age',
            buttons: [{
                text: 'CANCEL',
                type: 'button-clear',
                onTap: function(e) {
                    $scope.settings = $scope.iRangeAge;
                    $scope.closeSelectRangeAge();
                }
            }, {
                text: 'OK',
                type: 'button-clear button-ok',
                onTap: function(e) {
                    if ($scope.settings.toage < $scope.settings.fromage) {
                        var tg = angular.copy($scope.settings.toage);
                        $scope.settings.toage = angular.copy($scope.settings.fromage);
                        $scope.settings.fromage = tg;
                    }
                    $scope.closeSelectRangeAge();
                }
            }]
        });
        $scope.closeSelectRangeAge = function() {
            selectRangeAge.close();
        };
    };
    $scope.updateNearby = function() {
        $scope.showLoading('Loading...');
        $scope.nearby = new Array;
        var currentYear = new Date().getFullYear();
        $scope.myFriend = Contacts($localStorage.userLogin.id).getFriend();
        $scope.myFriend.$loaded(function() {
            $scope.myFriend = Object.keys($scope.myFriend);
            $scope.iNearby = User().filter($scope.settings.gender);
            $scope.iNearby.$loaded(function() {
                var userYear;
                angular.forEach($scope.iNearby, function(value) {
                    value.age = currentYear - Number(value.birthday.split('/')[2]);
                    if (value.age >= $scope.settings.fromage && value.age <= $scope.settings.toage && $scope.myFriend.indexOf(value.$id) == -1)
                        $scope.nearby.push(value);
                });
                $scope.hideLoading();
            });
        });
    };
    $scope.updateNearby();
})

.controller('nearbyLocation', function($scope, $ionicPopover, $localStorage, Location, User) {
    Location($localStorage.userLogin.id).update();
    $scope.Me = Location($localStorage.userLogin.id).get();
    $scope.Me.$loaded(function() {
        if (angular.isDefined($scope.Me.$value)) $scope.Me = {
            lat: 21.036728,
            lng: 105.8346994
        };
        $scope.location = {};
        $scope.location.lat = $scope.Me.lat;
        $scope.location.lng = $scope.Me.lng;
        var mapOptions = {
            center: {
                lat: $scope.location.lat,
                lng: $scope.location.lng
            },
            zoom: 18,
        };
        $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
        //Marker location of user logined
        $scope.markerIcon = {
            url: 'css/img/icon-location-marker.png',
            scaledSize: new google.maps.Size(32, 32)
        };
        $scope.marker = new google.maps.Marker({
            map: $scope.map,
            position: $scope.location,
            icon: $scope.markerIcon
        });
        $scope.nearby = Location().getNearby($scope.Me.nearby);
        $scope.nearby.$loaded(function() {
            delete $scope.nearby[$localStorage.userLogin.id];
            angular.forEach($scope.nearby, function(value, key) {
                value.user = User(key).get();
                value.user.$loaded(function() {
                    var currentYear = new Date().getFullYear();
                    var userAge = value.user.birthday.split('/');
                    var userAge = currentYear - Number(userAge[2]);
                    if (angular.isDefined(value.user.avatar)) $scope.markerAvatar = value.user.avatar;
                    else $scope.markerAvatar = 'css/img/icon-avatar.png';
                    $scope.markerIcon = {
                        url: $scope.markerAvatar,
                        scaledSize: new google.maps.Size(32, 32)
                    };
                    $scope.marker = new google.maps.Marker({
                        map: $scope.map,
                        position: {
                            lat: value.lat,
                            lng: value.lng
                        },
                        icon: $scope.markerIcon,
                    });
                    var content = '<div class="list"><div class="item item-avatar"><img src="';
                    if (angular.isDefined(value.user.avatar)) content = content + value.user.avatar;
                    else content = content + 'css/img/icon-avatar.png';
                    content = content + '"><div>' + value.user.name + '</div><span class="positive margin-right ';
                    if (value.user.gender == 'Male') content = content + 'ion-male';
                    else content = content + 'ion-female';
                    content = content + '"></span> ' + userAge + '<a class="button button-outline button-positive" href="#/tab/contacts/invite/' + key + '">+ Add</a></div></div>';
                    $scope.infowindow = new google.maps.InfoWindow({
                        content: content
                    });
                    $scope.marker.addListener('click', function() {
                        $scope.infowindow.open($scope.map, this);
                    });
                });
            });
        });
    });
})

.controller('contactsInvite', function($scope, $stateParams, ContactsRecommended, $localStorage, User) {
    $scope.Me = User($localStorage.userLogin.id).getName();
    $scope.Friend = {};
    $scope.Friend.name = User($stateParams.id).getName();
    $scope.Friend.phone = User($stateParams.id).getPhone();
    $scope.acceptInvite = function() {
        ContactsRecommended($localStorage.userLogin.id).post($stateParams.id);
        $scope.goBack();
    }
})

.controller('groupCtrl', function($scope, $http, $state, IonicClosePopupService, UserGroups, Groups, User, $ionicPopup, $localStorage) {
    $scope.showLoading("Loading...");
    $scope.groups = UserGroups($localStorage.userLogin.id).get();
    $scope.groups.$loaded(function() {
        angular.forEach($scope.groups, function(item) {
            item.avatar = new Array;
            item.numUser = Groups(item.$id).getNumUser();
            item.nameGroup = Groups(item.$id).getName();
            item.user = Groups(item.$id).getUser(4);
            item.user.$loaded(function() {
                item.name = new Array;
                angular.forEach(item.user, function(user) {
                    item.name.push(User(user.$id).getName());
                    item.avatar.push(User(user.$id).getAvatar());
                });
            });
        });
        $scope.hideLoading();
    });
    $scope.showPopupMenuGroup = function(id, nameGroup, title) {
        if (nameGroup && angular.isString(nameGroup)) var name = nameGroup;
        else {
            var name = '';
            for (var i = 0; i <= 2; i++) {
                if (title[i].$value) name += title[i].$value + ', ';
            }
        }
        var popupMenuGroup = $ionicPopup.show({
            title: name,
            cssClass: 'popup-menu-group',
            scope: null,
            buttons: [{
                text: 'Leave group',
                type: 'button-clear',
                onTap: function(e) {
                    $scope.confirmLeave(id)
                }
            }, {
                text: 'Change name',
                type: 'button-clear',
                onTap: function(e) {
                    $scope.changeName(id, nameGroup)
                }
            }, {
                text: 'Add user',
                type: 'button-clear',
                onTap: function(e) {
                    $state.go('tab.addGroup', {
                        id: id
                    });
                }
            }, {
                text: 'View user',
                type: 'button-clear',
                onTap: function(e) {
                    $state.go('tab.viewGroup', {
                        id: id
                    });
                }
            }, ]
        });
        IonicClosePopupService.register(popupMenuGroup);
    };
    $scope.confirmLeave = function(id) {
        var confirmPopup = $ionicPopup.confirm({
            template: 'Leave group chat will delete chat history. Leave?',
            cssClass: 'popup-confirm-leave',
            buttons: [{
                text: 'NO',
                type: 'button-clear'
            }, {
                text: 'YES',
                type: 'button-clear button-no-delete',
                onTap: function(e) {
                    Groups(id).leave($localStorage.userLogin.id);
                    UserGroups($localStorage.userLogin.id).leave(id);
                }
            }, ]
        });
    };
    $scope.changeName = function(id, name) {
        $scope.data = {
            name: name
        };
        var myPopup = $ionicPopup.show({
            template: '<input type="text" ng-model="data.name" class="light-bg">',
            cssClass: 'popup-confirm-leave',
            scope: $scope,
            buttons: [{
                text: 'Cancel',
                type: 'button-clear'
            }, {
                text: '<b>Save</b>',
                type: 'button-clear button-no-delete',
                onTap: function(e) {
                    Groups(id).changeName($scope.data.name);
                }
            }]
        });
    };
})

.controller('groupCreate', function($scope, $state, Groups, UserGroups, Contacts, User, $localStorage, $filter) {
    $scope.showLoading('Loading...');
    $scope.contacts = Contacts($localStorage.userLogin.id).get();
    $scope.contacts.$loaded(function() {
        $scope.hideLoading();
        angular.forEach($scope.contacts, function(value) {
            value.name = User(value.$id).getName();
            value.avatar = User(value.$id).getAvatar();
        });
        $scope.getAlpha = function(id) {
            if (id >= 1) {
                $scope.contacts = $filter('orderBy')($scope.contacts, 'name.$value');
                var lastName = $filter('firstChar')($scope.contacts[id - 1].name.$value);
                var nowName = $filter('firstChar')($scope.contacts[id].name.$value);
                if (lastName == nowName) return false;
                else return true;
            }
        };
    });
    $scope.contactsSelected = {};
    $scope.selectedCount = 0;
    $scope.change = function(contact) {
        if (contact.selected) {
            $scope.contactsSelected[contact.$id] = true;
            $scope.selectedCount++;
        } else {
            delete $scope.contactsSelected[contact.$id];
            $scope.selectedCount--
        }
    };
    $scope.createGroup = function() {
        if ($scope.selectedCount > 0) {
            $scope.last = Groups().getLast();
            $scope.last.$loaded(function() {
                $scope.last = Number($scope.last.$value) + 1;
                Groups().create($scope.last, $localStorage.userLogin.id, $scope.selectedCount, $scope.contactsSelected, $scope.nameGroup);
                UserGroups().post($localStorage.userLogin.id, $scope.contactsSelected, $scope.last);
                $state.go('groupDetail', {
                    id: $scope.last
                });
            });
        }
    };
})

.controller('groupAdd', function($scope, $stateParams, $state, Groups, UserGroups, Contacts, User, $localStorage, $filter) {
    $scope.showLoading('Loading...');
    $scope.contacts = Contacts($localStorage.userLogin.id).get();
    $scope.contacts.$loaded(function() {
        $scope.hideLoading();
        angular.forEach($scope.contacts, function(value) {
            value.name = User(value.$id).getName();
            value.avatar = User(value.$id).getAvatar();
        });
        $scope.getAlpha = function(id) {
            if (id >= 1) {
                $scope.contacts = $filter('orderBy')($scope.contacts, 'name.$value');
                var lastName = $filter('firstChar')($scope.contacts[id - 1].name.$value);
                var nowName = $filter('firstChar')($scope.contacts[id].name.$value);
                if (lastName == nowName) return false;
                else return true;
            }
        };
    });
    $scope.contactsSelected = {};
    $scope.selectedCount = 0;
    $scope.change = function(contact) {
        if (contact.selected) {
            $scope.contactsSelected[contact.$id] = true;
            $scope.selectedCount++;
        } else {
            delete $scope.contactsSelected[contact.$id];
            $scope.selectedCount--
        }
    };
    $scope.addGroup = function() {
        if ($scope.selectedCount > 0) {
            Groups($stateParams.id).add($scope.contactsSelected, $scope.selectedCount);
            UserGroups().add($stateParams.id, $scope.contactsSelected);
            $state.go('tab.group');
        }
    };
})

.controller('groupView', function($scope, $stateParams, Groups, User, $filter) {
    $scope.showLoading("Loading...");
    $scope.name = Groups($stateParams.id).getName();
    $scope.count = Groups($stateParams.id).getNumUser();
    $scope.contacts = Groups($stateParams.id).getUser();
    $scope.contacts.$loaded(function() {
        angular.forEach($scope.contacts, function(value) {
            value.name = User(value.$id).getName();
            value.avatar = User(value.$id).getAvatar();
        });
        $scope.getAlpha = function(id) {
            if (id >= 1) {
                $scope.contacts = $filter('orderBy')($scope.contacts, 'name.$value');
                var lastName = $filter('firstChar')($scope.contacts[id - 1].name.$value);
                var nowName = $filter('firstChar')($scope.contacts[id].name.$value);
                if (lastName == nowName) return false;
                else return true;
            }
        };
        $scope.hideLoading();
    });
})

.controller('groupDetail', function($scope, $state, $localStorage, $ionicModal, $ionicTabsDelegate, $timeout, $ionicScrollDelegate, User, Groups, DetailGroups, Camera, $stateParams, Location) {
    $scope.contentBottom = '100px';
    $scope.showLoading('Loading...');
    $scope.Me = $localStorage.userLogin.id;
    $scope.Groups = {};
    $scope.Groups.nameGroup = Groups($stateParams.id).getName();
    $scope.Groups.countUser = Groups($stateParams.id).getNumUser();
    $scope.Groups.user = Groups($stateParams.id).getUser();
    $scope.Groups.user.$loaded(function() {
        $scope.Groups.name = {};
        $scope.Groups.avatar = {};
        angular.forEach($scope.Groups.user, function(item) {
            $scope.Groups.name[item.$id] = User(item.$id).getName();
            $scope.Groups.avatar[item.$id] = User(item.$id).getAvatar();
        });
    });
    $scope.Detail = DetailGroups($stateParams.id).get();
    $scope.Detail.$loaded(function() {
        $scope.hideLoading();
        $ionicScrollDelegate.scrollBottom();
    });
    var onNewMessage = firebase.database().ref('detailGroups').child($stateParams.id);
    onNewMessage.on('value', function() {
        $ionicScrollDelegate.$getByHandle('mainScroll').scrollBottom();
    });

    $scope.messageInput = function(option) {
        if (option == "text") $scope.contentBottom = '100px';
        else $scope.contentBottom = '220px';
    };

    $scope.inputText = {
        "type": "text"
    };
    $scope.sendText = function() {
        if (angular.isDefined($scope.inputText.content) && angular.isString($scope.inputText.content)) {
            var now = new Date().getTime();
            $scope.inputText.time = now;
            $scope.inputText.from = $scope.Me;
            DetailGroups($stateParams.id).post($scope.inputText);
            $scope.inputText = {
                "type": "text"
            };
        }
    };

    $scope.inputPicture = {
        "type": "picture"
    };
    $scope.takePicture = function() {
        $ionicTabsDelegate.select(1);
        var options = {
            quality: 75,
            targetWidth: 720,
            targetHeight: 1280,
            destinationType: 0
        };
        Camera.getPicture(options).then(function(imageData) {
            $scope.inputPicture.content = "data:image/jpeg;base64," + imageData;
        }, function(err) {
            console.log(err);
        });
    };
    $scope.sendPicture = function() {
        if (angular.isDefined($scope.inputPicture.content)) {
            var now = new Date().getTime();
            $scope.inputPicture.time = now;
            $scope.inputPicture.from = $scope.Me;
            DetailGroups($stateParams.id).post($scope.inputPicture);
            $scope.inputPicture = {
                "type": "picture"
            };
        } else $scope.takePicture();
    };

    $scope.showInputImages = function() {
        var options = {
            sourceType: 0,
            destinationType: 0
        };
        Camera.getPicture(options).then(function(imageData) {
            $scope.inputPicture.content = "data:image/jpeg;base64," + imageData;
            $ionicTabsDelegate.select(1);
        }, function(err) {
            console.log(err);
        });
    };

    $scope.inputSticker = {
        "type": "sticker"
    };
    $scope.sendSticker = function(sticker) {
        if (angular.isDefined(sticker) && angular.isNumber(sticker)) {
            var now = new Date().getTime();
            $scope.inputSticker.time = now;
            $scope.inputSticker.from = $scope.Me;
            $scope.inputSticker.content = sticker;
            DetailGroups($stateParams.id).post($scope.inputSticker);
            $scope.inputSticker = {
                "type": "sticker"
            };
        }
    };

    $scope.showSendLocation = function() {
        $state.go('sendLocation', {
            id: $stateParams.id,
            source: 'group'
        });
    };


    /* ***************************** GROUP :: Firebase Audio Work-around ****************************************/

             $scope.micSymbol = "ion-mic-a dark";
             $scope.playSymbol = "ion-play";
             $scope.pauseSymbol = "ion-pause";
             $scope.stopSymbol = "ion-stop";
             $scope.recordSymbol = "ion-record assertive";

             $scope.setIcon = "ion-mic-a dark"; // default is mic
             var mediaRec;

             $scope.isRecording = false;

               $scope.inputAud = {
                   "from": 0,
                   "type": "audio"
               };

               $scope.toggleAudio = function(){
               if($scope.isRecording == false || $scope.isRecording == "false"){
               $timeout(function(){
                $scope.isRecording = true;
                $scope.inputAudio();
               });

               }else{
               $timeout(function(){
               $scope.isRecording = false;
                mediaRec.stopRecord();
                });
               }
               };

             $scope.inputAudio = function(){
                var src = "myrecording.mp3";
                 mediaRec = new Media(src,
                     // success callback
                     function() {
                         console.log("recordAudio():Audio Success");
                          $scope.getFileee("file:///storage/emulated/0/myrecording.mp3");
                     },
                     // error callback
                     function(err) {
                         console.log("recordAudio():Audio Error: "+ err.code);
                     });

                 // Record audio
                 mediaRec.startRecord();
             };

             $scope.getFileee = function(fileURI){

             firebase.auth().signInAnonymously()
                         .then(function() {

                         window.resolveLocalFileSystemURL(fileURI, function( fileEntry ){

                               fileEntry.file(function (resFile) {

                               console.log(resFile);

                                 var reader = new FileReader();
                                 reader.onloadend = function(evt) {

                                   console.log(evt.target.result);

                                   var imgBlob = new Blob([evt.target.result], {type: 'audio/mp3'});
                                   var random_name = new Date().getTime();
                                   imgBlob.name = random_name+'.mp3';
                                   console.log(JSON.stringify(imgBlob));

                                   var uploadTask = firebase.storage().ref('audios/'+random_name+'.mp3').put(imgBlob);

                                   uploadTask.on('state_changed', function(snapshot){
                                     console.log('state_changed');
                                   }, function(error) {
                                     console.log(JSON.stringify(error));
                                   }, function() {
                                     // Handle successful uploads on complete
                                     // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                                     var downloadURL = uploadTask.snapshot.downloadURL;
                                     console.log("downloadURL ==>"+downloadURL);
                                     $scope.inputAud.content = downloadURL;
                                     $scope.storeMessage();
                                   });
                                 };

                                 reader.readAsArrayBuffer(resFile);

                               });
                             });

                         })
                         .catch(function(error){
                         });

             };



               $scope.storeMessage = function(){
                   var now = new Date().getTime();
                   $scope.inputAud.time = now;
                   DetailMessages($localStorage.userLogin.id).post($stateParams.id, $scope.inputAud);
                   $scope.Messages = {};
                   $scope.Messages.content = "[audio]";
                   $scope.Messages.time = $scope.inputAud.time;
                   $scope.Messages.unread = 0;
                   Messages($localStorage.userLogin.id).post($stateParams.id, $scope.Messages);
                   Notification().post($stateParams.id);
                   $scope.inputAud = {
                       "from": 0,
                       "type": "audio"
                   };
               };


              $scope.changeUrl = function(inputURl){
                console.log("changeUrl ==>"+$sce.trustAsResourceUrl(inputURl));
                return $sce.trustAsResourceUrl(inputURl);
              };

        /* ***************************** GROUP :: Firebase Audio Work-around ****************************************/
})

.controller('settingsCtrl', function($scope, $ionicModal, $http, $ionicPopup, IonicClosePopupService, $state, $localStorage, User, Settings, Camera) {
    $scope.profile = User($localStorage.userLogin.id).get();
    $scope.changeAvatar = function() {
        var options = {
            sourceType: 0,
            allowEdit: true,
            targetWidth: 160,
            targetHeight: 160,
            destinationType: 0
        };
        Camera.getPicture(options).then(function(imageData) {
            $scope.avatar = "data:image/jpeg;base64," + imageData;
            User($localStorage.userLogin.id).editAvatar($scope.avatar);
        }, function(err) {
            console.log(err);
        });
    };
    $ionicModal.fromTemplateUrl('templates/settings/name.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.modalChangeName = modal;
    });
    $scope.showChangeName = function() {
        $scope.modalChangeName.show();
    };
    $scope.closeChangeName = function() {
        $scope.modalChangeName.hide();
    };
    $scope.changeName = function() {
        if ($scope.profile.name.length <= 20) {
            User($localStorage.userLogin.id).editName($scope.profile.name);
            $scope.closeChangeName();
        }
    };
    $ionicModal.fromTemplateUrl('templates/settings/phone.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.modalChangePhone = modal;
    });
    $scope.showChangePhone = function() {
        $scope.modalChangePhone.show();
    };
    $scope.closeChangePhone = function() {
        $scope.modalChangePhone.hide();
    };
    $scope.dataPhone = {};
    $scope.dataPhone.areacode = $localStorage.userLogin.areacode;
    $scope.alertPhone = function() {
        var confirmPopup = $ionicPopup.confirm({
            template: 'Your phone number is too short in the country enter<br/><br/>Enter the country code if you have not entered',
            cssClass: 'popup-confirm-delete',
            buttons: [{
                text: 'OK',
                type: 'button-clear button-no-delete col-50 col-offset-50'
            }]
        });
    };
    $scope.changePhone = function() {
        if ($scope.dataPhone.areacode && $scope.dataPhone.phone) {
            $scope.phoneFull = $scope.dataPhone.areacode.toString() + $scope.dataPhone.phone;
            alert($scope.phoneFull.length);
            if ($scope.phoneFull.length >= 10) {
                User($localStorage.userLogin.id).editPhone($scope.phoneFull);
                $scope.closeChangePhone();
            } else $scope.alertPhone();
        } else $scope.alertPhone();
    };
    $scope.changeGender = function(gender) {
        if (gender == 0) gender = "Male";
        else gender = "Female";
        User($localStorage.userLogin.id).editGender(gender);
    };

    $scope.settings = {};
    $scope.settings.messages = Settings($localStorage.userLogin.id).get('messages');
    $scope.changeMessages = function(child) {
        var data = $scope.settings.messages[child];
        child = 'messages/' + child;
        Settings($localStorage.userLogin.id).change(child, data);
    };

    $scope.lastUpdate = $localStorage.lastUpdate;
    $scope.settings.contacts = Settings($localStorage.userLogin.id).get('contacts');
    $scope.changeContacts = function(child) {
        var data = $scope.settings.contacts[child];
        child = 'contacts/' + child;
        Settings($localStorage.userLogin.id).change(child, data);
    };
    $scope.showPopupSettingsListFriends = function() {
        var popupSettingsListFriends = $ionicPopup.show({
            title: 'Friends list show in contacts',
            cssClass: 'popup-select-radio',
            scope: $scope,
            template: '<ion-radio ng-model="settings.contacts.show_friend" ng-value="true" ng-click="changeContacts(\'show_friend\'); closePopupSettingsListFriends()">All friends</ion-radio><ion-radio ng-model="settings.contacts.show_friend" ng-value="false" ng-click="changeContacts(\'show_friend\'); closePopupSettingsListFriends()">Friends who use Hichat</ion-radio>'
        });
        $scope.closePopupSettingsListFriends = function() {
            popupSettingsListFriends.close();
        };
        IonicClosePopupService.register(popupSettingsListFriends);
    };

    $scope.settings.languages = Settings($localStorage.userLogin.id).get('languages');
    $scope.showPopupSettingsLanguages = function() {
        var popupSettingsLanguages = $ionicPopup.show({
            title: 'Language',
            cssClass: 'popup-select-radio',
            scope: $scope,
            templateUrl: 'templates/settings/language.html'
        });
        $scope.closePopupSettingsLanguages = function() {
            popupSettingsLanguages.close();
        };
        IonicClosePopupService.register(popupSettingsLanguages);
    };
    $scope.changeLanguage = function() {
        Settings($localStorage.userLogin.id).change('languages/language', $scope.settings.languages.language);
    }
    $scope.showPopupSettingsFonts = function() {
        var popupSettingsFonts = $ionicPopup.show({
            title: 'Select font',
            cssClass: 'popup-select-radio',
            scope: $scope,
            template: '<ion-radio ng-model="settings.languages.font" ng-value="true" ng-click="changeFont(); closePopupSettingsFonts()">Hichat font</ion-radio><ion-radio ng-model="settings.languages.font" ng-value="false" ng-click="changeFont(); closePopupSettingsFonts()">System font</ion-radio>'
        });
        $scope.closePopupSettingsFonts = function() {
            popupSettingsFonts.close();
        };
        IonicClosePopupService.register(popupSettingsFonts);
    };
    $scope.changeFont = function() {
        Settings($localStorage.userLogin.id).change('languages/font', $scope.settings.languages.font);
    };

    $scope.showPopupLogout = function() {
        var confirmPopup = $ionicPopup.confirm({
            template: 'Log out?',
            cssClass: 'popup-confirm-logout',
            buttons: [{
                text: 'NO',
                type: 'button-clear button-no-logout'
            }, {
                text: 'YES',
                type: 'button-clear',
                onTap: function(e) {
                    delete $localStorage.userLogin;
                    $state.go('walkthrough');
                }
            }, ]
        });
    };
})

.controller('changePasswordCtrl', function($scope, $ionicPopup, $state, $localStorage, Login) {
    $scope.data = {};
    $scope.warning = false;
    $scope.showValue = {
        "type": "password",
        "text": "Show"
    }
    $scope.showPassword = function() {
        if ($scope.showValue.type == "password") {
            $scope.showValue = {
                "type": "text",
                "text": "Hide"
            }
        } else {
            $scope.showValue = {
                "type": "password",
                "text": "Show"
            }
        }
    };
    $scope.showcurrentValue = {
        "type": "password",
        "text": "Show"
    }
    $scope.showcurrentPassword = function() {
        if ($scope.showcurrentValue.type == "password") {
            $scope.showcurrentValue = {
                "type": "text",
                "text": "Hide"
            }
        } else {
            $scope.showcurrentValue = {
                "type": "password",
                "text": "Show"
            }
        }
    }
    $scope.updatePassword = function() {
        $scope.warning = false;
        if (!$scope.data.oldpassword || !$scope.data.password || !$scope.data.repassword) {
            $scope.warning = true;
        } else {
            if ($scope.data.password != $scope.data.repassword) $scope.showPopupError();
            else {
                $scope.User = Login().get($localStorage.userLogin.phone);
                $scope.User.$loaded(function() {
                    if ($scope.data.oldpassword != $scope.User.password) $scope.warning = true;
                    else {
                        Login().changePass($localStorage.userLogin.phone, $scope.data.password);
                        $scope.data = {};
                        $state.go('settingsAccount');
                    }
                });
            }
        }
    };
    $scope.showPopupError = function() {
        var confirmPopup = $ionicPopup.confirm({
            template: 'Invalid confirm password, please check and try again.',
            cssClass: 'popup-confirm-logout',
            buttons: [{
                text: 'CLOSE',
                type: 'button-clear button-no-logout'
            }]
        });
    };
})

.controller('searchCtrl', function($scope, $state, $localStorage, $ionicPopup, IonicClosePopupService, Contacts, User, Block) {
    $scope.showLoading('Loading...');
    if (angular.isUndefined($localStorage.searchRecent)) $localStorage.searchRecent = new Object;
    $scope.Recent = $localStorage.searchRecent;
    $scope.Search = new Array;
    $scope.Contacts = Contacts($localStorage.userLogin.id).get();
    $scope.Contacts.$loaded(function() {
        angular.forEach($scope.Contacts, function(value) {
            var Person = {
                "id": value.$id
            };
            Person.name = User(value.$id).getName();
            Person.avatar = User(value.$id).getAvatar();
            $scope.Search.push(Person);
        });
        $scope.hideLoading();
    });
    $scope.viewMessages = function(id) {
        $state.go('detail', {
            id: id
        });
    };
    $scope.deleteRecent = function(name, id) {
        var confirmPopup = $ionicPopup.confirm({
            title: name,
            cssClass: 'popup-menu-contact',
            buttons: [{
                text: 'Clear search history',
                type: 'button-clear',
                onTap: function(e) {
                    delete $localStorage.searchRecent[id];
                }
            }, ]
        });
        IonicClosePopupService.register(confirmPopup);
    };
    $scope.choseContact = function(contact) {
        $localStorage.searchRecent[contact.id] = contact;
        $scope.viewMessages(contact.id);
    };
    $scope.showMenuSearch = function(name, id) {
        var confirmPopup = $ionicPopup.confirm({
            title: name,
            cssClass: 'popup-menu-contact',
            buttons: [{
                text: 'Block',
                type: 'button-clear',
                onTap: function(e) {
                    $scope.Block = Block($localStorage.userLogin.id).get(id);
                    $scope.Block.$loaded(function() {
                        if ($scope.Block.$value) {
                            Block($localStorage.userLogin.id).remove(id);
                            location.reload();
                        } else {
                            var confirmPopup = $ionicPopup.confirm({
                                template: 'This person will not be able to send messages to you.Block him/her?',
                                cssClass: 'popup-confirm-delete',
                                buttons: [{
                                    text: 'NO',
                                    type: 'button-clear',
                                }, {
                                    text: 'YES',
                                    type: 'button-clear button-no-delete',
                                    onTap: function(e) {
                                        Block($localStorage.userLogin.id).block(id);
                                        location.reload();
                                    }
                                }, ]
                            });
                        }
                    });
                }
            }, {
                text: 'Remove friend',
                type: 'button-clear',
                onTap: function(e) {
                    Contacts($localStorage.userLogin.id).remove(id);
                }
            }]
        });
        IonicClosePopupService.register(confirmPopup);
    };
})
