import { Component } from '../../framework/core/component.js';
// import Request from '../../framework/appApi/request.js';

class AppFriendActivity extends Component {
  constructor(config) {
    super(config);
    this.data = {
      friends: [
        {
          img: 'bc17edcb-4dc4-46cf-9ae9-412cb6bd6955.jpeg',
          nickname: 'Frank Sinatra',
          listening_to: 'Strangers in the Night',
        },
        {
          img: 'e4596b4e-b908-4b33-a788-d68477bc996c.jpeg',
          nickname: 'Земфира',
          listening_to: 'Трафик',
        },
      ],
    };
    // eslint-no-undef
    this.template = Handlebars.templates['friendactivity.hbs'](this.data);
  }
}

export { AppFriendActivity };
