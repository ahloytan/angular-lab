import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { SupabaseService } from '../../shared/supabase.service';

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
    public readonly supabaseService: SupabaseService
  ) {
  }

  ngOnInit() {
    // this.getNews();
    // this.getNewsCached();
  }

  async getNews(): Promise<any> {
    this.isLoading = true;
    const { data, error } = await this.supabaseService.getNews();
    if (error) {
      console.error('Error fetching news:', error);
    } else {
      this.news = data;
    }
    
    this.isLoading = false;
  }

  async getNewsCached(): Promise<any> {
    this.isLoading = true;
    const { data, error } = await this.supabaseService.getNewsCached();
    if (error) {
      console.error('Error fetching news:', error);
    } else {
      this.newsCached = data;
    }
    
    this.isLoading = false;
  }
}