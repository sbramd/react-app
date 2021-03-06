import React, { Component } from "react";
import MediumEditor from "medium-editor";
import { Loader, LazyLoad } from "components";
import { iconPicture, iconEdit, iconMale } from "../../../assets";
import "../../../../node_modules/medium-editor/dist/css/medium-editor.css";
import "../../../../node_modules/medium-editor/dist/css/themes/beagle.css";

const tags = [
	{ name: "tech" },
	{ name: "Startups" },
	{ name: "ENTERTAINMENT" },
	{ name: "Culture" },
	{ name: "Sports" },
	{ name: "lifehacks" },
	{ name: "others" }
];

export class ArticleForm extends Component {
	constructor(props) {
		super(props);
		this.state = {
			title: "",
			description: "",
			// isDescriptionEmpty: true,
			shouldTitleResize: false,
			titleHeight: 75,
			selectedFile: null,
			featuredImage: "",
			isLoadingFeaturedImage: true,
			activeTagIndex: 0,
			errorInputIndex: -1,
			errorInputMessage: "",
			isFetchingUpdateData: false,
			isFetchingArticle: true
		};
		this.editor = null;
	}

	componentDidMount = () => {
		// const editor = this._createEditorInstance();
		// editor.subscribe("editableInput", this._handleEditableInput);

		window.addEventListener("resize", this._handleTitleResize);
	};

	componentWillUnmount = () => {
		if (this.editor) {
			this.editor.unsubscribe("editableInput", this._handleEditableInput);
			const body = document.querySelector("body"),
				anchor = document.getElementsByClassName("medium-editor-anchor-preview"),
				toolbar = document.getElementsByClassName("medium-editor-toolbar");
			if (anchor.length || toolbar.length) for (let el of [anchor[0], toolbar[0]]) body.removeChild(el);
		}

		window.removeEventListener("resize", this._handleTitleResize);
	};

	componentWillReceiveProps = async nextProps => {
		if (this.props !== nextProps) {
			const {
				onFetchOne,

				authenticationData,
				isLoadingAuthentication,

				isFetchingUpdateData,
				onUpdateError,
				// onUpdateData,

				articleData,
				// hasErroredArticle,
				// articleError,
				isFetchingArticle
			} = nextProps;

			if (this.props.isFetchingArticle && !isFetchingArticle) {
				this.setState({ isFetchingArticle: false }, () => {
					if (
						!this.state.isFetchingArticle &&
						!this.state.isFetchingUpdateData &&
						(Object.keys(authenticationData).length || (this.props.isLoadingAuthentication && !isLoadingAuthentication))
					) {
						// await this._sleep(() => {
						setTimeout(() => {
							this.editor = this._createEditorInstance();
							this.editor.subscribe("editableInput", this._handleEditableInput);
							this._setContent(articleData);
						}, 300);
					}
				});
			} else if (this.props.isFetchingUpdateData && !isFetchingUpdateData) {
				if (onUpdateError) {
					this.setState({
						isFetchingUpdateData: false,
						errorInputIndex: 2,
						errorInputMessage: onUpdateError.response
							? onUpdateError.response.data.error
							: "There was a problem adding the information to the database"
					});
				} else {
					this.setState({ isFetchingUpdateData: false, errorInputIndex: -1, errorInputMessage: "" }, () => {
						onFetchOne();
						this._handleFormCancel();
					});
				}
			}

			// this._setContent(articleData);
		}
	};

	// _sleep = (fn, ms) => {
	// 	return new Promise(resolve => {
	// 		setTimeout(() => resolve(fn()), ms);
	// 	});
	// };

	_setContent = articleData => {
		if (this.editor && Object.keys(articleData).length) {
			let activeTagIndex = 0;
			tags.forEach((currentValue, index) => {
				if (currentValue.name.toLowerCase() === articleData.category.toLowerCase()) activeTagIndex = index;
			});

			this.setState(
				{
					title: articleData.title,
					description: articleData.description,
					featuredImage: articleData.featured_image_url,
					activeTagIndex
				},
				() => {
					// console.log(this.state);
					this._handleTitleResize();
					// document.getElementById("title").innerHTML = this.state.title;
					this.editor.setContent(this.state.description, 0);
				}
			);
		}
	};

	_createEditorInstance = () =>
		new MediumEditor("#description", {
			// activeButtonClass: "medium-editor-button-active",
			// buttonLabels: "fontawesome",
			autoLink: true,
			delay: 300,
			// elementsContainer: "document.body",
			targetBlank: true,
			toolbar: {
				buttons: ["bold", "italic", "anchor", "h2", "quote"]
			},
			anchor: {
				placeholderText: "Paste or type a link..."
			},
			paste: {
				cleanPastedHTML: true
			},
			anchorPreview: {
				hideDelay: 300
			},
			placeholder: {
				text: "Tell your story...",
				hideOnClick: false
			}
		});

	_handleEditableInput = (event, editor) => {
		// console.log(editor.innerHTML);
		this.setState(
			{
				description: editor.innerHTML
			}
			// console.log(this.state.description)
		);
	};

	_handleTitleChange = event => {
		this.setState(
			{ title: event.target.value }
			// , () => console.log(this.state.title)
		);
	};

	_handleTitleResize = () => {
		let element = this.hidden;
		if (element)
			this.setState({
				titleHeight: element.clientHeight,
				shouldTitleResize: element.clientHeight <= 75 ? false : true
			});
	};

	// _handleDescriptionChange = () => {
	// 	let value = this.refs.description.innerText;
	// 	this.setState({ description: value.trim() }, () => console.log(this.state.description));
	// };

	// _handleFocus = () => {
	// 	this.setState((prevState, prop) => {
	// 		return {
	// 			isDescriptionEmpty: false
	// 		};
	// 	});
	// };

	// _handleBlur = () => {
	// 	let { description } = this.state;
	// 	this.setState({ isDescriptionEmpty: description ? false : true });
	// };

	_handleFormSubmit = event => {
		event.preventDefault();
		const { authenticationData, onUpdate, articleData } = this.props;
		let createData = {},
			{ title, description, selectedFile, activeTagIndex } = this.state;

		if (!title || title.length < 15 || title.length > 100) {
			this.setState(
				{
					errorInputIndex: 0,
					errorInputMessage: "Title should be between 15 and 100 characters"
				},
				() => this.titleInput.focus()
			);
			return;
		} else if (!description || description.length < 50) {
			this.setState({
				errorInputIndex: 1,
				errorInputMessage: "Story description should be at least 50 characters long"
			});
			return;
		}

		this.setState(
			{
				errorInputIndex: -1,
				errorInputMessage: "",
				isFetchingUpdateData: true
			},
			() => {
				createData.author_id = authenticationData._id;
				createData.title = title;
				createData.description = description;
				if (selectedFile) createData.photos = selectedFile;
				createData.category = tags[activeTagIndex].name;

				let formData = new FormData();
				for (let key in createData) formData.append(key, createData[key]);
				// for (var pair of formData.entries()) console.log(pair[0] + ": " + pair[1]);

				onUpdate(articleData._id, formData);
			}
		);
	};

	_handleFormCancel = () => {
		this.props.history.goBack();
	};

	_handleFileChange = event => {
		if (event.target.files && event.target.files[0]) {
			this.setState({ selectedFile: event.target.files[0] }, () => {
				let reader = new FileReader();
				reader.onload = e => {
					this.setState({ featuredImage: e.target.result });
				};
				reader.readAsDataURL(this.state.selectedFile);
			});
		}
	};

	_triggerFileInput = () => this.fileInput.click();

	_handleTagClick = index => {
		this.setState({ activeTagIndex: index });
	};

	render = () => {
		const {
			isLoadingAuthentication,
			authenticationData

			// isFetchingArticle

			// onCreateData,
			// isFetchingCreateData,
			// onCreateError
		} = this.props;
		let { featuredImage, isFetchingUpdateData, isLoadingFeaturedImage } = this.state,
			props = {};
		if (featuredImage) {
			props = {
				style: {
					backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, .3), rgba(0, 0, 0, 0.1)),
url("${this.state.featuredImage}")`
				}
			};
		}

		return isLoadingAuthentication || this.state.isFetchingArticle ? (
			<div className="news-loader-content">
				<Loader />
			</div>
		) : (
			<React.Fragment>
				<div className="news-masthead">
					<LazyLoad
						figure
						className="news-featured-image"
						{...props}
						src={this.state.featuredImage}
						background="darken-light"
						callback={() => {
							this.setState({ isLoadingFeaturedImage: false });
						}}
						overlayClassName="push"
					/>
					{!isLoadingFeaturedImage && (
						<div className={`news-masthead-overlay ${!this.state.featuredImage && "active"}`}>
							<div className={`${!this.state.featuredImage && "pull"} news-masthead-img-wrapper`}>
								<img
									src={!this.state.featuredImage ? iconPicture : iconEdit}
									alt="Masthead graphic"
									className="news-masthead-graphic"
								/>
							</div>
							<h4>
								{!this.state.featuredImage
									? "Add a high resolution image to your story to capture people’s interest."
									: "Update existing image of your story."}
							</h4>
							<button className="btn inverse" type="button" onClick={this._triggerFileInput}>
								{!this.state.featuredImage ? "upload image" : "update image"}
							</button>
							<input ref={fileInput => (this.fileInput = fileInput)} type="file" onChange={this._handleFileChange} />
						</div>
					)}
				</div>
				<section className="news-editor-content">
					<div className="container">
						<div className="row">
							<header className="column news-editor-heading-wrapper">
								<div className="news-editor-heading-img-wrapper">
									<img
										src={authenticationData.image_url ? authenticationData.image_url : iconMale}
										alt="Card infographic"
										className="news-editor-heading-thumbnail"
									/>
									<div className="news-editor-heading-img-overlay" />
								</div>
								<div className="news-editor-heading-title-wrapper">
									<h3>{authenticationData.name}</h3>
								</div>
							</header>
						</div>
						<div className="row">
							<form id="news-editor-form" className="column" onSubmit={this._handleFormSubmit} autoComplete="off">
								<div className="news-editor-form-input-wrapper">
									<textarea
										ref={input => {
											this.titleInput = input;
										}}
										className={`txt-area news-editor-form-title ${this.state.shouldTitleResize && "resize"}`}
										id="title"
										name="title"
										value={this.state.title}
										// defaultValue={this.state.title}
										placeholder="Title"
										style={{ height: this.state.titleHeight + "px" }}
										// autoFocus
										required
										onChange={this._handleTitleChange}
										onKeyUp={this._handleTitleResize}
									/>
									{this.state.errorInputIndex === 0 && <span>{this.state.errorInputMessage}</span>}
									<div
										className={`txt-area news-editor-form-title hidden ${this.state.shouldTitleResize && "resize"}`}
										ref={c => (this.hidden = c)}
									>
										{this.state.title}
									</div>
								</div>
								<div className="news-editor-form-input-wrapper">
									<textarea
										className="txt-area news-editor-form-description"
										id="description"
										name="description"
										// required
									/>
									{this.state.errorInputIndex === 1 && <span>{this.state.errorInputMessage}</span>}
									{/* <div
										ref="description"
										className={`txt-area news-editor-form-description ${this.state.isDescriptionEmpty &&
											"placeholder"}`}
										id="description"
										onInput={this._handleDescriptionChange}
										onBlur={this._handleBlur}
										onFocus={this._handleFocus}
										contentEditable
										{...(this.state.isDescriptionEmpty
											? { dangerouslySetInnerHTML: { __html: "Tell your story..." } }
											: {})}
									/> */}
								</div>
								<div className="news-editor-tags-wrapper">
									<h4>Select a tag so readers would know what your story is about:</h4>
									<ul className="news-editor-tags">
										{tags.map((obj, i) => (
											<li
												key={i}
												className={`tag ${this.state.activeTagIndex === i && "active"}`}
												onClick={() => this._handleTagClick(i)}
											>
												{obj.name.toLowerCase()}
											</li>
										))}
									</ul>
								</div>
								<div className="news-editor-inputs-wrapper">
									{isFetchingUpdateData ? (
										<Loader />
									) : (
										<div className="news-editor-inputs">
											<input type="submit" className="btn" value="save" />
											<input type="button" className="btn" value="cancel" onClick={this._handleFormCancel} />
										</div>
									)}
									{this.state.errorInputIndex === 2 && <span>{this.state.errorInputMessage}</span>}
								</div>
							</form>
						</div>
					</div>
				</section>
			</React.Fragment>
		);
	};
}
