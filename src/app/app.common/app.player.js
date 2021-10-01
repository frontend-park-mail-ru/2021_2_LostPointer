import { Component } from '../../framework/core/component.js';

class AppPlayer extends Component {
  constructor(props) {
    super(props);
    this.data = {
      img: 'albina.jpeg',
      track_name: 'Megalovania',
      artist_name: 'Toby Fox',
      current_time: '00:00',
      total_time: '03:30',
    };
    this.template = Handlebars.templates['player.hbs'](this.data);
  }
}

export { AppPlayer };
