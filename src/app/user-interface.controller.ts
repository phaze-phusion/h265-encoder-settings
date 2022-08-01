import {fromEvent} from 'rxjs';
import {elementId} from './static/elementId.enum';
import {pickById} from './functions/utlis';
import {MachineClass} from './components/Machine.class';

export function initializeInterface(): void {
  const machine = new MachineClass();

  fromEvent(<HTMLTextAreaElement>pickById(elementId.convertButton), 'click')
    .subscribe(
      () => {
        machine.convert();
      }
    );
}
