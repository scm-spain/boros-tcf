import {ObservableEventStatus} from './ObservableEventStatus'

export class ObservableFactory {
  constructor() {
    this._id = 0
  }

  create({observer}) {
    return new ObservableEventStatus({id: ++this._id, observer})
  }
}
