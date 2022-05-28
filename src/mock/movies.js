import { nanoid } from 'nanoid';

export const generateMovie = () => (
  {
    id: nanoid(),
    filmCommentsId: [
      0, 1, 2, 3, 4
    ],
    filmInfo: {
      title: 'A Little Pony Without The Carpet',
      alternativeTitle: 'Laziness Who Sold Themselves',
      totalRating: 5.3,
      poster: 'images/posters/the-dance-of-life.jpg',
      ageRating: 0,
      director: 'Tom Ford',
      writers: [
        'Takeshi Kitano'
      ],
      actors: [
        'Morgan Freeman'
      ],
      release: {
        date: '2019-05-11T00:00:00.000Z',
        releaseCountry: 'Finland'
      },
      runtime: '77',
      genre: [
        'Comedy'
      ],
      description: 'Oscar-winning film, a war drama about two young people, from the creators of timeless classic Nu, Pogodi! and Alice in Wonderland, with the best fight scenes since Bruce Lee.'
    },
    userDetails: {
      watchlist: false,
      alreadyWatched: true,
      watchingDate: '2019-04-12T16:12:32.554Z',
      favorite: false
    },
  }
);
