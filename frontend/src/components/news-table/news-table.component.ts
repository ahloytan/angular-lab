import { Component, inject } from '@angular/core';
import { finalize } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { NewsTableService } from './news-table.service';


@Component({
  selector: 'app-news-table',
  standalone: true,
  imports: [MatButtonModule, MatProgressSpinnerModule, MatTableModule, MatIconModule],
  templateUrl: './news-table.component.html',
  styleUrl: './news-table.component.scss'
})

export class NewsTableComponent {
  private _snackBar = inject(MatSnackBar);

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

  getNews(): void {
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

  getNewsCached(): void {
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

  public openSnackBar() {
    const message = "Please ping @ahloysius if you would like a demo of this feature about Service Worker. It's currently disabled!";
    this._snackBar.open(message, '', {
      duration: 3000
    });
  }
}