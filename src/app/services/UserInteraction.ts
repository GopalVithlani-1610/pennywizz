import {KeyValueStorage} from '@/src/database';

class UserGreet {
  #getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      return 'Good Morning';
    } else if (hour >= 12 && hour < 17) {
      return 'Good Afternoon';
    } else {
      return 'Good Evening';
    }
  };

  async getUserGreet() {
    const greet = this.#getGreeting();
    const userName = (await KeyValueStorage.get('USER_NAME')) ?? 'Budgeter';
    return {
      greet,
      userName,
    };
  }
}

export default new UserGreet();
export type UserInteractionType = typeof UserGreet;
