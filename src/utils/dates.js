import dayjs from 'dayjs';

const humanizeMovieReleaseDate = (releaseDate) => dayjs(releaseDate).format('YYYY');
const humanizePopupReleaseDate = (releaseDate) => dayjs(releaseDate).format('DD MMMM YYYY');
const humanizeCommentDate = (commentDate) => dayjs(commentDate).format('YYYY/MM/DD HH:mm');

export { humanizeMovieReleaseDate, humanizePopupReleaseDate, humanizeCommentDate };
