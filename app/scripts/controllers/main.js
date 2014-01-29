'use strict';

angular.module('ticTacBroApp')
  .controller('MainCtrl', function ($scope, angularFire) {
    // these will be bound to firebase, set default values
    $scope.games = [];
    $scope.queue = {};

    // bind $scope.games to firebase
    var games = new Firebase("https://tic-tac-bro.firebaseio.com/games");
    angularFire(games, $scope, "games").then(function () {

      // bind $scope.queue to firebase
      var queue = new Firebase("https://tic-tac-bro.firebaseio.com/queue");
      angularFire(queue, $scope, "queue").then(function () {

        // is there a game on the queue?
        if ($scope.queue.gameId == undefined) {
          // no game on the queue
          console.log("I'm player 1");
          // record the fact that I'm player one
          $scope.player = "p1";

          // make a new game
          var newGame = {
            board: [{mark: ""}, {mark: ""}, {mark: ""}, {mark: ""}, {mark: ""}, {mark: ""}, {mark: ""}, {mark: ""}, {mark: ""}],
            turn: 'p1',
            waiting: true,
            win: false,
            turnCount: 0
          };

          // add the new game to the list of games
          $scope.gameId = $scope.games.push(newGame) - 1;
          // record where that new game was added (as gameId, it's the index in the array)
          $scope.queue.gameId = $scope.gameId;
          console.log("Player 1's game is: " + $scope.gameId);

        } else {
          // a game on the queue
          console.log("I'm player 2");
          // record the fact that I'm player two
          $scope.player = "p2";

          // save the gameId from the queue
          $scope.gameId = $scope.queue.gameId;
          // delete the queue
          $scope.queue = {};
          console.log("Player 2's game is: " + $scope.gameId);
          $scope.games[$scope.gameId].waiting = false;
          // it's game time!
        }
      });

    });

    $scope.playMove = function (cell) {
      if ((!$scope.games[$scope.gameId].waiting) && ($scope.player == $scope.games[$scope.gameId].turn)) {
        if ($scope.player == 'p1') {
          cell.mark = 'X';
        } else {
          cell.mark = 'O';
        }
        if ($scope.games[$scope.gameId].turn == 'p1') {
          $scope.games[$scope.gameId].turn = 'p2';
        } else {
          $scope.games[$scope.gameId].turn = 'p1';
        }
      }
    };
  });
