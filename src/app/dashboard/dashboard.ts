import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Book } from '../book';
import { BookService } from '../services/book.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard implements OnInit {

  books: Book[] = [];
  newBook: Book = { id: 0, title: '', author: '', isbn: '' };

  isEditing: boolean = false;
  searchTerm: string = '';

  currentPage: number = 1;
  pageSize: number = 5;

  isDarkMode: boolean = false;

  constructor(private bookService: BookService) {}

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks() {
    this.bookService.getBooks().subscribe(data => {
      this.books = data;
    });
  }

  get totalBooks(): number {
    return this.books.length;
  }

  get totalAuthors(): number {
    const authors = this.books.map(b => b.author.toLowerCase());
    return new Set(authors).size;
  }

  get filteredBooks(): Book[] {
    if (!this.searchTerm) return this.books;

    return this.books.filter(book =>
      book.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  get paginatedBooks(): Book[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.filteredBooks.slice(startIndex, startIndex + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredBooks.length / this.pageSize);
  }

  changePage(page: number) {
    this.currentPage = page;
  }

  addOrUpdateBook() {
    if (this.isEditing) {
      this.bookService.updateBook(this.newBook.id, this.newBook).subscribe(() => {
        this.resetForm();
        this.loadBooks();
      });
    } else {
      this.bookService.addBook(this.newBook).subscribe(() => {
        this.resetForm();
        this.loadBooks();
      });
    }
  }

  editBook(book: Book) {
    this.newBook = { ...book };
    this.isEditing = true;
  }

  deleteBook(id: number) {
    this.bookService.deleteBook(id).subscribe(() => {
      this.loadBooks();
    });
  }

  resetForm() {
    this.newBook = { id: 0, title: '', author: '', isbn: '' };
    this.isEditing = false;
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;

    if (this.isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }
}
