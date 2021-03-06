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
import services from "services";

const get = type => {
	return {
		type
	};
};
const getSuccess = (type, payload) => {
	return {
		type,
		payload
	};
};
const getFailure = (type, error) => {
	return {
		type,
		error
	};
};

export const fetchAll = (seed, page, limit) => {
	return dispatch => {
		dispatch(
			get(seed === page && limit !== 4 ? FETCH_ARTICLES : limit === 4 ? FETCH_HOME_ARTICLES : FETCH_MORE_ARTICLES)
		);
		return services.articles
			.getAll(seed, page, limit)
			.then(res => {
				dispatch(
					getSuccess(
						seed === page && limit !== 4
							? FETCH_ARTICLES_SUCCESS
							: limit === 4
								? FETCH_HOME_ARTICLES_SUCCESS
								: FETCH_MORE_ARTICLES_SUCCESS,
						res.data
					)
				);
				return res;
			})
			.catch(err => {
				console.log("err:", err);
				dispatch(
					getFailure(
						seed === page && limit !== 4
							? FETCH_ARTICLES_FAILURE
							: limit === 4
								? FETCH_HOME_ARTICLES_FAILURE
								: FETCH_MORE_ARTICLES_FAILURE,
						err
					)
				);
				return err;
			});
	};
};

export const fetchAllUserArticles = (id, seed, page, limit) => {
	return dispatch => {
		dispatch(get(seed === page ? FETCH_USER_ARTICLES : FETCH_MORE_USER_ARTICLES));
		return services.users
			.getAllArticles({ id, seed, page, limit })
			.then(res => {
				dispatch(getSuccess(seed === page ? FETCH_USER_ARTICLES_SUCCESS : FETCH_MORE_USER_ARTICLES_SUCCESS, res.data));
				return res;
			})
			.catch(err => {
				console.log("err:", err);
				dispatch(getFailure(seed === page ? FETCH_USER_ARTICLES_FAILURE : FETCH_MORE_USER_ARTICLES_FAILURE, err));
				return err;
			});
	};
};

export const fetchOne = id => {
	return dispatch => {
		dispatch(get(FETCH_ARTICLE));
		services.articles
			.getOne(id)
			.then(res => {
				dispatch(getSuccess(FETCH_ARTICLE_SUCCESS, res.data));
			})
			.catch(err => {
				console.log("err:", err);
				dispatch(getFailure(FETCH_ARTICLE_FAILURE, err));
			});
	};
};

export const update = (id, updateData) => {
	return dispatch => {
		dispatch(get(UPDATE_ARTICLE));
		services.articles
			.update(id, updateData)
			.then(res => {
				dispatch(getSuccess(UPDATE_ARTICLE_SUCCESS, res.data));
			})
			.catch(err => {
				console.log("err:", err);
				dispatch(getFailure(UPDATE_ARTICLE_FAILURE, err));
			});
	};
};

export const create = createData => {
	return dispatch => {
		dispatch(get(CREATE_ARTICLE));
		services.articles
			.create(createData)
			.then(res => {
				dispatch(getSuccess(CREATE_ARTICLE_SUCCESS, res));
			})
			.catch(err => {
				console.log("err:", err);
				dispatch(getFailure(CREATE_ARTICLE_FAILURE, err));
			});
	};
};

export const remove = (id, cb) => {
	return dispatch => {
		dispatch(get(DELETE_ARTICLE));
		services.articles
			.delete(id)
			.then(res => {
				dispatch(
					getSuccess(DELETE_ARTICLE_SUCCESS, {
						...res,
						...{
							data: {
								message: "Article deleted",
								deletedArticle: {
									_id: id
								}
							}
						}
					})
				);
				cb();
			})
			.catch(err => {
				console.log("err:", err);
				dispatch(getFailure(DELETE_ARTICLE_FAILURE, err));
			});
	};
};
