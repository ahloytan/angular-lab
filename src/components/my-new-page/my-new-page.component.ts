import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { SupabaseService } from '../../shared/supabase.service';

@Component({
  selector: 'app-my-new-page',
  templateUrl: './my-new-page.component.html',
  styleUrl: './my-new-page.component.scss',
  imports: [CommonModule, MatTableModule],
  standalone: true
})
export class MyNewPageComponent {

  displayedColumns: string[] = ['id', 'name', 'age', 'email'];
  users: any[] = [
    { id: 1, name: 'Alice', age: 28, email: 'alice@example.com' },
    { id: 2, name: 'Bob', age: 35, email: 'bob@example.com' },
    { id: 3, name: 'Charlie', age: 22, email: 'charlie@example.com' }
  ];
  news: any = [];

  constructor(
    public readonly supabaseService: SupabaseService
  ) {
  }

  ngOnInit() {
    this.getNews();
  }

  async getNews() {
    const { data, error } = await this.supabaseService.getNews();
    if (error) {
      console.error('Error fetching news:', error);
    } else {
      this.news = data;
      console.log("CHOMIK", data)

    }
  }
}
