import {
	FETCH_ARTICLES,
	FETCH_ARTICLES_SUCCESS,
	FETCH_ARTICLES_FAILURE,
	FETCH_HOME_ARTICLES,
	FETCH_HOME_ARTICLES_SUCCESS,
	FETCH_HOME_ARTICLES_FAILURE,
	FETCH_MORE_ARTICLES,
	FETCH_MORE_ARTICLES_SUCCESS,
	FETCH_MORE_ARTICLES_FAILURE,
	FETCH_USER_ARTICLES,
	FETCH_USER_ARTICLES_SUCCESS,
	FETCH_USER_ARTICLES_FAILURE,
	FETCH_MORE_USER_ARTICLES,
	FETCH_MORE_USER_ARTICLES_SUCCESS,
	FETCH_MORE_USER_ARTICLES_FAILURE,
	FETCH_ARTICLE,
	FETCH_ARTICLE_SUCCESS,
	FETCH_ARTICLE_FAILURE,
	UPDATE_ARTICLE,
	UPDATE_ARTICLE_SUCCESS,
	UPDATE_ARTICLE_FAILURE,
	CREATE_ARTICLE,
	CREATE_ARTICLE_SUCCESS,
	CREATE_ARTICLE_FAILURE,
	DELETE_ARTICLE,
	DELETE_ARTICLE_SUCCESS,
	DELETE_ARTICLE_FAILURE
} from "../constants";

const initialState = {
	articles: {},
	isFetchingArticles: false,
	hasErroredArticles: false,
	articlesError: null,

	homeArticles: {},
	isFetchingHomeArticles: false,
	hasErroredHomeArticles: false,
	homeArticlesError: null,

	userArticles: {},
	isFetchingUserArticles: false,
	hasErroredUserArticles: false,
	userArticlesError: null,

	isFetchingMoreArticles: false,
	hasErroredMoreArticles: false,
	moreArticlesError: null,

	isFetchingMoreUserArticles: false,
	hasErroredMoreUserArticles: false,
	moreUserArticlesError: null,

	article: {},
	isFetchingArticle: false,
	hasErroredArticle: false,
	articleError: null,

	onCreateData: {},
	isFetchingCreateData: false,
	onCreateError: null,

	onUpdateData: {},
	isFetchingUpdateData: false,
	onUpdateError: null,

	onDeleteData: {},
	isFetchingDeleteData: false,
	onDeleteError: null
};

export const articleReducer = (state = initialState, action) => {
	switch (action.type) {
		case FETCH_ARTICLES:
			return {
				...state,
				isFetchingArticles: true,
				articles: {}
			};
		case FETCH_ARTICLES_SUCCESS:
			return {
				...state,
				isFetchingArticles: false,
				articles: action.payload,
				articlesError: null
			};
		case FETCH_ARTICLES_FAILURE:
			return {
				...state,
				isFetchingArticles: false,
				hasErroredArticles: true,
				articlesError: action.error
			};

		case FETCH_HOME_ARTICLES:
			return {
				...state,
				isFetchingHomeArticles: true,
				homeArticles: {}
			};
		case FETCH_HOME_ARTICLES_SUCCESS:
			return {
				...state,
				isFetchingHomeArticles: false,
				homeArticles: action.payload,
				homeArticlesError: null
			};
		case FETCH_HOME_ARTICLES_FAILURE:
			return {
				...state,
				isFetchingHomeArticles: false,
				hasErroredHomeArticles: true,
				homeArticlesError: action.error
			};

		case FETCH_USER_ARTICLES:
			return {
				...state,
				isFetchingUserArticles: true,
				userArticles: {}
			};
		case FETCH_USER_ARTICLES_SUCCESS:
			return {
				...state,
				isFetchingUserArticles: false,
				userArticles: action.payload,
				userArticlesError: null
			};
		case FETCH_USER_ARTICLES_FAILURE:
			return {
				...state,
				isFetchingUserArticles: false,
				hasErroredUserArticles: true,
				userArticlesError: action.error
			};

		case FETCH_MORE_ARTICLES:
			return {
				...state,
				isFetchingMoreArticles: true
			};
		case FETCH_MORE_ARTICLES_SUCCESS:
			return {
				...state,
				isFetchingMoreArticles: false,
				articles: {
					meta: action.payload.meta,
					data: {
						articles: [
							...(Object.keys(state.articles).length ? state.articles.data.articles : {}),
							...action.payload.data.articles
						]
					}
				},
				moreArticlesError: null
			};
		case FETCH_MORE_ARTICLES_FAILURE:
			return {
				...state,
				isFetchingMoreArticles: false,
				hasErroredMoreArticles: true,
				moreArticlesError: action.error
			};

		case FETCH_MORE_USER_ARTICLES:
			return {
				...state,
				isFetchingMoreUserArticles: true
			};
		case FETCH_MORE_USER_ARTICLES_SUCCESS:
			return {
				...state,
				isFetchingMoreUserArticles: false,
				userArticles: {
					meta: action.payload.meta,
					data: {
						articles: [
							...(Object.keys(state.userArticles).length ? state.userArticles.data.articles : {}),
							...action.payload.data.articles
						]
					}
				},
				moreUserArticlesError: null
			};
		case FETCH_MORE_USER_ARTICLES_FAILURE:
			return {
				...state,
				isFetchingMoreUserArticles: false,
				hasErroredMoreUserArticles: true,
				moreUserArticlesError: action.error
			};

		case FETCH_ARTICLE:
			return {
				...state,
				isFetchingArticle: true,
				article: {}
			};
		case FETCH_ARTICLE_SUCCESS:
			return {
				...state,
				isFetchingArticle: false,
				article: action.payload.article,
				articleError: null
			};
		case FETCH_ARTICLE_FAILURE:
			return {
				...state,
				isFetchingArticle: false,
				hasErroredArticle: true,
				articleError: action.error
			};

		case CREATE_ARTICLE:
			return {
				...state,
				onCreateData: [],
				isFetchingCreateData: true
			};
		case CREATE_ARTICLE_SUCCESS:
			return {
				...state,
				isFetchingCreateData: false,
				onCreateData: action.payload,
				onCreateError: null
			};
		case CREATE_ARTICLE_FAILURE:
			return {
				...state,
				isFetchingCreateData: false,
				onCreateError: action.error
			};

		case UPDATE_ARTICLE:
			return {
				...state,
				onUpdateData: [],
				isFetchingUpdateData: true
			};
		case UPDATE_ARTICLE_SUCCESS:
			return {
				...state,
				isFetchingUpdateData: false,
				onUpdateData: action.payload,
				onUpdateError: null
			};
		case UPDATE_ARTICLE_FAILURE:
			return {
				...state,
				isFetchingUpdateData: false,
				onUpdateError: action.error
			};

		case DELETE_ARTICLE:
			return {
				...state,
				onDeleteData: {},
				isFetchingDeleteData: true
			};
		case DELETE_ARTICLE_SUCCESS:
			return {
				...state,
				isFetchingDeleteData: false,
				onDeleteData: action.payload,
				onDeleteError: null
				// article: {}
			};
		case DELETE_ARTICLE_FAILURE:
			return {
				...state,
				isFetchingDeleteData: false,
				onDeleteError: action.error
			};

		default:
			return state;
	}
};
