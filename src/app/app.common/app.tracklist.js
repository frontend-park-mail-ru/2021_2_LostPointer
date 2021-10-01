import { Component } from '../../framework/core/component.js';

class AppTrackList extends Component {
  constructor(props) {
    super(props);
    this.data = {
      tracks: [
        {
          img: 'saptded.webp',
          name: 'Песня про кабанчик и стаканчик и прочие приколы',
          artist: 'Saptded',
        },
        {
          img: 'saptded.webp',
          name: 'Песня про кабанчик и стаканчик и прочие приколы',
          artist: 'Saptded',
        },
        {
          img: 'saptded.webp',
          name: 'Песня про кабанчик и стаканчик и прочие приколы',
          artist: 'Saptded',
        },
        {
          img: 'saptded.webp',
          name: 'Песня про кабанчик и стаканчик и прочие приколы',
          artist: 'Saptded',
        },
        {
          img: 'saptded.webp',
          name: 'Песня про кабанчик и стаканчик и прочие приколы',
          artist: 'Saptded',
        },
      ],
    };
    this.template = Handlebars.templates['tracklist.hbs'](this.data);
  }
}

export { AppTrackList };
