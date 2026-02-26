import { TestBed, ComponentFixture } from '@angular/core/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatTableHarness } from '@angular/material/table/testing';
import { NewsTableComponent } from './news-table.component';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('NewsComponent', () => {
  let fixture: ComponentFixture<NewsTableComponent>;
  let loader: any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewsTableComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(NewsTableComponent);
    loader = TestbedHarnessEnvironment.loader(fixture);
    fixture.detectChanges();
  });

  it('should call getNews() on button click', async () => {
    const spy = vi.spyOn(fixture.componentInstance, 'getNews');
    const button = await loader.getHarness(MatButtonHarness.with({ text: 'Get News' }));
    await button.click();
    expect(spy).toHaveBeenCalled();
  });

  it('should display data in table and manage loading state', async () => {
    fixture.componentInstance.news = [{ id: 1, description: 'Test', created_at: '2024' }];
    fixture.componentInstance.isLoading = true;
    fixture.detectChanges();

    const table = await loader.getHarness(MatTableHarness);
    expect((await table.getRows()).length).toBe(1);
    
    const button = await loader.getHarness(MatButtonHarness.with({ text: 'Get News' }));
    expect(await button.isDisabled()).toBe(false);
  });
});
