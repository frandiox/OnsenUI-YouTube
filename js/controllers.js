
angular.module('myApp')

// Controller

.controller('VideosController', function ($scope, $http, $log, VideosService) {

    init();

    function init() {
      $scope.youtube = VideosService.getYoutube();
      $scope.results = VideosService.getResults();
      $scope.history = VideosService.getHistory();
    }

    $scope.isAndroid = function() {
      return ons.platform.isAndroid();
    }

    $scope.toolbarTitle = 'Search';
    $scope.updateToolbar = function(title) {
      $scope.toolbarTitle = title;
    }

    $scope.focusInput = function(platform) {
      document.getElementById(platform + '-search-input').focus();
    };

    $scope.blurInput = function(platform) {
      document.getElementById(platform + '-search-input').blur();
    };

    $scope.launch = function (video, archive) {
      VideosService.launchPlayer(video.id, video.title);
      if (archive) {
      	VideosService.archiveVideo(video);
      }
      $log.info('Launched id:' + video.id + ' and title:' + video.title);
    };

    $scope.nextPageToken = '';
    $scope.labelSearch = 'You haven\'t searched for any video yet!';
    $scope.labelHistory = 'You haven\'t watched any video yet!';

    $scope.loading = false;

    $scope.loadMore = function(done) {
      $scope.search(false).then(done);
    };

    $scope.search = function (isNewQuery) {
      $scope.loading = true;
      return $http.get('https://www.googleapis.com/youtube/v3/search', {
        params: {
          key: 'AIzaSyAaVxe2e6AbU3FD2pKTQh1_AySRHC1NY8I',
          type: 'video',
          maxResults: '10',
          pageToken: isNewQuery ? '' : $scope.nextPageToken,
          part: 'id,snippet',
          fields: 'items/id,items/snippet/title,items/snippet/description,items/snippet/thumbnails/default,items/snippet/channelTitle,nextPageToken',
          q: this.query
        }
      })
      .success( function (data) {
        if (data.items.length === 0) {
          $scope.label = 'No results were found!';
        }
        VideosService.listResults(data, $scope.nextPageToken && !isNewQuery);
        $scope.nextPageToken = data.nextPageToken;
        $log.info(data);
        $scope.loading = false;
      })
      .error( function (e) {
        $log.info('Search error: ', e);
        $scope.loading = false;
      })
      ;
    };
});
