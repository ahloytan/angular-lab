import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { NewsTableService } from './news-table.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-news-table',
  standalone: true,
  imports: [MatButtonModule, MatProgressSpinnerModule, MatTableModule, MatIconModule],
  templateUrl: './news-table.component.html',
  styleUrl: './news-table.component.scss'
})

export class NewsTableComponent {

  displayedColumns: string[] = ['id', 'description', 'created_at'];
  isLoading: boolean = false;
  news: any = [];
  newsCached: any = [];

  constructor(
    public readonly _newsTableService: NewsTableService
  ) {
  }

  ngOnInit() {
    this.getNews();
    this.getNewsCached();
  }

  async getNews(): Promise<any> {
    this.isLoading = true;
    this._newsTableService.getNews()
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (data) => {
          this.news = data;
        },
        error: (err) => {
          console.error('Error fetching news:', err);
        }
      })
  }

  async getNewsCached(): Promise<any> {
    this.isLoading = true;
    this._newsTableService.getNewsCached()
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (data) => {
          this.newsCached = data;
        },
        error: (err) => {
          console.error('Error fetching news:', err);
        }
      })
  }
}