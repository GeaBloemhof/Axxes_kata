import { Item } from './item';

export class GildedTros {
  private readonly BP_BOUNDARY_BOTTOM = 5;
  private readonly BP_BOUNDARY_TOP = 10;
  private readonly MAX_QUALITY = 50;
  private readonly MAX_QUALITY_LEGENDARY = 80;
  private readonly MIN_QUALITY = 0;
  private readonly SELL_IN_BOUNDARY = 0;

  private readonly BACKSTAGE_PASSES = ['Backstage passes for Re:Factor', 'Backstage passes for HAXX'];
  private readonly INCREASE_WHEN_AGING_ITEMS = ['Good Wine'];
  private readonly LEGENDARY_ITEMS = ['B-DAWG Keychain'];
  private readonly SMELLY_ITEMS = ['Duplicate Code', 'Long Methods', 'Ugly Variable Names'];

  constructor(public items: Array<Item>) {}

  public updateQuality(): void {
    let qualityChange: number = -1;

    this.items.forEach((item: Item) => {
      // special items
      if (this.LEGENDARY_ITEMS.includes(item.name)) {
        this.updateItem(item, 0, this.MAX_QUALITY_LEGENDARY);
        return;
      }

      if (this.INCREASE_WHEN_AGING_ITEMS.includes(item.name)) {
        this.updateItem(item, 1);
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
        qualityChange = qualityChange * 2;
      }

      this.updateItem(item, qualityChange);
    });
  }

  private readonly shouldBeSold = (sellIn: number): boolean => sellIn < this.SELL_IN_BOUNDARY;

  private updateItem(item: Item, qualityChange: number, maxQuality = this.MAX_QUALITY) {
    item.sellIn--;

    let newQuality = item.quality + qualityChange;
    newQuality = Math.max(newQuality, this.MIN_QUALITY);
    newQuality = Math.min(newQuality, maxQuality);

    item.quality = newQuality;
  }
}
