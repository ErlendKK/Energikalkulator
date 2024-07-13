import { Fasade } from "../objects/Fasade";
import { Vindu } from "../objects/Vindu";

const ANTALL_SONER = 2;
const ANTALL_FASADER_PER_SONE = 3;

export function createFasadeInstances() {
  const fasader = [];

  for (let j = 1; j <= ANTALL_SONER; j++) {
    for (let i = 0; i < ANTALL_FASADER_PER_SONE; i++) {
      const fasade = new Fasade(`f${i}f${j}`, `Sone ${j}`, 100 * (i + 1), 0.5, 1000, i);
      const vindu1 = new Vindu(fasade.id, `v${i + j}v${j * i}`, 10, 1.1, 0.6, 500);
      const vindu2 = new Vindu(fasade.id, `v${i + j}v${2 * j * i}`, 15, 1.2, 0.7, 600);

      fasade.vinduer.push(vindu1, vindu2);

      fasader.push(fasade);
    }
  }

  return fasader;
}
