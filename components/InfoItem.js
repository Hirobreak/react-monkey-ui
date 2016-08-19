import React, { Component } from 'react'

class InfoItem extends Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			showActions: false,
		}
		this.toggleActions = this.toggleActions.bind(this);
		this.renderActions = this.renderActions.bind(this);
	}

	componentWillReceiveProps(nextProps) {

	}

	render() {
    	return (
			<div className="mky-info-list-item">
				<img src={this.props.avatar} />
				<div className="mky-info-list-name">
					<div className="mky-info-content">
						<div className="mky-info-content-name">{this.props.name}</div>
						{this.props.rol ? <div className="mky-info-content-rol">{this.props.rol}</div> : null}
					</div>
					<div className="mky-info-list-desc">{this.props.description}</div>
					{ this.props.actions && this.props.actions.length > 0
						? <div className="mky-info-actions-icon" onClick={this.toggleActions}><i className="icon mky-icon-arrow-down-regular"></i></div>
						: null
					}
					{	
						this.state.showActions && this.props.actions && this.props.actions.length > 0
						? (<div>
							<div className="mky-info-actions">
								{this.renderActions()}
							</div>
							<div className="mky-info-actions-back" onClick={this.toggleActions}>
							</div>
						</div>)
						: null
					}
				</div>
			</div>
		)
	}

	toggleActions(){
		this.setState({
			showActions : !this.state.showActions
		});
	}

	renderActions(){
		var actionList = [];

		this.props.actions.forEach( (action) => {
			if(action){
				actionList.push(<div className="mky-info-action" onClick={ () => { this.toggleActions(); action.func(this.props.id, this.props.conversationSelected.id); } }>
					{action.action}
				</div>);
			}
		})

		return actionList;
	}

}

InfoItem.contextTypes = {
    userSession: React.PropTypes.object.isRequired
}

export default InfoItem;