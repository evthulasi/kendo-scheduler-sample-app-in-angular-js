angular.module("KendoDemos", ["kendo.directives"])
          .controller("MyCtrl", function ($scope, $rootScope, $http, $filter,$window) {

			   $scope.departments=[];
			   $scope.resources=[];
			   var doctorsDs;
			   var docDS;
			   var currentWidth = 2500;
			   var currentView="";
			   var preventIntialLoad = true;
			    function rebindResources (){ 
								preventIntialLoad = false;
								filterDoctors();
								 var scheduler = $("#shedulerGrid").data("kendoScheduler");
							     var resourceDS = new kendo.data.DataSource({
									data: arrSelectedId
								});
							resourceDS.read();
							scheduler.resources[0].dataSource = resourceDS;
							scheduler.view(scheduler.view().name);
							// scheduler.resources[0].dataSource.read();
				}
				
              $scope.init = function () {
				  $http({ method: 'GET', url: 'http://lapmsdev05.vcaantech.com:1111/API/Appointments/MasterData/760/' }).
				  then(function successCallback(response) {
							 doctorsDs=response;
							 if(doctorsDs!=undefined){
								$scope.departments=doctorsDs.data.Data.ProviderTypes;
								if($scope.selectedDept=="-1"){
								$scope.defaultDept="All Departments";
								}
								else if($scope.selectedDept!="-1"){
								$scope.defaultDept = $filter('filter')($scope.departments, {ProviderTypeId: $scope.selectedDept})[0].ProviderType1;
								}
									}	
									if(doctorsDs!=undefined){
										 docDS=doctorsDs.data.Data.AllResources;
										$scope.selectDoctors();
									}
							  }, function errorCallback(response) {
								  var errResp=response;
					  });
					  
                  getDefaultDept= $window.localStorage.getItem('defaultDept');
				  $scope.selectedDept=getDefaultDept;
				  if(getDefaultDept==null)
				  {
					  $scope.selectedDept="-1";
				  }
				  
				var scheduler = $("#shedulerGrid").data("kendoScheduler");
				var startDate=scheduler.view().startDate();
				if(scheduler._selectedViewName=="day")
				{
					var endDate= moment(startDate).add(1, 'days');
				}
				else if(scheduler._selectedViewName!="day")
				{
					var endDate=scheduler.view().endDate();
				}
				
				  $http({ method: 'Get', url: "http://lapmsdev05.vcaantech.com:1111/API/Appointments/760/StartDate/" +moment(startDate).format("YYYY-MM-DD") +"/EndDate/" +moment(endDate).format("YYYY-MM-DD") +"/AppointmentType/All/ProviderType/" + $scope.selectedDept }).then
                    (function successcallback(response) {
						var ids = response.data.Data;
							if(ids!=null && docDS!=null)
							{
								$scope.selectedIds =[];
								for(var i=0;i<ids.length ;i++)
								{
									for(var j=0;j<docDS.length;j++){
										if(docDS[j].ResourceRefId == ids[i])
										{
											$scope.selectedIds.push(docDS[j].ResourceId);
											break;	
										}
									}
								}
							}
							else if(ids==null){
								$scope.selectedIds =[];
							}
						$scope.selectDoctors();
                    });
              }
			  
              $scope.setDefult = function () {
				  $window.localStorage.setItem('defaultDept', $scope.selectedDept);
				  
				  if($scope.selectedDept=="-1"){
						$scope.defaultDept="All Departments";
					}
					else if($scope.selectedDept!="-1"){
						$scope.defaultDept = $filter('filter')($scope.departments, {ProviderTypeId: $scope.selectedDept})[0].ProviderType1;
					}
              }
			
              $scope.selectedDateOption = {
                  change: function () {
						$scope.formatDate = $filter('date')($scope.selectedDate, 'yyyy/M/dd');
						var scheduler = $("#shedulerGrid").data("kendoScheduler");
						scheduler.date(new Date($scope.formatDate));
						scheduler.view("day");
                  }
              }

              $scope.depDocDS = [];
              $scope.selectOptions = {
                  placeholder: "Select doctors...",
                  dataTextField: "ResourceName",
                  dataValueField: "ResourceId",
                  valuePrimitive: true,
                  autoBind: false,
                  cascadeFrom: "size",
                  change: onChange,
                  dataSource: {
                      type: "json",
                      serverFiltering: true,
                      data: $scope.depDocDS
                  }
              };

              $scope.selectDoctors = function () {
					if(doctorsDs!=undefined){
					if($scope.selectedDept!=-1){
					  $scope.depDocDS = $filter('filter')(docDS, { ProviderTypeId: $scope.selectedDept });
					  $scope.selectOptions.dataSource.data = $scope.depDocDS;
					  }
					  else if($scope.selectedDept==-1){
						  $scope.selectOptions.dataSource.data = docDS;
					  }
				  
					var scheduler = $("#shedulerGrid").data("kendoScheduler");
					var startDate=scheduler.view().startDate();
					if(scheduler._selectedViewName=="day")
					{
						var endDate= moment(startDate).add(1, 'days');
					}
					else if(scheduler._selectedViewName!="day")
					{
						var endDate=scheduler.view().endDate();
					}
				   $http({ method: 'Get', url: "http://lapmsdev05.vcaantech.com:1111/API/Appointments/760/StartDate/" +moment(startDate).format("YYYY-MM-DD") +"/EndDate/" +moment(endDate).format("YYYY-MM-DD") +"/AppointmentType/All/ProviderType/" + $scope.selectedDept }).then
                    (function successcallback(response) {
						var ids = response.data.Data;
							if(ids!=null && docDS!=null)
							{
								$scope.selectedIds =[];
								for(var i=0;i<ids.length ;i++)
								{
									for(var j=0;j<docDS.length;j++)
									{
										if(docDS[j].ResourceRefId == ids[i])
										{
											$scope.selectedIds.push(docDS[j].ResourceId);
											break;	
										}
									}
								}
							}
							else if(ids==null)
							{
								$scope.selectedIds =[];
							}
						rebindResources();
                    });
				}
              }
			  
			 var arrSelectedId = [];
			function filterDoctors(){
				arrSelectedId = [];
				if(doctorsDs!=undefined  && $scope.selectedIds!=null)
				{
                    for (var i = 0; i < $scope.selectedIds.length ; i++) {
                      $scope.selectedIds[i];
                      for (var j = 0; j < docDS.length; j++) {
                          if ($scope.selectedIds[i] !== undefined) {
                              if ($scope.selectedIds[i] === docDS[j].ResourceId) {
                                  arrSelectedId.push(docDS[j]);
                                  break;
                              }
                          }
                      }
				}
			}
			}
              var resourceDS;
              function onChange()  {
				 rebindResources();
              }

			  var tmpResources = [
					{
						field: "resourceId",
						dataValueField:"ResourceId",
						dataTextField:"ResourceName",
						name: "Doctors",
						dataSource: { data: arrSelectedId },
						title: "Doctors",
					}
				]
				var appViews ;
				if (window.innerWidth < 600){
					appViews =[
                      { type: "day", selected: true }
					]
				}
				else {
					appViews = [
					  { type: "day",selected: true, showWorkHours: true },
                      { type: "week", showWorkHours: true },
                      "month",
                  ]
				}
				
              $("#shedulerGrid").kendoScheduler({
                  editable: {
                      template: $("#customEditorTemplate").html()
                  },
                  date: new Date(),
                  height: 600,
				  dataBound: function() {
							 var viewName = this.view().name;
							if (viewName.indexOf("timeline") > -1 || viewName.indexOf("month") > -1) {
							  return;
							}
							var targetWidth = 2000;
							var defaltWidth = 900;
							var multiplier = 1;
							if (viewName == "week") {
							  multiplier = 7;
							} 
							
							//resources length * 100px * 7days
							targetWidth = this.resources[0].dataSource.data().length * 80 * multiplier;
								
							if (targetWidth != currentWidth) {
								if(targetWidth < defaltWidth)
									targetWidth=defaltWidth;
							  
							  currentWidth = targetWidth;
							}
							$("#customStyles").remove();
							  var style = "<style id='customStyles'>.k-scheduler-content .k-scheduler-table, .k-scheduler-header .k-scheduler-table {width: {0}px} .k-scheduler-layout > tbody > tr > td:first-child{width: 80px;} .k-scheduler-layout {table-layout: fixed;}</style>";
								if(viewName=="day")
								{
									style = kendo.format(style, defaltWidth);
								}
								else{
									style = kendo.format(style, targetWidth);	
								}
							  $(style).appendTo("body");
							  
							  if (currentView != viewName) {
									currentView=viewName;
							  this.view(viewName);
							}	
						  },
                  views: appViews,
				  snap: false,
                  dataSource: {
					  serverFiltering: true,
                       transport: {
						read: function (e) { 
										var scheduler = $("#shedulerGrid").data("kendoScheduler");
										var startDate=scheduler.view().startDate();
										if(scheduler._selectedViewName=="day")
										{
											var endDate= moment(startDate).add(1, 'days');
										}
										else if(scheduler._selectedViewName!="day")
										{
											var endDate=scheduler.view().endDate();
										}
										
										if (preventIntialLoad === false) {
											$http({ method: 'GET', url: "http://vcapocapi.cloudapp.net/API/Appointments/760/AppointmentType/1/false/" +moment(startDate).format("YYYY-MM-DD") +"/" +moment(endDate).format("YYYY-MM-DD") +"/5200104/" }).
													then(function successCallback(result) {
														e.success(result.data.Data);
												  }, function errorCallback(response) {
															 var errResp=response;
												  });
											  } 
											else {
												e.success([]);
												 }
									}
								},
                      schema: {
                          model: {
                              id: "resourceId",
                              fields: {
                                  appointmentId: { from: "AppointmentId", type: "number" },
                                  appointmentTypeId: { from: "AppointmentTypeId", type: "number" },
                                  breedName: { type: "string", from: "BreedName" },
                                  coOwnerFirstName: { type: "string", from: "CoOwnerFirstName" },
                                  coOwnerLastName: { from: "CoOwnerLastName", type: "string" },
                                  isDropoffPickup: { from: "IsDropoffPickup", type: "boolean" },
                                  isOnline: { from: "IsOnline", type: "boolean" },
                                  isFallout: { type: "boolean", from: "IsFallout" },
                                  lastName: { from: "LastName", type: "string" },
                                  patientId: { from: "PatientId", type: "number" },
                                  petAppointmentId: { from: "PetAppointmentId", type: "number" },
                                  petName: { from: "PetName", type: "string" },
                                  pickupDateTime: { from: "PickupDateTime", type: "date" },
                                  reason: { from: "Reason", type: "string" },
                                  statusId: { from: "StatusId", type: "number" },
                                  isWalkInAppointment: { from: "IsWalkInAppointment", type: "boolean" },
                                  checkInTime: { from: "CheckInTime", type: "Date" },
                                  lastModifiedDate: { from: "LastModifiedDate", type: "Date" },
                                  chartNumber: { from: "ChartNumber", type: "number" },
                                  lastModifiedBy: { from: "LastModifiedBy", type: "string" },
                                  bookedBy: { from: "BookedBy", type: "string" },
                                  bookedDate: { from: "BookedDate", type: "Date" },
                                  plainNotes: { from: "PlainNotes", type: "string" },
                                  confirmedDate: { from: "ConfirmedDate", type: "Date" },
                                  confirmedBy: { from: "ConfirmedBy", type: "string" },
                                  clientAlert: { from: "ClientAlert", type: "string" },
                                  patientAlert: { from: "PatientAlert", type: "string" },
                                  isNewClient: { from: "IsNewClient", type: "boolean" },
                                  isNewPatient: { from: "IsNewPatient", type: "boolean" },
                                  preparedDate: { from: "PreparedDate", type: "Date" },
                                  preparedBy: { from: "PreparedBy", type: "string" },
                                  appointmentAlert: { from: "AppointmentAlert", type: "string" },
                                  reasonCreatedDate: { from: "ReasonCreatedDate", type: "date" },
                                  color: { from: "Color", type: "string" },
                                  isCorporateClient: { from: "IsCorporateClient", type: "boolean" },
                                  companyName: { from: "CompanyName", type: "string" },
                                  patientChartNumber: { from: "PatientChartNumber", type: "number" },
                                  appointmentTypeName: { from: "AppointmentTypeName", type: "string" },
                                  emoticonId: { from: "EmoticonId", type: "number" },
                                  departmentAppointmentTypeId: { from: "DepartmentAppointmentTypeId", type: "number" },
                                  providerTypeId: { from: "ProviderTypeId", type: "number" },
                                  checkOutTime: { from: "CheckOutTime", type: "date" },
                                  checkedInBy: { from: "CheckedInBy", type: "string" },
                                  checkedOutBy: { from: "CheckedOutBy", type: "string" },
                                  isDropoff: { from: "IsDropoff", type: "boolean" },
                                  dropoffDate: { from: "DropoffDate", type: "date" },
                                  dropoffStartTime: { from: "DropoffStartTime", type: "date" },
                                  dropoffEndTime: { from: "DropoffEndTime", type: "date" },
                                  isPickup: { from: "IsPickup", type: "boolean" },
                                  pickupDate: { from: "PickupDate", type: "date" },
                                  pickupStartTime: { from: "PickupStartTime", type: "date" },
                                  pickupEndTime: { from: "PickupEndTime", type: "date" },
                                  taskId: { from: "TaskID", type: "number" },
                                  title: { from: "FirstName", defaultValue: "No name", validation: { required: true } },
                                  start: { type: "date", from: "StartTime" },
                                  end: { type: "date", from: "EndTime" },
                                  //description: { from: "Description" },
                                  resourceId: { from: "ResourceId", defaultValue: 1 },
                                   isAllDay: { type: "boolean", from: "IsAllDay" }
                              }
                          }
                      }
                  },
                  group: {
                      resources: ["Doctors"]
                  },
                  resources: tmpResources
              });
			  $("#shedulerGrid").kendoTooltip({
				  filter: ".k-event > div",
				  position: "top",
				  width: 250,
				  content: kendo.template($('#toolTipTemplate').html())
				});
         })