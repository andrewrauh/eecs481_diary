var React = require('react');
var Router = require('react-router');
var ServerRequests = require('../utils/ServerRequests');
var DiaryActions = require('../actions/DiaryActions');
var Graffiti = require('./Graffiti');

var Slider = require("./Slider");

function getImageSource(value){
	console.log("/images/pain-"+value+".png");
	return "/images/pain-"+value+".png";
}

var painList = [0, 2, 4, 8, 10];

var AddMoodEntry = React.createClass({

	componentDidMount: function(){
		console.log("Mood mounted");
		if(this.props.registerCallback){
			this.props.registerCallback(this._getData);
		}
	},

	_getData: function(){
		if(this.state.value === null){
			return null;
		} else {
			return {
				value: this.state.value
			};		
		}
	},

	getInitialState: function(){
		return {
			value: null
		}
	},

	_setMood: function(event){
		event.preventDefault();
		var value = event.target.value;
		console.log(value);

		this.setState({
			value: value
		});
	},

	render: function(){

		var selectedStyle = {
			height: "250px",
			borderStyle: "solid",
			borderColor: "black"
		};
		var unselectedStyle = {
			height: "250px",
			borderStyle: "none"
		};

		var moodComponents = painList.map(function(pain){
			var style = pain == this.state.value ? selectedStyle : unselectedStyle;
			console.log(this.state.value + " " + pain);
			return (<input 
				type="image" 
				className=".col-md-3"
				style={style}
				key={pain}
				src={getImageSource(pain)}
				value={pain}
				onClick={this._setMood} 
			/>);
		}.bind(this));

		console.log(moodComponents);

		return (

			<div>
				<h3> How do you feel?</h3><br/>
				{moodComponents}
			</div>
		);
	}
});

module.exports = AddMoodEntry;
