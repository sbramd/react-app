import React, { Component } from "react";
import { Loader, LazyLoad } from "components";
import { ChevronDown, Edit2, X } from "react-feather";
import { Dropdown } from "../..";
import moment from "moment";

export class ArticleDetail extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isDropdownActive: false,
			isFetchingArticle: true,
			createdAt: null
		};
	}

	componentWillReceiveProps = nextProps => {
		if (this.props !== nextProps) {
			const { isFetchingArticle } = nextProps;
			if (this.props.isFetchingArticle && !isFetchingArticle) {
				this.setState({ isFetchingArticle: false, createdAt: moment(nextProps.articleData.created_at).fromNow() });
			}
		}
	};

	// shouldComponentUpdate = (nextProps, nextState) => {
	// 	if (this.state.isDropdownActive) return false;
	// 	return true;
	// };

	_handleDropdownClick = (event, cb = () => {}) => {
		// console.log(cb);
		this.setState({ isDropdownActive: !this.state.isDropdownActive }, () => cb());
	};

	_handleDeleteClick = event => {
		const { articleData, onDeleteArticle, onDeleteComments } = this.props;
		onDeleteComments(articleData._id);
		onDeleteArticle(articleData._id, () => {
			this._handleDropdownClick(event, () => this.props.history.push("/blog"));
		});
	};

	render = () => {
		const {
			authenticationData,
			isLoadingAuthentication,

			articleData,
			// hasErroredArticle,
			articleError,
			// isFetchingArticle,

			// onDeleteArticle,
			// onDeleteArticleData,
			isFetchingDeleteArticleData,
			// onDeleteArticleError,

			// onDeleteComments,
			// onDeleteAllCommentsData,
			isFetchingDeleteAllCommentsData
			// onDeleteAllCommentsError
		} = this.props;

		return isLoadingAuthentication || this.state.isFetchingArticle ? (
			<div className="news-loader-content">
				<Loader />
			</div>
		) : articleError || !articleData.author_id ? (
			<div className="news-loader-content">
				<p>We couldn't find this article.</p>
			</div>
		) : (
			<React.Fragment>
				{articleData.featured_image_url && (
					<div className="news-masthead">
						<LazyLoad
							figure
							className="news-featured-image"
							style={{
								backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, .3), rgba(0, 0, 0, 0.1)),
			url("${articleData.featured_image_url}")`
							}}
							overlayClassName="push"
							src={articleData.featured_image_url}
							background="darken-light"
						/>
					</div>
				)}
				<div className={`news-view-content ${!articleData.featured_image_url && "clear"}`}>
					<div className="container">
						<section className="row">
							<article className="column">
								<header className="news-info-wrapper">
									<div className="news-tag-wrapper">
										<span className="tag active">{articleData.category.toLowerCase()}</span>
									</div>
									<h1>{articleData.title}</h1>
									<div className="news-meta-wrapper">
										<div className="news-meta">
											<span>{articleData.author_id.name.toLowerCase()}</span>
											<span>{"\u00b7"}</span>
											<time>{this.state.createdAt}</time>
										</div>
										{articleData.author_id._id === authenticationData._id && (
											<div className="news-meta-dropdown-wrapper">
												<div className="news-meta-dropdown-btn" onClick={event => this._handleDropdownClick(event)}>
													<ChevronDown className="news-meta-dropdown-icon" />
												</div>
												{this.state.isDropdownActive && (
													<Dropdown
														shouldDropdownShrink={false}
														items={[
															{
																icon: Edit2,
																title: "Edit",
																isLoadingSelf: false,
																isLoadingSibling: isFetchingDeleteArticleData || isFetchingDeleteAllCommentsData,
																onClick: event => {
																	this.props.history.push(`/blog/${articleData.slug}/edit`);
																}
															},
															{
																icon: X,
																title: "Delete",
																isLoadingSelf: isFetchingDeleteArticleData,
																isLoadingSibling: false,
																onClick: event => this._handleDeleteClick(event)
															}
														]}
													/>
												)}
											</div>
										)}
									</div>
								</header>
								<div id="news-view-description" dangerouslySetInnerHTML={{ __html: articleData.description }} />
							</article>
						</section>
					</div>
				</div>
			</React.Fragment>
		);
	};
}
