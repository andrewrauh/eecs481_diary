var React = require('react');
var Router = require('react-router');
var _ = require('underscore');


var CaseStore = require('../../stores/CaseStore');
var SettingsActions = require('../../actions/SettingsActions');
var CurrentUserStore = require('../../stores/CurrentUserStore');

var _stream = undefined;

var TakeImage = React.createClass({

	getInitialState: function(){

		return {
			width: "350",
			height: "240",
			currentPhoto: null,
			hidden: true
		};
	},

	componentDidUpdate: function(prevProps, prevState){
		if(prevState.hidden === true && this.state.hidden === false){
			this._initiateCamera();
		}
	},

	componentDidMount: function(){
		if(this.props.registerCallback){
			this.props.registerCallback(this._getPhoto);
		}
	},

	_getPhoto: function(){
		return {
			data: {
				photo: this.state.currentPhoto				
			}
		}
	},



	_initiateCamera: function(){
	    var video = this.refs.videoStream.getDOMNode();
	    var canvas = this.refs.canvas.getDOMNode();
	    var photo = this.refs.photo.getDOMNode();
	    var startbutton = this.refs.startbutton.getDOMNode();

	    navigator.getMedia = ( navigator.getUserMedia ||
                           navigator.webkitGetUserMedia ||
                           navigator.mozGetUserMedia ||
                           navigator.msGetUserMedia);
			navigator.getMedia(
			{
			video: true,
			audio: false
			},
		function(stream) {
			if (navigator.mozGetUserMedia) {
			  video.mozSrcObject = stream;
			} else {
			  var vendorURL = window.URL || window.webkitURL;
			  video.src = vendorURL.createObjectURL(stream);

			}
				console.log(stream);
			  	_stream = stream;
				video.play();
			},
			function(err) {
				console.log("An error occured! " + err);
			    video.pause();
			    video.src='';
			    video.removeAttribute("src");

			    //Video disabled; hide interface
			    $(photo).hide();
			    $(canvas).hide();
			    $(video).hide();
			    $(startbutton).hide();
			}
		);

		this.clearphoto();
	},

	clearphoto: function(){
	    var canvas = this.refs.canvas.getDOMNode();
	    var photo = this.refs.photo.getDOMNode();

		var context = canvas.getContext('2d');
		context.fillStyle = "#FFF";
		context.fillRect(0, 0, canvas.width, canvas.height);

		var data = canvas.toDataURL('image/png');
		photo.setAttribute('src', data);
	},

	takepicture: function (event) {
		event.preventDefault();
		var canvas = this.refs.canvas.getDOMNode();
		var video = this.refs.videoStream.getDOMNode();
	    var photo = this.refs.photo.getDOMNode();

		console.log('takepicture');

		var context = canvas.getContext('2d');
		if (true) {
			console.log(video);

			canvas.width = $(video).innerWidth();
			canvas.height = $(video).innerHeight();
			context.drawImage(video, 0, 0, $(video).innerWidth(), $(video).innerHeight());

		  var data = canvas.toDataURL('image/png');
		  console.log(data);
		  photo.setAttribute('src', data);
		  this.setState({
		  	currentPhoto: data
		  });
		} else {
			console.log('hi');
			this.clearphoto();
		}
	},

	_showControls: function(event){
		event.preventDefault();
		this.setState({
			hidden: false
		});
	},

	componentWillUnmount: function(){

		console.log('begin image unmount');
		console.log(this.refs.videoStream);
		if(this.refs.videoStream !== undefined &&
			(_stream !== undefined))
		{
			console.log("unmount");
		    var video = this.refs.videoStream.getDOMNode();
		    video.pause();
		    _stream.stop();
		    video.src="";
		    video.removeAttribute("src");
		}

	},

	render: function(){
		var cameraControls = null;
		if(this.state.hidden === false){
			cameraControls = (<div className="row">	
					<button className="btn btn-default btn-lg" ref="startbutton" onClick={this.takepicture}>Take Photo</button>

					<div className=".col-md-6 .col-sm-6 .col-xs-12">
						<video ref="videoStream" style={{width: this.state.width}}>Video stream not available.</video>
					</div>

					<h3>Taken Photo is shown below (if exists)</h3>

					<div className=".col-md-6 .col-sm-6 .col-xs-12" >
						<img ref="photo" alt="The screen capture will appear in this box."/>
					</div>

					<canvas ref="canvas" style={{display:"none"}}>
					</canvas>
				</div>
			);

		} else {
			cameraControls = (<div>
				<button className="btn btn-lg btn-default" onClick={this._showControls}>Show Photo Controls</button>
			</div>);
		}

		return (<span>
			{cameraControls}
		</span>);
	}
});

module.exports = TakeImage;