import { Component, computed, signal } from '@angular/core';
import { ItemRow } from './components/item-row';
import { ITEMS } from './data/menu';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Stepper } from './components/stepper';

@Component({
  selector: 'app-root',
  imports: [ItemRow, CurrencyPipe, DatePipe, FormsModule, Stepper],
  templateUrl: './app.html',
})
export class App {
  protected readonly tanggal = new Date(2026, 10, 20);
  protected readonly items = signal(ITEMS);
  protected readonly subtotal = computed(() =>
    this.items().reduce((sum, i) => sum + i.price * i.qty, 0),
  );

  protected readonly newName = signal('');
  protected readonly newPrice = signal<number | null>(null);

  protected readonly jumlahOrang = signal(4);

  protected readonly pajakPersen = signal<number | null>(10);

  protected readonly pajak = computed(
    () => (this.subtotal() * (this.pajakPersen() ?? 0)) / 100,
  );

  protected readonly total = computed(() => this.subtotal() + this.pajak());

  protected readonly perOrang = computed(() =>
    Math.ceil(this.total() / Math.max(1, this.jumlahOrang())),
  );

  protected readonly kategori = computed(() => {
    const p = this.perOrang();
    if (p < 30_000) return { label: 'Hemat', kelas: 'text-bg-success' };
    if (p <= 100_000) return { label: 'Wajar', kelas: 'text-bg-warning' };
    return { label: 'Mahal', kelas: 'text-bg-danger' };
  });

  protected setQty(id: number, qty: number) {
    this.items.update((list) => list.map((i) => (i.id === id ? { ...i, qty } : i)));
  }

  protected remove(id: number) {
    this.items.update((list) => list.filter((i) => i.id != id));
  }

  protected add() {
    const name = this.newName().trim();
    const price = this.newPrice();
    if (!name || !price || price <= 0) return;
    const id = Math.max(0, ...this.items().map((i) => i.id)) + 1;

    this.items.update((list) => [...list, { id, name, price, qty: 1 }]);

    this.newName.set('');
    this.newPrice.set(null);
  }
}