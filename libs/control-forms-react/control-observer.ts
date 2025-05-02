import { AbstractControl } from '../control-forms';
import { isPropEqual, shallowEqualObjects } from '../control-forms/utils';
import { UpdateScheduler } from './update-scheduler';


type ControlSnapshot<TControl extends AbstractControl> = ReturnType<TControl['getSnapshot']>;


export type TrackResult<TControl extends AbstractControl> = ControlSnapshot<TControl>
& { api: Omit<TControl, keyof ControlSnapshot<TControl>>; instance: TControl; };

export type NotifyOnChangeProps<TControl extends AbstractControl> =
undefined | 'all' | Array<keyof ControlSnapshot<TControl>> | (() => Array<keyof ControlSnapshot<TControl>> | 'all' | undefined);

export interface ControlObserverOptions<TControl extends AbstractControl> {
  notifyOnChangeProps?: NotifyOnChangeProps<TControl>;
}

export class ControlObserver<TControl extends AbstractControl> {

  private snapshot: ControlSnapshot<TControl>;

  private trackedProps = new Set<keyof ControlSnapshot<TControl>>();

  private readonly scheduler = new UpdateScheduler();

  constructor(
    private readonly control: TControl,
    private options: ControlObserverOptions<TControl> = {},
  ) {
    this.snapshot = this.control.getSnapshot() as ControlSnapshot<TControl>;

    this.bindMethods();
  }

  private bindMethods() {
    this.getCurrentSnapshot = this.getCurrentSnapshot.bind(this);
    this.subscribe = this.subscribe.bind(this);
  }

  public getCurrentSnapshot() {
    return this.snapshot;
  }

  public subscribe(callback: () => void) {
    const unsubscribe = this.control.events.subscribe(() => {
      // Debounces updates with setTimeout(cb, 0)
      this.scheduler.scheduleUpdate(() => {
        this.notify();

        callback();
      });
    });

    return () => {
      unsubscribe();
    };
  }

  public setOptions(options: ControlObserverOptions<TControl> | undefined) {
    if (options && !shallowEqualObjects(this.options, options)) {
      this.options = options;
      // TODO: Notify external store
      this.notify();
    }
  }


  private notify() {
    const newSnapshot = this.control.getSnapshot() as ControlSnapshot<TControl>;

    if (shallowEqualObjects(this.snapshot, newSnapshot)) {
      return;
    }

    const checkShouldUpdate = (): boolean => {
      const { notifyOnChangeProps } = this.options;

      const notifyOnChangePropsValue = typeof notifyOnChangeProps === 'function'
        ? notifyOnChangeProps()
        : notifyOnChangeProps;

      if (
        notifyOnChangePropsValue === 'all' ||
        (!notifyOnChangePropsValue && !this.trackedProps.size)
      ) {
        return true;
      }

      const includedProps = new Set(
        notifyOnChangePropsValue ?? this.trackedProps,
      );


      for (const key of includedProps) {
        if (!isPropEqual(newSnapshot[key], this.snapshot[key])) {
          return true;
        }
      }

      return false;
    };

    if (!checkShouldUpdate()) {
      return;
    }

    this.snapshot = newSnapshot;
  }


  trackResult(): TrackResult<TControl> {
    const trackedResult = {} as TrackResult<TControl>;

    const result = this.control.getSnapshot() as ControlSnapshot<TControl>;

    Object.keys(result).forEach((key) => {
      Object.defineProperty(trackedResult, key, {
        configurable: false,
        enumerable: true,
        get: () => {
          this.trackProp(key as keyof ControlSnapshot<TControl>);

          return result[key as keyof ControlSnapshot<TControl>];
        },
      });
    });

    Object.defineProperty(trackedResult, 'api', {
      configurable: false,
      enumerable: true,
      get: () => this.control,
    });

    Object.defineProperty(trackedResult, 'instance', {
      configurable: false,
      enumerable: true,
      get: () => this.control,
    });

    return trackedResult;
  }

  public trackProp(key: keyof ControlSnapshot<TControl>) {
    this.trackedProps.add(key);
  }

}
