describe("Application Tests", function() {

    // Arrange
    var scope, httpBackend, controller, mockApplication, mockReferenceData, mockNotification, mockApplicationHomeModel;

    beforeEach(function() {
        angular.mock.module("ngRoute");
        angular.mock.module("appService");
        angular.mock.module("applicationService");
        angular.mock.module("app.application");
        angular.mock.module("ui.bootstrap");
        
        /*angular.mock.module(function($provide) {
            $provide.value("ApplicationHomeModel", mockApplicationHomeModel);
        });*/

        angular.mock.inject(function ($rootScope, $httpBackend, $controller, Application, ReferenceData, Notification, ApplicationHomeModel) {
            httpBackend = $httpBackend;
            scope = $rootScope.$new();

            httpBackend.whenGET("api/referencedata/firearmapplicationstatus").respond(
                [
                    { id: 1, name: "Submitted" }
                ]
            );
            httpBackend.whenPOST("api/application/search").respond(
                [
                    { id: 1, name: "My First Firearm Application" },
                    { id: 2, name: "My Second Firearm Application" }
                ]
            );

            mockApplication = Application;
            mockReferenceData = ReferenceData;
            mockNotification = Notification;
            mockApplicationHomeModel = ApplicationHomeModel;

            createController = function () {
                return $controller("ApplicationHomeCtrl", {
                    $scope: scope,
                    Application: mockApplication,
                    ReferenceData: mockReferenceData,
                    Notification: mockNotification,
                    ApplicationHomeModel: mockApplicationHomeModel
                });
            }
        });

        /*angular.mock.inject(function ($controller, $rootScope) {
            mockScope = $rootScope.$new();
            controller = $controller("ApplicationHomeCtrl", {
                $scope: mockScope,
                Application: mockApplication,
                ReferenceData: mockReferenceData,
                Notification: mockNotification,
                ApplicationHomeModel: mockApplicationHomeModel
            });
        });*/
    });

    // Act / Assert

    it("controller is defined", function () {
        controller = createController();
        expect(controller).toBeDefined();
    });

    it("empty search criteria", function () {
        controller = createController();
        expect(scope.hasCriteria()).not.toBeTruthy();
    });

    it("has search criteria", function () {
        controller = createController();
        scope.criteria.applicant.surname = "French";
        expect(scope.hasCriteria()).toBeTruthy();
    });

    it("has firearm reference data", function () {
        controller = createController();
        httpBackend.flush();
        expect(scope.firearmApplicationStatus.length).toEqual(1);
    });

    it("valid search returns results", function () {
        controller = createController();
        scope.search(true);
        httpBackend.flush();
        expect(scope.results.length).toEqual(2);
    });
});