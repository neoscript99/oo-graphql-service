const IGNORE_CLASS = ['ObserverComponent', 'Connect', 'Injector']

export function getClassName(instance: any) {
  let _this = instance;
  while (IGNORE_CLASS.indexOf(_this.constructor.name) > -1)
    _this = _this['__proto__'];
  return _this.constructor.name
}
