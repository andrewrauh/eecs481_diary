var AppDispatcher = require('../dispatcher/AppDispatcher');
var DiaryConstants = require('../constants/DiaryConstants');
var _ = require('underscore');
var EventEmitter = require('events').EventEmitter;


var _diary_entries = {};

function addEntry(data){
	console.log(data);
	_diary_entries[data.id] = data;
}

function updateEntry(data){
	addEntry(data);
}

function removeEntry(entry_id){
	delete _diary_entries[entry_id];
}

var DiaryEntryStore = _.extend({}, EventEmitter.prototype, {
	emitChange: function(){
		console.log('emit');
		this.emit('change');
	},

	// Add change listener
	addChangeListener: function(callback) {
		this.on('change', callback);
	},

	// Remove change listener
	removeChangeListener: function(callback) {
		this.removeListener('change', callback);
	},

	getEntries: function(){
		return _diary_entries;
	},

	getEntry: function(entry_id){
		return _diary_entries[entry_id];
	}
});

// Register callback with AppDispatcher
AppDispatcher.register(function(payload) {
	var action = payload.action;

	switch(action.actionType) {
		case DiaryConstants.DIARY_ADD:
			addEntry(action.data);
			DiaryEntryStore.emitChange();
			break;

		case DiaryConstants.DIARY_REMOVE:
			removeEntry(action.entry.id);
			DiaryEntryStore.emitChange();
			break;

		case DiaryConstants.DIARY_UPDATE:
			updateEntry(action.data);
			DiaryEntryStore.emitChange();
			break;

		default:
			return true;
	}



	return true;
});

module.exports = DiaryEntryStore;


