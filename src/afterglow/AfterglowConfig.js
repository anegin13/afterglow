/**
 * afterglow - An easy to integrate HTML5 video player with lightbox support.
 * @link http://afterglowplayer.com
 * @license MIT
 */
'use strict';

import AfterglowUtil from './AfterglowUtil';

class AfterglowConfig {

	constructor(videoelement, skin = 'afterglow'){

		// Check for the video element
		if(videoelement == undefined){
			console.error('Please provide a proper video element to afterglow');
		}
		else{
			// Set videoelement
			this.videoelement = videoelement;

			// Prepare the options container
			this.options = {};

			// Prepare option variables
			this.setDefaultOptions();
			this.setSkinControls();

			let util = new AfterglowUtil;
			// Initialize youtube if the current player is a youtube player
			if(util.isYoutubePlayer(this.videoelement)){
				this.setYoutubeOptions();	
			}

			// Set the skin
			this.skin = skin;
		}
	}

	/**
	 * Sets some basic options based on the videoelement's attributes
	 * @return {void}
	 */
	setDefaultOptions(){
		// Controls needed for the player
		this.options.controls = true;
		
		// Default tech order
		this.options.techOrder = ["html5","flash"];
	
		// Some default player parameters
		this.options.preload = this.getPlayerAttributeFromVideoElement('preload','auto');
		this.options.autoplay = this.getPlayerAttributeFromVideoElement('autoplay');
		this.options.poster = this.getPlayerAttributeFromVideoElement('poster');
	}

	/**
	 * Gets a configuration value that has been passed to the videoelement as HTML tag attribute
	 * @param  {string}  attributename  The name of the attribute to get
	 * @param  {mixed} fallback      	The expected fallback if the attribute was not set - false by default
	 * @return {mixed}					The attribute (with data-attributename being preferred) or the fallback if none.
	 */
	getPlayerAttributeFromVideoElement(attributename, fallback = false){
		if(this.videoelement.getAttribute("data-"+attributename) !== null){
			return this.videoelement.getAttribute("data-"+attributename);
		} else if(this.videoelement.getAttribute(attributename) !== null){
			return this.videoelement.getAttribute(attributename);
		} else {
			return fallback;
		}
	}

	/**
	 * Sets the controls which are needed for the player to work properly.
	 */
	setSkinControls(){
		// For now, we just output the default 'afterglow' skin children, as there isn't any other skin defined yet
		let children = {
			TopControlBar: {
				children: [
					{
						name: "fullscreenToggle"
					}
				]
			},
			controlBar: {
				children: [
					{
						name: "currentTimeDisplay"
					},
					{
						name: "playToggle"
					},
					{
						name: "durationDisplay"
					},
					{
						name: "progressControl"
					},
					{
						name: "ResolutionSwitchingButton"
					},
					{
						name: "volumeMenuButton",
						inline:true
					},
					{
						name: "subtitlesButton"
					},
					{
						name: "captionsButton"
					}
				]
			}
		};
		this.options.children = children;
	}

	/**
	 * Sets options needed for youtube to work and replaces the sources with the correct youtube source
	 */
	setYoutubeOptions(){
		this.options.showinfo = 0;
		this.options.techOrder = ["youtube"];
		this.options.sources = [{
			"type": "video/youtube",
			"src": "https://www.youtube.com/watch?v="+this.getPlayerAttributeFromVideoElement('youtube-id')
		}];

		let util = new AfterglowUtil;
		if(util.ie().actualVersion >= 8 && util.ie().actualVersion <= 11){
			this.options.youtube = {
				ytControls : 2,
				color : "white"
			};
		}
	}

	getSkinClass(){
		var cssclass="vjs-afterglow-skin";
		if(this.skin !== 'afterglow'){
			cssclass = cssclass + " afterglow-skin-"+this.skin;
		}
		return cssclass;
	}
}

export default AfterglowConfig;