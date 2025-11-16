import {Collection, Model} from '@nozbe/watermelondb';

export default class BaseModel extends Model {
  static collection: Collection<Model>;

  static callReader<T>(action: () => Promise<T>): Promise<T> {
    return this.collection.db._workQueue.subAction(action);
  }
}
