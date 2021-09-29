import { Component } from '../../framework/core/component.js';
// import Request from '../../framework/appApi/request.js';

class AppFriendActivity extends Component {
  constructor(config) {
    super(config);
    this.data = {
      friends: [
        {
          img: 'saptded.webp',
          nickname: 'Saptded',
          listening_to: 'ТЁЛКА-дрейн',
        },
        {
          img: 'saptded.webp',
          nickname: 'Saptded',
          listening_to: 'ТЁЛКА-дрейн',
        },
        {
          img: 'saptded.webp',
          nickname: 'Saptded',
          listening_to: 'ТЁЛКА-дрейн',
        },
        {
          img: 'saptded.webp',
          nickname: 'Saptded',
          listening_to: 'ТЁЛКА-дрейн',
        },
        {
          img: 'saptded.webp',
          nickname: 'Saptded',
          listening_to: 'ТЁЛКА-дрейн',
        },
        {
          img: 'saptded.webp',
          nickname: 'Saptded',
          listening_to: 'ТЁЛКА-дрейн',
        },
        {
          img: 'saptded.webp',
          nickname: 'Saptded',
          listening_to: 'ТЁЛКА-дрейн',
        },
        {
          img: 'vershov.webp',
          nickname: 'VErshovBMSTU',
          listening_to: 'Чёрные Глаза',
        },
      ],
    };
    // eslint-no-undef
    this.template = Handlebars.templates['friendactivity.hbs'](this.data);
  }
}

export const appFriendActivity = new AppFriendActivity();
