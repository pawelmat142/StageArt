import {
  ArtistLabel,
  ArtistMedia,
  ArtistStyle,
} from '../../artist/model/artist.model';

export const ARTIST_STYLE: ArtistStyle[] = [
  {
    name: 'Techno',
    id: '1',
  },
  {
    name: 'Psytrance',
    id: '2',
  },
  {
    name: 'Breakcore',
    id: '3',
  },
  {
    name: 'Dub Techno',
    id: '4',
  },
  {
    name: 'Breakcore',
    id: '5',
  },
  {
    name: 'Metal',
    id: '6',
  },
  {
    name: 'Rock',
    id: '7',
  },
  {
    name: 'Mathcore',
    id: '8',
  },
  {
    name: 'Deep House',
    id: '9',
  },
];

export const ARTIST_LABEL: ArtistLabel[] = [
  {
    name: 'Pulse Frequencies',
    id: '1',
  },
  {
    name: 'Echo Depths',
    id: '2',
  },
  {
    name: 'Synth Horizon',
    id: '3',
  },
  {
    name: 'Velvet Beats',
    id: '4',
  },
  {
    name: 'Bassforge Collective',
    id: '5',
  },
];

export const ARTIST_MEDIA: { [key: string]: ArtistMedia } = {
  facebook: { code: 'facebook', url: 'https://www.facebook.com/' },
  instagram: { code: 'instagram', url: 'https://www.instagram.com/' },
  soundcloud: { code: 'soundcloud', url: 'https://soundcloud.com/' },
  bandcamp: { code: 'bandcamp', url: 'https://bandcamp.com/' },
  spotify: { code: 'spotify', url: 'https://open.spotify.com/' },
  you_tube: { code: 'you_tube', url: 'https://www.youtube.com/' },
};
