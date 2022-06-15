import ApiService from './framework/api-service.js';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
};

export default class MoviesApiService extends ApiService {
  get movies() {
    return this._load({ url: 'movies' })
      .then(ApiService.parseResponse);
  }

  updateFilm = async (movie) => {
    const response = await this._load({
      url: `movies/${movie.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptToServer(movie)),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  };

  #adaptToServer = (movie) => ({
    'id': movie.id,
    'comments': movie.comments,
    'film_info': {
      'title': movie.title,
      'alternative_title': movie.alternativeTitle,
      'total_rating': movie.totalRating,
      'poster': movie.poster,
      'age_rating': movie.ageRating,
      'director': movie.director,
      'writers': movie.writers,
      'actors': movie.actors,
      'release': {
        'date': movie.date,
        'release_country': movie.releaseCountry,
      },
      'runtime': movie.runtime,
      'genre': movie.genres,
      'description': movie.description,
    },
    'user_details': {
      'watchlist': movie.watchlist,
      'already_watched': movie.alreadyWatched,
      'watching_date': movie.watchingDate instanceof Date ? movie.watchingDate.toISOString() : null,
      'favorite': movie.favorite,
    },
  });
}
