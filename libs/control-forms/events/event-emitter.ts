import { FormEvent } from './types';


type UnsubscribeFn = () => void;

type EventCallback<TEvent extends FormEvent> = (event: TEvent) => unknown;

export class EventEmitter<TEvent extends FormEvent> {

  private readonly store = new Map<TEvent['type'], Set<EventCallback<TEvent>>>();

  private readonly allEventsListeners = new Set<EventCallback<TEvent>>();

  public emit(event: TEvent) {
    const subscribers = this.store.get(event.type);

    if (subscribers) {
      subscribers.forEach((callback) => callback(event));
    }

    this.allEventsListeners.forEach((callback) => callback(event));
  }

  public on<TType extends TEvent['type']>(type: TType, callback: EventCallback<Extract<TEvent, { type: TType; }>>): UnsubscribeFn {
    if (!this.store.has(type)) {
      this.store.set(type, new Set());
    }

    this.store.get(type)!.add(callback as EventCallback<TEvent>);

    return () => {
      this.store.get(type)?.delete(callback as EventCallback<TEvent>);
    };
  }

  public off(type: TEvent['type'], callback: EventCallback<TEvent>) {
    this.store.get(type)?.delete(callback);
  }

  public subscribe(callback: EventCallback<TEvent>): UnsubscribeFn {
    this.allEventsListeners.add(callback);

    return () => {
      this.allEventsListeners.delete(callback);
    };
  }

  public clear() {
    this.store.clear();
    this.allEventsListeners.clear();
  }

}


export type ReadonlyEventEmitter<TEvent extends FormEvent> = Omit<EventEmitter<TEvent>, 'emit'>;
