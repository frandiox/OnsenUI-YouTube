
angular.module('myApp')

// Controller

.controller('VideosController', function ($scope, $http, $log, VideosService) {

    init();

    function init() {
      $scope.youtube = VideosService.getYoutube();
      $scope.results = VideosService.getResults();
      $scope.history = VideosService.getHistory();
    }

    $scope.launch = function (id, title, archive) {
      VideosService.launchPlayer(id, title);
      if (archive) {
      	VideosService.archiveVideo(id, title);
      }
      $log.info('Launched id:' + id + ' and title:' + title);
    };

    $scope.nextPageToken = '';
    $scope.lastQuery = '';
    $scope.loading = false;

    $scope.search = function () {
      $scope.loading = true;
      var query = this.query;
      $http.get('https://www.googleapis.com/youtube/v3/search', {
        params: {
          key: 'AIzaSyDiByKCET1fLAuBHJL462BXx2lnKXce6so',
          type: 'video',
          maxResults: '10',
          pageToken: $scope.nextPageToken,
          part: 'id,snippet',
          fields: 'items/id,items/snippet/title,items/snippet/description,items/snippet/thumbnails/default,items/snippet/channelTitle,nextPageToken',
          q: query
        }
      })
      .success( function (data) {
        VideosService.listResults(data, $scope.nextPageToken && ($scope.lastQuery === query));
        $scope.lastQuery = query;
        $scope.nextPageToken = data.nextPageToken;
        $log.info(data);
      })
      .error( function () {
        $log.info('Search error');
      })
      .finally( function () {
        $scope.loadMoreButton.stopSpin();
        $scope.loadMoreButton.setDisabled(false);
        $scope.loading = false;
      })
      ;
    }
});