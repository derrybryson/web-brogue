define([
    "jquery",
    "underscore",
    "backbone",
    "dispatcher",
    "dataIO/send-generic",
    "backgrid",
    "moment"
], function ($, _, Backbone, dispatcher, send, Backgrid, Moment) {

    var LevelFormatter = _.extend({}, Backgrid.CellFormatter.prototype, {
        fromRaw: function (rawValue, model) {
            if(rawValue == 0) {
                return "Win!";
            }
            else if(rawValue) {
                return "L" + rawValue.toString();
            }
        }
    });

    var LevelCell = Backgrid.StringCell.extend({
        formatter: LevelFormatter
    });

    var WatchGameUriCell = Backgrid.UriCell.extend({

        events : {
            "click #watch-game" : "watchGame"
        },

        watchGame: function(event){
            event.preventDefault();

            var gameId = $(event.target).data("gameid");
            var gameDescription = $(event.target).data("gamedescription");

            send("brogue", "recording", {recording: gameId});
            dispatcher.trigger("recordingGame", {recording: gameDescription});
            self.goToConsole();
        },

        render: function () {

            var formatDate = function(date) {
                return Moment(date).format('MMMM Do YYYY, h:mm:ss a');
            };

            this.$el.empty();
            var rawValue = this.model.get(this.column.get("name"));
            var formattedValue = this.formatter.fromRaw(rawValue, this.model);
            if(formattedValue) {
                this.$el.append($("<a>", {
                    href: '#brogue',
                    title: this.model.title,
                    id: 'watch-game',
                    "data-gameid": formattedValue,
                    "data-gamedescription": this.model.get("username") + "-" + this.model.get("seed") + "-" + formatDate(this.model.get("date"))
                }).text("Watch game"));
            }
            this.delegateEvents();
            return this;
        }
    });

    var tableCells = {
        levelCell: LevelCell,
        watchGameUriCell: WatchGameUriCell
    };

    return tableCells;
});