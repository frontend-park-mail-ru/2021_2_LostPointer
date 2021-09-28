import { FWComponent } from '../../framework/index.js';

class AppFriendActivity extends FWComponent {
}

export const appFriendActivity = new AppFriendActivity({
  selector: 'friend-activity',
  template: `
  <div class="friend-activity__header">
      <span class="friend-activity__header-text">Friends Activity</span>
      <img class="friend-activity__header-img" src="/src/static/img/more_friends.svg" alt="">
  </div>
  <div class="friends-container">
      <div class="friend">
          <img class="friend-avatar" src="/src/static/img/saptded.webp">
          <div class="friend-info-container">
              <div class="friend-nickname">Saptded</div>
              <div class="listening-to">ТЁЛКА-дрейн</div>
          </div>
      </div>
      <div class="friend">
          <img class="friend-avatar" src="/src/static/img/saptded.webp">
          <div class="friend-info-container">
              <div class="friend-nickname">Saptded</div>
              <div class="listening-to">ТЁЛКА-дрейн</div>
          </div>
      </div>
      <div class="friend">
          <img class="friend-avatar" src="/src/static/img/saptded.webp">
          <div class="friend-info-container">
              <div class="friend-nickname">Saptded</div>
              <div class="listening-to">ТЁЛКА-дрейн</div>
          </div>
      </div>
      <div class="friend">
          <img class="friend-avatar" src="/src/static/img/saptded.webp">
          <div class="friend-info-container">
              <div class="friend-nickname">Saptded</div>
              <div class="listening-to">ТЁЛКА-дрейн</div>
          </div>
      </div>
      <div class="friend">
          <img class="friend-avatar" src="/src/static/img/saptded.webp">
          <div class="friend-info-container">
              <div class="friend-nickname">Saptded</div>
              <div class="listening-to">ТЁЛКА-дрейн</div>
          </div>
      </div>
      <div class="friend">
          <img class="friend-avatar" src="/src/static/img/saptded.webp">
          <div class="friend-info-container">
              <div class="friend-nickname">Saptded</div>
              <div class="listening-to">ТЁЛКА-дрейн</div>
          </div>
      </div>
      <div class="friend">
          <img class="friend-avatar" src="/src/static/img/saptded.webp">
          <div class="friend-info-container">
              <div class="friend-nickname">Saptded</div>
              <div class="listening-to">ТЁЛКА-дрейн</div>
          </div>
      </div>
      <div class="friend">
          <img class="friend-avatar" src="/src/static/img/vershov.webp">
          <div class="friend-info-container">
              <div class="friend-nickname">VErshovBMSTU</div>
              <div class="listening-to">Чёрные Глаза</div>
          </div>
      </div>
  </div>
  <div class="more-friends">
      <div class="view-all-text">View All</div>
  </div>
  `,
});
