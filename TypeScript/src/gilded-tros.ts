import { Item } from './item';

export class GildedTros {
  private readonly MAX_QUALITY = 50;
  private readonly MIN_QUALITY = 0;
  private readonly BP_BOUNDARY_TOP = 10;
  private readonly BP_BOUNDARY_BOTTOM = 5;
  private readonly SELL_IN_BOUNDARY = 0;

  private readonly INCREASE_WHEN_AGING = ['Good Wine'];
  private readonly LEGENDARY_ITEMS = ['B-DAWG Keychain'];
  private readonly BACKSTAGE_PASSES = ['Backstage passes for Re:Factor', 'Backstage passes for HAXX'];
  private readonly SMELLY_ITEMS = ['Duplicate Code', 'Long Methods', 'Ugly Variable Names'];

  constructor(public items: Array<Item>) {}

  public updateQuality(): void {
    let qualityChange: number = -1;

    this.items.forEach((item: Item) => {
      // min and max boundaries
      if (this.isEqualToMin(item.quality) || this.isEqualToMax(item.quality)) {
        this.updateItem(item, 0);
        return;
      }

      // check special items
      if (this.INCREASE_WHEN_AGING.includes(item.name)) {
        this.updateItem(item, 1);
        return;
      }

      if (this.LEGENDARY_ITEMS.includes(item.name)) {
        this.updateItem(item, 0);
        return;
      }

      if (this.BACKSTAGE_PASSES.includes(item.name)) {
        qualityChange = 1;

        if (item.sellIn > this.BP_BOUNDARY_BOTTOM && item.sellIn <= this.BP_BOUNDARY_TOP) {
          this.updateItem(item, 2);
          return;
        }
        if (item.sellIn > this.SELL_IN_BOUNDARY && item.sellIn <= this.BP_BOUNDARY_BOTTOM) {
          this.updateItem(item, 3);
          return;
        }
        if (item.sellIn < this.SELL_IN_BOUNDARY) {
          this.updateItem(item, -item.quality);
          return;
        }
      }

      if (this.SMELLY_ITEMS.includes(item.name)) {
        qualityChange = -2;
      }

      // end of special items

      // increased degrading when reaching 0 for sellIn
      if (this.shouldBeSold(item.sellIn)) {
        this.updateItem(item, qualityChange * 2);
        return;
      }

      this.updateItem(item, qualityChange);
    });
  }

  private readonly isEqualToMin = (quality: number): boolean => quality === this.MIN_QUALITY;
  private readonly isEqualToMax = (quality: number): boolean => quality === this.MAX_QUALITY;
  private readonly shouldBeSold = (sellIn: number): boolean => sellIn < this.SELL_IN_BOUNDARY;

  private updateItem(item: Item, qualityChange: number) {
    item.quality = item.quality + qualityChange;
    item.sellIn--;
  }
}
