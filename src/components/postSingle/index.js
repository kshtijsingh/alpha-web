import React from 'react';
import {connect} from 'react-redux';

import indexStyles from '../../index.scss';
import PostUserMeta from '../postUserMeta';
import {getCommunitiesForPost} from '../../utils/communityUtils';
import {fixUser} from '../../utils/defaultFixUtils';
import styles from './styles.scss';
import PostData from '../postData';
import ActionBar from '../actionBar';

class PostSingle extends React.Component {
	getLeftSection() {
		if (this.props.post.json_metadata.content.data[0].type === 'image') {
			return	<div className={['uk-width-1-1@s', 'uk-width-1-2@m', 'uk-width-1-2@l', 'uk-padding-remove'].join(' ')}>
				<PostData data={this.props.post.json_metadata.content.data[0]}/>
			</div>
		}
	}

	getRightSection() {
		let containsImage = this.props.post.json_metadata.content.data[0].type === 'image';
		let classes = ['uk-width-1-1@s', 'uk-width-2-3@m', 'uk-width-1-3@l'];
		containsImage && (classes = ['uk-width-1-1@s', 'uk-width-1-2@m', 'uk-width-1-2@l'])
		let data = containsImage ? this.props.post.json_metadata.content.data[1] : this.props.post.json_metadata.content.data[1]
		return <div className={classes.concat([]).join(' ')}>
			<PostUserMeta profile={{name: this.props.postingUser.json_metadata.profile.name, image: this.props.postingUser.json_metadata.profile.profile_image}}
				created={this.props.post.created} communities={getCommunitiesForPost(this.props.post)} className={['uk-padding-remove-left'].join(' ')}/>
			<div className={[styles.rightContent].join(' ')}>
				{data.content}
			</div>
			<ActionBar post={this.props.post}/>
		</div>
	}

	render() {
		return <div uk-grid={'true'} className={[indexStyles.white].join(' ')}>
			{this.getLeftSection()}
			{this.getRightSection()}
		</div>
	}
}

const mapStateToProps = (state, ownProps) => {
	let post = state.allPosts.posts[ownProps.postPermlink];
	let postingUsername = post.author;
	let postingUser = fixUser(state.allUsers.users[postingUsername], postingUsername);
	return {
		post: state.allPosts.posts[ownProps.postPermlink],
		postingUser,
	}
};

export default connect(mapStateToProps)(PostSingle);