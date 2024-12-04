import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private categories:string[] = [];
  constructor() { 
    this.categories = [
      "Succulents",
      "Flowering Plants",
      "Foliage Plants",
      "Herbs",
      "Cacti",
      "Indoor Plants",
      "Outdoor Plants",
      "Air Plants",
      "Carnivorous Plants",
      "Climbing Plants",
      "Bonsai Trees",
      "Palm Trees"
    ];
  }
  get getAllCategories() {
    return this.categories;
  }
}
