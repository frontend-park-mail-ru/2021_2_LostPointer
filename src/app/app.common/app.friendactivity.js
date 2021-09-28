import { FWComponent } from '../../framework/index.js';

class AppFriendActivity extends FWComponent {
  constructor(config) {
    super(config);
    this.selector = 'friend-activity';
    this.template = `
  <div class="friend-activity__header">
      <span class="friend-activity__header-text">Friends Activity</span>
      <img class="friend-activity__header-img" src="/src/static/img/more_friends.svg" alt="">
  </div>
  <div class="friends-container">
      {{# each friends}}
          <div class="friend">
              <img class="friend-avatar" src="/src/static/img/{{ img }}">
              <div class="friend-info-container">
                  <div class="friend-nickname">{{ nickname }}</div>
                  <div class="listening-to">{{ listening_to }}</div>
              </div>
          </div>
      {{/each}}
  </div>
  <div class="more-friends">
      <div class="view-all-text">View All</div>
  </div>
  `;
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
  }
}

export const appFriendActivity = new AppFriendActivity();
