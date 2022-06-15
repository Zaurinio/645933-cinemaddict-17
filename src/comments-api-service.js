import ApiService from './framework/api-service.js';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE'
};

export default class CommentsApiService extends ApiService {

  getComments(movie) {
    return this._load({ url: `comments/${movie.id}` })
      .then(ApiService.parseResponse);
  }

  addComment = async (movie, comment) => {
    const response = await this._load({
      url: `comments/${movie.id}`,
      method: Method.POST,
      body: JSON.stringify(comment),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    });
    const parsedResponse = await ApiService.parseResponse(response);
    movie.comments = parsedResponse.comments.map((it) => it.id);

    return movie;
  };
}
