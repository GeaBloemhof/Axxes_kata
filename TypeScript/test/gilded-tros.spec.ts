import { GildedTros } from '../src/gilded-tros';
import { Item } from '../src/item';

describe('GildedTrosTest: updateQuality', () => {
  describe('Basic flow', () => {
    it('reduces quality by 1 at the end of the day', () => {
      const startingQuality = 10;
      const items: Item[] = [new Item('foo', 20, startingQuality)];
      const app: GildedTros = new GildedTros(items);

      app.updateQuality();

      expect(app.items[0].quality).toEqual(startingQuality - 1);
    });
    it('reduces sellIn by 1 at the end of the day', () => {
      const startingSellIn = 20;
      const items: Item[] = [new Item('foo', startingSellIn, 10)];
      const app: GildedTros = new GildedTros(items);

      app.updateQuality();

      expect(app.items[0].sellIn).toEqual(startingSellIn - 1);
    });
  });

  describe('Boundary requirements', () => {
    it('does not reduce quality below 0', () => {
      const minQuality = 0;
      const items: Item[] = [new Item('foo', 20, minQuality)];
      const app: GildedTros = new GildedTros(items);

      app.updateQuality();

      expect(app.items[0].quality).toEqual(minQuality);
    });
    it('does not increase quality above 50', () => {
      const maxQuality = 50;
      const items: Item[] = [new Item('Good Wine', 20, maxQuality)];
      const app: GildedTros = new GildedTros(items);

      app.updateQuality();

      expect(app.items[0].quality).toEqual(maxQuality);
    });
    it('degrades quality twice as fast when sellIn has reached 0', () => {
      const startingQuality = 10;
      const startingSellIn = 0;
      const items: Item[] = [new Item('foo', startingSellIn, startingQuality)];
      const app: GildedTros = new GildedTros(items);

      app.updateQuality();

      expect(app.items[0].quality).toEqual(startingQuality - 2);
    });
  });

  describe('Boundary requirements', () => {});
});
