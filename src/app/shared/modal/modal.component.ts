import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {
  @Input() isOpen = false;
  @Input() title = '';
  @Input() content = '';
  @Output() closeModal = new EventEmitter<void>();

  ngOnInit() {
    console.log('ModalComponent initialized');
  }

  onClose() {
    console.log('Modal close clicked');
    this.closeModal.emit();
  }

  onBackdropClick(event: Event) {
    console.log('Backdrop clicked');
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }
} 