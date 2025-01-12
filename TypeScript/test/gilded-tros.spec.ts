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
      const degradingQuality = 1;
      const items: Item[] = [new Item('foo', 20, minQuality), new Item('bar', -1, degradingQuality)];
      const app: GildedTros = new GildedTros(items);

      app.updateQuality();

      expect(app.items[0].quality).toEqual(minQuality);
      expect(app.items[1].quality).toEqual(0);
    });
    it('does not increase quality above 50', () => {
      const maxQuality = 50;
      const increasingQuality = 49;
      const items: Item[] = [new Item('Good Wine', 20, maxQuality), new Item('Backstage passes for Re:Factor', 6, increasingQuality)];
      const app: GildedTros = new GildedTros(items);

      app.updateQuality();

      expect(app.items[0].quality).toEqual(maxQuality);
      expect(app.items[1].quality).toEqual(maxQuality);
    });
    it('degrades quality twice as fast when sellIn has reached < 0', () => {
      const startingQuality = 10;
      const startingSellIn = -1;
      const items: Item[] = [new Item('foo', startingSellIn, startingQuality)];
      const app: GildedTros = new GildedTros(items);

      app.updateQuality();

      expect(app.items[0].quality).toEqual(startingQuality - 2);
    });
  });

  describe('Specific items', () => {
    it('Good Wine increases in quality', () => {
      const startingQuality = 0;
      const startingQualityMax = 50;
      const items: Item[] = [new Item('Good Wine', 20, startingQuality), new Item('Good Wine', 20, startingQualityMax)];
      const app: GildedTros = new GildedTros(items);

      app.updateQuality();

      expect(app.items[0].quality).toEqual(startingQuality + 1);
      expect(app.items[1].quality).toEqual(startingQualityMax);
    });
    it('B-DAWG Keychain does not change in quality', () => {
      const fixedQuality = 80;
      const items: Item[] = [new Item('B-DAWG Keychain', 20, fixedQuality)];
      const app: GildedTros = new GildedTros(items);

      app.updateQuality();

      expect(app.items[0].quality).toEqual(fixedQuality);
    });
    describe('Smelly items', () => {
      it('decreases quality twice as fast (> 0 sellIn)', () => {
        const startingQuality = 20;
        const items: Item[] = [
          new Item('Duplicate Code', 10, startingQuality),
          new Item('Long Methods', 10, startingQuality),
          new Item('Ugly Variable Names', 10, startingQuality),
        ];
        const app: GildedTros = new GildedTros(items);

        app.updateQuality();

        app.items.forEach((item: Item) => expect(item.quality).toEqual(startingQuality - 2));
      });
      it('decreases quality twice as fast (< 0 sellIn)', () => {
        const startingQuality = 20;
        const items: Item[] = [
          new Item('Duplicate Code', -1, startingQuality),
          new Item('Long Methods', -1, startingQuality),
          new Item('Ugly Variable Names', -1, startingQuality),
        ];
        const app: GildedTros = new GildedTros(items);

        app.updateQuality();

        app.items.forEach((item: Item) => expect(item.quality).toEqual(startingQuality - 2 * 2));
      });
    });
    describe('Backstate passes', () => {
      const startingQuality = 20;
      const startingSellIn = 11;
      const items: Item[] = [
        new Item('Backstage passes for Re:Factor', startingSellIn, startingQuality),
        new Item('Backstage passes for HAXX', startingSellIn, startingQuality),
      ];
      it('increases in quality by 1 when > 10 days are left', () => {
        const app: GildedTros = new GildedTros(items);

        app.updateQuality();

        app.items.forEach((item: Item) => expect(item.quality).toEqual(startingQuality + 1));
      });
      it('increases in quality by 2 when <= 10 days > 5 days are left', () => {
        const startDay = 10;
        const endDay = 5;
        const newItems = items.map((item: Item) => ({ ...item, sellIn: 10, quality: 20 }));
        const app: GildedTros = new GildedTros(newItems);

        for (let i = startDay; i > endDay; i--) {
          app.updateQuality();

          app.items.forEach((item: Item) => expect(item.quality).toEqual(startingQuality + (startDay + 1 - i) * 2));
        }
      });
      it('increases in quality by 3 when <= 5 days are left', () => {
        const startDay = 5;
        const endDay = 0;
        const newItems = items.map((item: Item) => ({ ...item, sellIn: 5, quality: 20 }));
        const app: GildedTros = new GildedTros(newItems);

        for (let i = startDay; i > endDay; i--) {
          app.updateQuality();

          app.items.forEach((item: Item) => expect(item.quality).toEqual(startingQuality + (startDay + 1 - i) * 3));
        }
      });
      it('drops to 0 quality when < 0 days are left', () => {
        const newItems = items.map((item: Item) => ({ ...item, sellIn: -1, quality: 20 }));
        const app: GildedTros = new GildedTros(newItems);

        app.updateQuality();

        app.items.forEach((item: Item) => expect(item.quality).toEqual(0));
      });
    });
  });
});
