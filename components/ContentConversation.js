import React, { Component } from 'react'
import TimelineChat from './TimelineChat.js'
import Input from './Input.js'
// import LocationInput from './LocationInput.js'

import Modal from './Modal.js'

import { defineTime, isConversationGroup } from '../utils/monkey-utils.js'

class ContentConversation extends Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			showLocationInput: false,
			messageSelected: undefined
		}
		this.handleMessageSelected = this.handleMessageSelected.bind(this);
		this.handleCloseModal = this.handleCloseModal.bind(this);
		this.showAside = this.showAside.bind(this);
		this.conversationBannerClass= this.props.showBanner && !this.props.isMobile ? 'mnk-converstion-divided':''
		this.defineUrlAvatar = this.defineUrlAvatar.bind(this);
	}

	componentWillReceiveProps(nextProps){
		if(this.props.conversationSelected != nextProps.conversationSelected){
			this.setState({
				showLocationInput: false,
				messageSelected: undefined
			});
		}
	}

	render() {
		return (
	    	<div className={'mky-content-conversation ' + this.conversationBannerClass}>
					<header id='mky-conversation-selected-header'>
						{ this.props.isMobile & this.props.haveConversations
							? <div className="mky-conversation-burger" onClick={this.showAside}><i className="icon mky-icon-menu-hamburguer"></i></div>
							: null
						}
						<div id='mky-conversation-selected-image'><img src={this.defineUrlAvatar()}/></div>
						<div id='mky-conversation-selected-description'>
							<span id='mky-conversation-selected-name'>{this.props.conversationSelected.name}</span>
							{ !isConversationGroup(this.props.conversationSelected.id)
								? ( this.props.conversationSelected.online == 0
									? <span id='mky-conversation-selected-status'> {'Last seen ' + defineTime(this.props.conversationSelected.lastOpenApp)}</span>
									: <span id='mky-conversation-selected-status'> Online </span>
								)
								: <span id='mky-conversation-selected-status'> {this.props.conversationSelected.description}</span>
							}
						</div>
						<div className='mky-signature'>Powered by <a className='mky-signature-link' target='_blank' href='http://criptext.com/'>Criptext</a></div>
					</header>
					{ this.state.showLocationInput
						? <LocationInput messageCreated={this.props.messageCreated} disableGeoInput={this.disableGeoInput.bind(this)} />
						: ( <div className='mky-chat-area'>
								<TimelineChat loadMessages={this.props.loadMessages} conversationSelected={this.props.conversationSelected} messageSelected={this.handleMessageSelected} onClickMessage={this.props.onClickMessage} dataDownloadRequest={this.props.dataDownloadRequest} getUserName={this.props.getUserName}/>
								{ this.state.messageSelected
									? (() => {
											const Modal_ = Modal(this.context.bubblePreviews[this.state.messageSelected.bubbleType]);
											return <Modal_ message={this.state.messageSelected} closeModal={this.handleCloseModal}/>
										}
								    )()
									: null
								}
								<Input enableGeoInput={this.enableGeoInput.bind(this)} messageCreated={this.props.messageCreated}/>
							</div>
						)
					}
				</div>
		)
	}

	handleMessageSelected(message){
		this.setState({messageSelected:message});
	}

	handleCloseModal(){
		this.setState({messageSelected: undefined});
	}

	showAside(){
		if (this.props.isMobile) {
			this.props.expandAside(true);
			this.props.conversationClosed();
		}
	}

	enableGeoInput(){
		this.setState({showLocationInput: true});
	}

	disableGeoInput(){
		this.setState({showLocationInput: false});
	}
	
	defineUrlAvatar(){
		return this.props.conversationSelected.urlAvatar ? this.props.conversationSelected.urlAvatar : 'https://cdn.criptext.com/MonkeyUI/images/userdefault.png';
	}
}

ContentConversation.contextTypes = {
	bubblePreviews: React.PropTypes.object.isRequired
}

export default ContentConversation;
