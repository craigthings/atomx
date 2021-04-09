import AtomState from './AtomState';

export class AtomUID extends AtomState<string> {
  constructor() {
    super();
    this.generate();
  }

  generate = () => {
    this.value = this.getUID();
  };

  getUID = ():string => {
    return (
      Date.now().toString(36) + Math.random().toString(36).substr(2, 5)
    ).toLowerCase();
  };
}

export class AtomBoolean extends AtomState<boolean> {
  constructor(val:boolean) {
    super(val);
  }

  set = (value:boolean) => {
    let type = typeof value;
    if (type !== "boolean")
      throw new Error(`AtomBoolean: Cannot set Boolean as ${type}.`);
    this.value = Boolean(value);
    this.update();
  };

  get = () => {
    return this.value;
  };

  toggle = () => {
    this.set(!this.value);
  };
}

export class AtomString extends AtomState<string> {
  constructor(defaultValue:string) {
    super(defaultValue);
  }

  set = (value:string) => {
    let type = typeof value;
    if (type !== "string")
      throw new Error(`AtomString: Cannot set String as ${type}.`);
    this.value = String(value);
    this.update();
  };
}

export class AtomNumber extends AtomState<number> {
  constructor(defaultValue:number) {
    super(defaultValue);
  }

  set = (value:number) => {
    let type = typeof value;
    if (type !== "number")
      throw Error(`AtomNumber: Cannot set Number as ${type}.`);
    this.value = Number(value);
    this.update();
  };
}