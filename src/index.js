import './scss/styles.scss';

import {elementId} from './es/static/elementId.enum';
import {pickById} from './es/functions/utlis';
import {MachineClass} from './es/components/Machine.class';

window.addEventListener('DOMContentLoaded', () => {
  const machine = new MachineClass();

  pickById(elementId.convertButton).addEventListener('click', () => {
    machine.convert();
  })
});
