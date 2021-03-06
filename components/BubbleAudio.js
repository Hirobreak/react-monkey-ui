import React, { Component } from 'react'

// ======================
// jquery.knob.js
require('jquery-knob/dist/jquery.knob.min.js');
var $ = require('jquery');

var playIntervalBubble;
var $bubblePlayer;

class BubbleAudio extends Component {
	constructor(props) {
		super(props);
		this.messageId = (this.props.message.id[0] == '-' ? (this.props.message.datetimeCreation) : this.props.message.id);
		this.state = {
			isDownloading: false,
			disabledClass: 'mky-disabled',
			minutes: ('0' + parseInt(this.props.message.length/60)).slice(-2),
			seconds: ('0' + this.props.message.length%60).slice(-2)
		}
		this.downloadData = this.downloadData.bind(this);
		this.playAudioBubble = this.playAudioBubble.bind(this);
		this.pauseAudioBubble = this.pauseAudioBubble.bind(this);
		this.pauseAllAudio = this.pauseAllAudio.bind(this);
		this.updateAnimationBuble = this.updateAnimationBuble.bind(this);
	}
	
	componentWillMount() {		
        if(this.props.message.data == null && !this.state.isDownloading && !this.props.message.error){
            this.props.dataDownloadRequest(this.props.message.mokMessage);
            this.setState({isDownloading: true});
        }
	}
	
	render() {
		return (
            <div className={'mky-content-audio'}>
                { this.props.message.data
	                ? (
                    	<div className={'mky-content-audio-data'}>
	                        <div id={'mky-bubble-audio-play-button-'+this.messageId} className={'mky-bubble-audio-button mky-bubble-audio-button-'+this.messageId+' mky-bubble-audio-play-button mky-bubble-audio-play-button-green'} onClick={this.playAudioBubble} ></div>
	                        <div id={'mky-bubble-audio-pause-button-'+this.messageId} className={'mky-bubble-audio-button mky-bubble-audio-button-'+this.messageId+' mky-bubble-audio-pause-button mky-bubble-audio-pause-button-green'} onClick={this.pauseAudioBubble} ></div>
	                        <input id={'mky-bubble-audio-player-'+this.messageId} className='knob second'></input>
	                        <div className='mky-bubble-audio-timer'>
	                            <span>{this.state.minutes}</span><span>:</span><span>{this.state.seconds}</span>
	                        </div>
	                        <audio id={'audio_'+this.messageId} preload='auto' controls='' src={this.props.message.data}></audio>
						</div>
                    )
                    : ( this.state.isDownloading
						? ( <div className='mky-content-audio-loading'>
	                        	<div className='mky-double-bounce1'></div>
								<div className='mky-double-bounce2'></div>
							</div>
						) : <div className='mky-content-audio-to-download' onClick={this.downloadData}><i className='icon mky-icon-download'></i></div>
					)
                }
            </div>
		)
	}
	
	componentDidMount() {
		$('#mky-bubble-audio-play-button-'+this.messageId).show();
		$('#mky-bubble-audio-pause-button-'+this.messageId).hide();
		
		this.createAudioHandlerBubble(this.messageId,Math.round(this.props.message.length ? this.props.message.length : 1));
		//this.createAudioHandlerBubble(this.messageId,Math.round(this.props.message.duration));

        let mkyAudioBubble = document.getElementById('audio_'+this.messageId);
        var that = this;
        
        if(mkyAudioBubble){
	        mkyAudioBubble.oncanplay = function() {
                that.createAudioHandlerBubble(that.messageId,Math.round(mkyAudioBubble.duration));
                that.setDurationTime(that.messageId);
//                     that.setState({disabledClass: ''});
            }
        }
	}
	
	downloadData() {
		this.props.dataDownloadRequest(this.props.message.mokMessage);
        this.setState({isDownloading: true});
	}
	
	createAudioHandlerBubble(timestamp, duration) {
		$('#mky-bubble-audio-player-'+timestamp).knob({
            'min': 0,
            'max': duration,
            'angleOffset': -133,
            'angleArc': 265,
            'width': 100,
            'height': 90,
            'displayInput':false,
            'skin':'tron',
            'fgColor': '#00BFA5',
            'thickness': 0.7,
            change : function (value) {
            }
        });
	}
	
	setDurationTime(timestamp) {
        let mkyAudioBubble = document.getElementById('audio_'+timestamp);
        let durationTime= Math.round(mkyAudioBubble.duration);
        let seconds = ('0' + durationTime%60).slice(-2);
        this.setState({seconds: seconds});
        let minutes = ('0' + parseInt(durationTime/60)).slice(-2);
        this.setState({minutes: minutes});
    }
    
    playAudioBubble() {
	    this.pauseAllAudio();
        window.$bubblePlayer = $('#mky-bubble-audio-player-'+this.messageId); //handles the circle
        $('#mky-bubble-audio-play-button-'+this.messageId).hide();
        $('#mky-bubble-audio-pause-button-'+this.messageId).show();
        let audiobuble = document.getElementById('audio_'+this.messageId);
        audiobuble.play();
        window.playIntervalBubble = setInterval(this.updateAnimationBuble,1000);
        var that = this;
        audiobuble.addEventListener('ended',function() {
            that.setDurationTime(that.messageId);
            window.$bubblePlayer.val(0).trigger('change');
			$('#mky-bubble-audio-play-button-'+that.messageId).show();
			$('#mky-bubble-audio-pause-button-'+that.messageId).hide();
            clearInterval(window.playIntervalBubble);
        });
    }
    
    pauseAudioBubble() {
		$('#mky-bubble-audio-play-button-'+this.messageId).show();
		$('#mky-bubble-audio-pause-button-'+this.messageId).hide();
		let audiobuble = document.getElementById('audio_'+this.messageId);
        audiobuble.pause();
        clearInterval(window.playIntervalBubble);
    }
    
    pauseAllAudio() {
	    clearInterval(window.playIntervalBubble);
	    var that = this;
        document.addEventListener('play', function(e){
            var audios = document.getElementsByTagName('audio');
            for(var i = 0, len = audios.length; i < len;i++){
                if(audios[i] != e.target){
                    audios[i].pause();
                    $('.mky-bubble-audio-button').hide();
                    $('.mky-bubble-audio-play-button').show();
                }   
            }
            $('#mky-bubble-audio-play-button-'+that.messageId).hide();
			$('#mky-bubble-audio-pause-button-'+that.messageId).show();
        }, true);
    }
    
    updateAnimationBuble() {
	    let audiobuble = document.getElementById('audio_'+this.messageId);
        var currentTime = Math.round(audiobuble.currentTime);
        window.$bubblePlayer.val(currentTime).trigger('change');
        let seconds = ('0' + currentTime%60).slice(-2);
        this.setState({seconds: seconds});
        let minutes = ('0' + parseInt(currentTime/60)).slice(-2);
        this.setState({minutes: minutes});
    }
}

export default BubbleAudio;