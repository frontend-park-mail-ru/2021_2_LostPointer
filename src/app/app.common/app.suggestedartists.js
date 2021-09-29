import { Component } from '../../framework/core/component.js';

class AppSuggestedArtists extends Component {
  constructor(props) {
    super(props);
    this.template = `
    <div class="suggested-artists">
        <div class="suggested-artists__header">Top Artists</div>
        <div class="suggested-artists__container">
        {{# each artists}}
            <img class="suggested-artist" src="{{ img }}">
        {{/each}}
        </div>
    </div>
    `;
    this.data = {
      artists: [
        {
          img: '/src/static/img/starboy.jpg',
        },
        {
          img: '/src/static/img/albina.jpeg',
        },
        {
          img: '/src/static/img/yur.jpg',
        },
        {
          img: '/src/static/img/id.jpeg',
        },
      ],
    };
  }
}

export const appSuggestedArtists = new AppSuggestedArtists();
