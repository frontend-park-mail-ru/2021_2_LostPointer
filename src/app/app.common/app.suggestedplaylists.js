import { Component } from '../../framework/core/component.js';

class AppSuggestedPlaylists extends Component {
  constructor(props) {
    super(props);
    this.data = {
      playlists: [
        {
          img: 'yur.jpg',
          name: 'Jail Mix',
        },
        {
          img: 'albina.jpeg',
          name: 'Resine Working Mix Extended',
        },
        {
          img: 'starboy.jpg',
          name: 'Workout Mix 2',
        },
      ],
    };
    this.template = Handlebars.templates['suggestedplaylists.hbs'](this.data);
  }
}

export const appSuggestedPlaylists = new AppSuggestedPlaylists();
