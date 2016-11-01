var vcaapp = angular.module("KendoDemos", ["kendo.directives"]);

vcaapp.controller("tab", function ($scope) {
    $scope.hello = "Hello from Controller!";
});

vcaapp.controller("multiSelect", function ($scope) {
    $scope.selectOptions = {
        placeholder: "Select doctors...",
        dataTextField: "ProductName",
        dataValueField: "ProductID",
        valuePrimitive: true,
        autoBind: false,
        dataSource: {
            type: "odata",
            serverFiltering: true,
            transport: {
                read: {
                    url: "http://demos.telerik.com/kendo-ui/service/Northwind.svc/Products",
                }
            }
        }
    };
    $scope.selectedIds = [ 4, 7 ];
})

vcaapp.controller("calender", function ($scope) {
    $scope.startDate = new Date();
    $scope.endDate = new Date();
    //$scope.maxEndDate = new Date();


})