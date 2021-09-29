import { Component } from '../../framework/core/component.js';
// import Request from '../../framework/appApi/request.js';

class AppSuggestedArtists extends Component {
  fetchData() {
    super.fetchData();
    console.log('12');
  }

  constructor(props) {
    super(props);
    this.data = { artists: [] };
    // eslint-no-undef
    this.template = Handlebars.templates['suggestedartists.hbs'](this.data);
  }

  // fetchData() {
  //   return 1;
  // return Request.get('/api/v1/home').then((result) => {
  // eslint-disable-next-line max-len
  //   this.data.artists = result.body.albums.map((e) => ({ img: `/src/static/img/artworks/${e.artWork}` }));
  //   this.template = Handlebars.templates['suggestedartists.hbs'](this.data);
  // });
  // }
}

export const appSuggestedArtists = new AppSuggestedArtists();
