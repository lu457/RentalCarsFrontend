import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal, AfterViewInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute } from '@angular/router';
import { ConfigService } from '../../../core/config.service';
import { Vehiculo } from '../../../models/vehiculo.model';
import { VehiculoService } from '../vehiculo.service';

import * as jQuery from 'jquery';
const $: any = jQuery;

import 'owl.carousel';

@Component({
  selector: 'app-vehiculo-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './vehiculo-detail.component.html',
  styleUrl: './vehiculo-detail.component.css',
})
export class VehiculoDetailComponent implements OnInit, AfterViewInit, OnDestroy {
  vehiculo = signal<Vehiculo | null>(null);
  isLoading = signal<boolean>(true);
  defaultImage = 'assets/default-vehiculo.webp';
  modalImageSrc = signal<string>(''); // Imagen del modal
  selectedImage = signal<string>(this.defaultImage); // Imagen principal seleccionada

  private vehiculoService = inject(VehiculoService);
  private route = inject(ActivatedRoute);
  private configService = inject(ConfigService);

  @ViewChild('carousel', { static: false }) carousel!: ElementRef;

  ngOnInit(): void {
    const vehiculoId = this.route.snapshot.paramMap.get('id');
    if (vehiculoId) {
      this.loadVehiculo(vehiculoId);
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (this.carousel) {
        $(this.carousel.nativeElement).owlCarousel({
          items: 1,
          loop: true,
          margin: 10,
          nav: false,
          dots: true,
          autoplay: false,
          autoplayTimeout: 3000,
          autoplayHoverPause: true,
        });
      }
    }, 500);
  }

  ngOnDestroy(): void {
    if (this.carousel) {
      $(this.carousel.nativeElement).trigger('destroy.owl.carousel');
    }
  }

  loadVehiculo(id: string) {
    this.vehiculoService.getVehiculoById(id).subscribe({
      next: (data) => {
        if (data) {
          const imageUrls = data.imageUrls?.length
            ? data.imageUrls.map((img) => this.getFullImageUrl(img))
            : [this.defaultImage];

          this.vehiculo.set({ ...data, imageUrls });
          this.selectedImage.set(imageUrls[0]); // La primera imagen es la principal
        }
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      },
    });
  }

  getFullImageUrl(imagePath: string): string {
    return imagePath.startsWith('http')
      ? imagePath
      : `${this.configService.apiUrl}${imagePath}`;
  }

  abrirModal(imagenUrl: string): void {
    this.modalImageSrc.set(imagenUrl);
  }

  changeMainImage(img: string): void {
    this.selectedImage.set(img); // Cambia la imagen principal
  }

  changeImage(index: number): void {
    if (this.carousel) {
      $(this.carousel.nativeElement).trigger('to.owl.carousel', [index, 300]);
    }
  }

  prevImage(): void {
    const images = this.vehiculo()?.imageUrls ?? [];
    const currentIndex = images.indexOf(this.selectedImage());
  
    if (currentIndex > 0) {
      this.selectedImage.set(images[currentIndex - 1]); // Imagen anterior
    } else {
      this.selectedImage.set(images[images.length - 1]); // Vuelve a la última imagen
    }
  }
  
  nextImage(): void {
    const images = this.vehiculo()?.imageUrls ?? [];
    const currentIndex = images.indexOf(this.selectedImage());
  
    if (currentIndex < images.length - 1) {
      this.selectedImage.set(images[currentIndex + 1]); // Imagen siguiente
    } else {
      this.selectedImage.set(images[0]); // Vuelve a la primera imagen
    }
  }
  
}
